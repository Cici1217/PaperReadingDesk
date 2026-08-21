"use strict";

/* The only browser module allowed to talk to the application API. */
(function () {
  function configuredApiBase() {
    const meta = document.querySelector('meta[name="selfpage-api-base"]');
    return String(window.SELF_PAGE_API_BASE || meta?.content || "").trim().replace(/\/+$/, "");
  }

  function apiUrl(path) {
    const base = configuredApiBase();
    return base ? new URL(path, base + "/").toString() : path;
  }

  function requestCredentials() {
    return configuredApiBase() ? "include" : "same-origin";
  }

  function csrfHeaders() {
    // Kept as a compatibility helper for PDF uploads implemented outside
    // request(). The local single-workspace server requires no auth token.
    return {};
  }

  async function request(path, options = {}) {
    const method = options.method || "GET";
    const headers = new Headers(options.headers || {});
    let body = options.body;
    if (body !== undefined && !(body instanceof FormData) && !(body instanceof Blob)) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    }
    const response = await fetch(apiUrl(path), {
      method,
      headers,
      body,
      credentials: requestCredentials(),
      cache: "no-store",
    });
    let payload = null;
    try { payload = await response.json(); } catch (_) { payload = null; }
    if (!response.ok) {
      const error = new Error(payload?.error || ("Request failed: " + response.status));
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  window.SelfPageAPI = {
    request,
    url: apiUrl,
    csrfHeaders,
  };
}());
