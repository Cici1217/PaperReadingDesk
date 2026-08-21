#!/usr/bin/env python3
"""Translate PaperReadingDesk's small Codex CLI contract to Claude Code.

The paper pipeline stays provider-neutral: this adapter accepts only the
structured-output flags already used by the project, then invokes Claude Code
in non-interactive, non-persistent mode. It never stores credentials.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path


def option_value(arguments: list[str], name: str) -> str:
    try:
        return arguments[arguments.index(name) + 1]
    except (ValueError, IndexError) as error:
        raise ValueError(f"missing required option {name}") from error


def option_values(arguments: list[str], name: str) -> list[str]:
    return [arguments[index + 1] for index, value in enumerate(arguments[:-1]) if value == name]


def schema_for_claude(value: object) -> object:
    """Remove dialect declarations unsupported by Claude Code's CLI parser.

    Claude validates the inline schema locally and currently treats ``$schema``
    as a reference it must resolve. The project files remain ordinary Draft
    2020-12 schemas; only the copy passed to ``claude --json-schema`` is
    normalized. Keep structural keywords such as ``$ref`` and ``$defs``.
    """

    if isinstance(value, dict):
        return {
            key: schema_for_claude(item)
            for key, item in value.items()
            if key != "$schema"
        }
    if isinstance(value, list):
        return [schema_for_claude(item) for item in value]
    return value


def claude_usage_event(response: dict[str, object]) -> str:
    usage = response.get("usage")
    usage = usage if isinstance(usage, dict) else {}

    def number(key: str) -> int:
        try:
            return max(0, int(usage.get(key, 0) or 0))
        except (TypeError, ValueError):
            return 0

    cached = number("cache_read_input_tokens") + number("cache_creation_input_tokens")
    event = {
        "type": "turn.completed",
        "usage": {
            "input_tokens": number("input_tokens") + cached,
            "cached_input_tokens": cached,
            "output_tokens": number("output_tokens"),
            "reasoning_output_tokens": 0,
        },
    }
    return json.dumps(event, ensure_ascii=False)


def main(arguments: list[str]) -> int:
    try:
        base_command = json.loads(option_value(arguments, "--claude-command-json"))
        model = option_value(arguments, "--claude-model")
        schema_path = Path(option_value(arguments, "--output-schema"))
        output_path = Path(option_value(arguments, "--output-last-message"))
        if not isinstance(base_command, list) or not all(isinstance(part, str) for part in base_command):
            raise ValueError("Claude command must be a JSON string array")
        schema = schema_for_claude(json.loads(schema_path.read_text(encoding="utf-8")))
        prompt = arguments[-1]
        if prompt.startswith("--"):
            raise ValueError("missing prompt")
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"Claude adapter configuration error: {error}", file=sys.stderr)
        return 2

    images = option_values(arguments, "--image")
    if images:
        image_list = "\n".join(f"- {Path(item).resolve()}" for item in images)
        prompt += (
            "\nUse the Read tool to inspect the following authoritative image file(s) before answering:\n"
            + image_list
        )
    command = [
        *base_command,
        "-p", prompt,
        "--output-format", "json",
        "--json-schema", json.dumps(schema, ensure_ascii=False, separators=(",", ":")),
        "--model", model,
        "--no-session-persistence",
        "--disable-slash-commands",
    ]
    if images:
        command.extend(["--tools", "Read", "--allowedTools", "Read"])
        for directory in sorted({str(Path(item).resolve().parent) for item in images}):
            command.extend(["--add-dir", directory])
    else:
        command.extend(["--tools", ""])

    environment = os.environ.copy()
    environment["CLAUDE_CODE_SKIP_PROMPT_HISTORY"] = "1"
    try:
        result = subprocess.run(
            command,
            input=sys.stdin.read(),
            text=True,
            capture_output=True,
            timeout=900,
            check=False,
            env=environment,
        )
    except FileNotFoundError:
        print(
            "Claude Code CLI was not found. Install @anthropic-ai/claude-code, run claude, then use /login.",
            file=sys.stderr,
        )
        return 127
    except subprocess.SubprocessError as error:
        print(f"Claude Code execution failed: {error}", file=sys.stderr)
        return 1

    if result.returncode != 0:
        print((result.stderr or result.stdout or "Claude Code failed").strip(), file=sys.stderr)
        return result.returncode
    try:
        response = json.loads(result.stdout)
        if not isinstance(response, dict):
            raise ValueError("top-level response is not an object")
        if response.get("is_error"):
            raise ValueError(str(response.get("result") or response.get("error") or "unknown Claude error"))
        structured = response.get("structured_output")
        if structured is None:
            candidate = response.get("result", "")
            structured = json.loads(candidate) if isinstance(candidate, str) else candidate
        if not isinstance(structured, (dict, list)):
            raise ValueError("Claude response did not contain structured_output")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(structured, ensure_ascii=False), encoding="utf-8")
        print(claude_usage_event(response))
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"Could not parse Claude structured output: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
