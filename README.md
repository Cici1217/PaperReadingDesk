> 📘 [第一次使用请先查看 PaperReadingDesk 功能展示 PDF](./PaperReadingDesk-Feature-Guide.pdf)

# PaperReadingDesk

PaperReadingDesk 是独立运行的本地论文研读工作台，核心功能是完整处理论文中的图片和公式、翻译技术论文，并提供原文与译文双语对照阅读。

阅读过程中可以生成 AI 论文笔记，目前支持两种方法：

- **三遍阅读法**：按照 Keshav 的三遍阅读框架，整理论文类型、研究背景、核心贡献、方法、实验依据、局限和复现问题。
- **笔记指南法**：作者自己根据做笔记习惯进行总结。根据论文类型重建知识结构，结合关键图片、公式、用户摘录和已有问答，生成可继续编辑的 Markdown 学习笔记。

你也可以随时保存原文、译文或问答结果到摘录。项目另外提供论文摘要和针对选中文本的 AI 问答。

## 环境依赖

- 必需：Python 3.11+、Node.js、npm、Poppler，以及 Codex CLI 或 Claude Code CLI（二选一）
- 推荐：MuPDF（提供 `mutool`，用于更完整的版面解析）
- 可选：Tesseract OCR（仅在扫描版 PDF 没有可用文字层时调用）

## 安装系统依赖

### Ubuntu／Debian

```bash
# 必需
sudo apt update
sudo apt install python3 python3-venv nodejs npm poppler-utils

# 推荐的版面解析与可选 OCR
sudo apt install mupdf-tools tesseract-ocr tesseract-ocr-eng
```

### macOS

先安装 [Homebrew](https://brew.sh/)，然后执行：

```bash
# 必需
brew install python node poppler

# 推荐的版面解析与可选 OCR
brew install mupdf tesseract
```

### Windows

在普通 PowerShell 中执行：

```powershell
# 安装 Scoop（已安装时自动跳过）
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
}

# 必需
scoop install python nodejs-lts poppler

# 推荐的版面解析与可选 OCR
scoop bucket add extras
scoop install mupdf tesseract
```

## 安装项目

先将 `<项目目录>` 替换成 PaperReadingDesk 所在目录。

Ubuntu、Debian 或 macOS：

```bash
cd "<项目目录>"
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
npm install
```

Windows PowerShell：

```powershell
Set-Location "<项目目录>"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
npm install
```

## AI CLI 配置

PaperReadingDesk 支持将 **Codex CLI** 或 **Claude Code CLI** 设为 AI 后端。两种配置可以同时保留，但同一时间只使用主页中标记为“当前使用”的一个。项目只保存 CLI 命令、模型、测试状态等非敏感设置，不保存账号、密码、API Key 或登录令牌。

### Codex

在运行服务的同一系统用户下安装并登录 Codex：

```bash
npm install --global @openai/codex
codex login
codex login status
```

Codex CLI 的最新安装和平台说明以 [OpenAI Codex 文档](https://developers.openai.com/codex/) 为准。

### Claude Code

安装 Claude Code，然后启动交互界面：

```bash
npm install --global @anthropic-ai/claude-code
claude
```

首次运行通常会打开浏览器要求登录。若没有出现登录流程，在 Claude Code 中输入 `/login`；登录后输入 `/status` 检查账号和当前模型。在 SSH、WSL 或容器中浏览器未自动打开时，按 `c` 复制登录网址并在浏览器中打开。登录信息由 Claude Code 自己管理，PaperReadingDesk 不会读取或保存凭据。

Anthropic 官方说明：[安装与快速开始](https://code.claude.com/docs/en/quickstart)、[认证与登录](https://code.claude.com/docs/en/authentication)、[CLI 参数](https://code.claude.com/docs/en/cli-usage)。

启动 PaperReadingDesk 后打开首页，点击“配置 Codex / Claude Code”，切换到需要的 CLI，依次执行“保存配置”和“测试配置”。测试成功的 CLI 会自动成为当前 AI，因此 Claude Code 测试成功后，接下来的论文翻译、摘要、问答和笔记都会使用 Claude；也可以在两个已验证配置之间手动切换。Claude Code 默认模型可填写 `sonnet`，也支持 `opus` 或完整模型名。即使本机尚未安装 Claude，也能先保存配置；测试时会明确提示安装或登录失败。只有当前 AI 测试成功后才能导入论文并执行 AI 功能。配置只保存在本项目的 `data/settings.sqlite3`。

## 启动

Ubuntu、Debian 或 macOS：

```bash
cd "<项目目录>"
source .venv/bin/activate
python3 server.py
```

Windows PowerShell：

```powershell
Set-Location "<项目目录>"
.\.venv\Scripts\python.exe server.py
```

启动后打开 <http://127.0.0.1:8011/>。

## 使用示例

### 1. 配置本机 AI

打开首页，选择 Codex 或 Claude Code，保存并测试命令和模型。测试成功后会自动切换为当前 AI；Codex 还需要填写 reasoning effort。只有当前 AI 测试成功后，翻译、问答和 AI 论文笔记功能才会启用。

<!-- 截图待补：主页 AI CLI 配置 -->

### 2. 导入论文

进入论文库，拖入一个或多个 PDF，为本批论文统一选择目标语言，以及自动分析、单栏或双栏版式。批量导入时只需要选择一次。

<!-- 截图待补：拖拽 PDF 与导入选项 -->

### 3. 双语阅读

等待翻译完成后，打开论文即可查看目录、图片、公式和双语正文，并在中英对照、只看原文和只看译文之间切换。

<!-- 截图待补：双语阅读页面 -->

### 4. 生成 AI 论文笔记与保存摘录

在 AI 阅读笔记中选择“三遍阅读法”或“笔记指南法”。阅读正文时也可以选择文字进行提问，或将原文、译文和问答结果保存到摘录。

<!-- 截图待补：AI 论文笔记与摘录 -->

## PDF 导入与性能

每次拖入一个或多个 PDF 时，只需为整批文件选择一次翻译语言和版式：自动分析、单栏或双栏。自动模式使用本地文字坐标逐页判断，不调用 AI；普通 PDF 只运行一次 Poppler 文本提取。

OCR 只在整份文件缺少有效文字层时回退启用，因此不会拖慢正常论文。系统未安装 Tesseract 时会返回明确提示，不会静默改走更慢的 AI OCR。翻译继续按批并行执行，并使用本地精确匹配翻译记忆减少重复调用。

每篇论文会累计记录翻译任务的实际运行时间和当前 AI CLI 返回的 token 用量。阅读页与论文列表显示运行时间和总 token；悬停可查看输入、缓存输入、输出与推理输出明细。重试会继续累计，暂停等待时间不计入运行时间；缓存输入属于输入、推理输出属于输出，因此总 token 只按输入加输出计算。

图片裁剪不增加默认分析步骤。阅读页中每张论文图片下方提供四向或整体扩展按钮，只有用户手动修正时才重新渲染对应页面。

## 数据位置

所有新数据仅写入本目录的 `data/`：

- `data/papers.sqlite3`：PDF、解析结果、图表、公式、译文、问答与论文笔记
- `data/settings.sqlite3`：本项目的 Codex、Claude Code 和当前 AI 选择

项目不会读取拆分前的旧数据目录或其他项目的数据，也不执行旧数据迁移。若设置 `SELF_PAGE_DATA_DIR`，请为本项目指定独立目录。

## 图片完整性约束

图表截图必须包含完整主体、全部子图、标签、图例和完整图注。无法可靠确认紧边界时，允许多包含正文和留白，不允许为了紧凑而截断图表内容。

## 检查

```bash
python3 -m py_compile server.py backend/*.py
python3 -m unittest discover -s tests -v
```
