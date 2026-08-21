"use strict";

const HOME_LANGUAGE_KEY = "selfPage.language.v1";
const homeTranslations = {
  zh: {
    skip: "跳到正文", navHome: "首页", navPapers: "论文阅读", heroLabel: "PAPERREADINGDESK", heroTitle: "本地论文翻译与阅读", heroLead: "导入 PDF，使用你自己的本机 Codex 完成翻译、摘要、问答和论文笔记。", enterLibrary: "进入论文库", featureShowcase: "功能展示 · 必读",
    codexEyebrow: "本机 AI 配置", codexOpen: "配置本机 Codex", localLabel: "LOCAL FIRST", localTitle: "论文只保存在本机", localDesc: "PaperReadingDesk 将论文、译文、笔记和设置保存在项目目录下的 data/ 文件夹中。",
    dialogTitle: "本机 Codex 配置", close: "关闭", refresh: "重新读取", authMethod: "认证方式", version: "CLI 版本", savedCommand: "已保存命令", model: "模型", reasoning: "推理强度", testReply: "测试返回",
    formTitle: "配置自己的本机 Codex", formLead: "先在终端安装 Codex 并登录，再保存并测试下面的配置。", querySummary: "新用户：这些值在哪里看？", query1: "执行 codex login status 确认登录。", query2: "执行 codex，输入 /model 查看模型和推理强度。", query3: "输入 /status 确认当前选择。", commandLabel: "Codex 命令", modelPlaceholder: "先运行 /model 查询", configuredHint: "保存后必须测试成功，论文翻译、摘要、问答和笔记功能才会启用。", save: "保存配置", test: "测试配置",
    statusChecking: "正在读取…", statusReady: "配置成功", statusMissing: "未配置", authChatgpt: "ChatGPT 账号", authApiKey: "API Key", authToken: "Codex Access Token", authAuthenticated: "已认证", authNone: "尚未验证", saving: "保存中…", testing: "测试中…", savedNotice: "配置已保存，请继续测试", testedNotice: "本机 Codex 配置测试成功"
  },
  ja: {
    skip: "本文へ移動", navHome: "ホーム", navPapers: "論文を読む", heroLabel: "PAPERREADINGDESK", heroTitle: "ローカル論文翻訳・リーダー", heroLead: "PDFを読み込み、自分のローカルCodexで翻訳、要約、質問応答、論文ノートを作成します。", enterLibrary: "論文ライブラリへ", featureShowcase: "機能紹介 · 必読",
    codexEyebrow: "ローカルAI設定", codexOpen: "ローカルCodexを設定", localLabel: "LOCAL FIRST", localTitle: "論文はこのPC内だけに保存", localDesc: "PaperReadingDeskは論文、翻訳、ノート、設定をプロジェクト内のdata/フォルダーに保存します。",
    dialogTitle: "ローカルCodex設定", close: "閉じる", refresh: "再読み込み", authMethod: "認証方法", version: "CLIバージョン", savedCommand: "保存済みコマンド", model: "モデル", reasoning: "推論強度", testReply: "テスト結果",
    formTitle: "自分のローカルCodexを設定", formLead: "ターミナルでCodexをインストールしてログインし、以下の設定を保存してテストしてください。", querySummary: "初めての方：設定値の確認方法", query1: "codex login status でログインを確認します。", query2: "codex を起動し、/model でモデルと推論強度を確認します。", query3: "/status で現在の選択を確認します。", commandLabel: "Codexコマンド", modelPlaceholder: "先に /model で確認", configuredHint: "保存後にテストが成功すると、翻訳、要約、質問応答、論文ノートが利用できます。", save: "設定を保存", test: "設定をテスト",
    statusChecking: "読み込み中…", statusReady: "設定済み", statusMissing: "未設定", authChatgpt: "ChatGPTアカウント", authApiKey: "API Key", authToken: "Codex Access Token", authAuthenticated: "認証済み", authNone: "未確認", saving: "保存中…", testing: "テスト中…", savedNotice: "設定を保存しました。続けてテストしてください", testedNotice: "ローカルCodexのテストに成功しました"
  },
  en: {
    skip: "Skip to content", navHome: "Home", navPapers: "Paper reading", heroLabel: "PAPERREADINGDESK", heroTitle: "Local paper translation and reading", heroLead: "Import PDFs and use your own local Codex for translation, summaries, questions, and paper notes.", enterLibrary: "Open paper library", featureShowcase: "Feature tour · Start here",
    codexEyebrow: "LOCAL AI SETUP", codexOpen: "Configure local Codex", localLabel: "LOCAL FIRST", localTitle: "Papers stay on this computer", localDesc: "PaperReadingDesk stores papers, translations, notes, and settings in the project's data/ directory.",
    dialogTitle: "Local Codex configuration", close: "Close", refresh: "Refresh", authMethod: "Authentication", version: "CLI version", savedCommand: "Saved command", model: "Model", reasoning: "Reasoning effort", testReply: "Test response",
    formTitle: "Configure your local Codex", formLead: "Install Codex and sign in from a terminal, then save and test the settings below.", querySummary: "New user: where do I find these values?", query1: "Run codex login status to confirm sign-in.", query2: "Run codex and enter /model to see models and reasoning effort.", query3: "Enter /status to confirm the current selection.", commandLabel: "Codex command", modelPlaceholder: "Run /model first", configuredHint: "Translation, summaries, questions, and paper notes are enabled after a successful test.", save: "Save configuration", test: "Test configuration",
    statusChecking: "Loading…", statusReady: "Configured", statusMissing: "Not configured", authChatgpt: "ChatGPT account", authApiKey: "API Key", authToken: "Codex Access Token", authAuthenticated: "Authenticated", authNone: "Not verified", saving: "Saving…", testing: "Testing…", savedNotice: "Configuration saved; continue with the test", testedNotice: "Local Codex configuration test passed"
  },
  ko: {
    skip: "본문으로 이동", navHome: "홈", navPapers: "논문 읽기", heroLabel: "PAPERREADINGDESK", heroTitle: "로컬 논문 번역 및 읽기", heroLead: "PDF를 가져와 자신의 로컬 Codex로 번역, 요약, 질의응답 및 논문 노트를 만듭니다.", enterLibrary: "논문 라이브러리 열기", featureShowcase: "기능 둘러보기 · 필독",
    codexEyebrow: "로컬 AI 설정", codexOpen: "로컬 Codex 설정", localLabel: "LOCAL FIRST", localTitle: "논문은 이 컴퓨터에만 저장", localDesc: "PaperReadingDesk는 논문, 번역, 노트 및 설정을 프로젝트의 data/ 폴더에 저장합니다.",
    dialogTitle: "로컬 Codex 설정", close: "닫기", refresh: "새로고침", authMethod: "인증 방식", version: "CLI 버전", savedCommand: "저장된 명령", model: "모델", reasoning: "추론 강도", testReply: "테스트 응답",
    formTitle: "자신의 로컬 Codex 설정", formLead: "터미널에서 Codex를 설치하고 로그인한 다음 아래 설정을 저장하고 테스트하세요.", querySummary: "처음 사용하시나요? 설정값 확인 방법", query1: "codex login status를 실행해 로그인을 확인합니다.", query2: "codex를 실행하고 /model을 입력해 모델과 추론 강도를 확인합니다.", query3: "/status를 입력해 현재 선택을 확인합니다.", commandLabel: "Codex 명령", modelPlaceholder: "먼저 /model 실행", configuredHint: "테스트에 성공하면 번역, 요약, 질의응답 및 논문 노트 기능이 활성화됩니다.", save: "설정 저장", test: "설정 테스트",
    statusChecking: "불러오는 중…", statusReady: "설정 완료", statusMissing: "설정 안 됨", authChatgpt: "ChatGPT 계정", authApiKey: "API Key", authToken: "Codex Access Token", authAuthenticated: "인증됨", authNone: "확인 안 됨", saving: "저장 중…", testing: "테스트 중…", savedNotice: "설정을 저장했습니다. 계속해서 테스트하세요", testedNotice: "로컬 Codex 설정 테스트에 성공했습니다"
  }
};

function initialLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (homeTranslations[requested]) return requested;
  const saved = localStorage.getItem(HOME_LANGUAGE_KEY);
  return homeTranslations[saved] ? saved : "zh";
}

let homeLanguage = initialLanguage();
const th = key => homeTranslations[homeLanguage]?.[key] || homeTranslations.zh[key] || key;
const byId = id => document.getElementById(id);
const ui = {
  open: byId("codexConfigButton"), dialog: byId("codexConfigDialog"), close: byId("codexConfigClose"),
  refresh: byId("codexRefreshStatus"), homeStatus: byId("codexHomeStatus"), indicator: byId("codexDialogIndicator"),
  dialogStatus: byId("codexDialogStatus"), auth: byId("codexAuthMethod"), version: byId("codexVersion"),
  savedCommand: byId("codexSavedCommand"), model: byId("codexModel"), reasoning: byId("codexReasoning"),
  reply: byId("codexTestReply"), error: byId("codexTestError"), form: byId("codexConfigForm"),
  commandInput: byId("codexCommandInput"), modelInput: byId("codexModelInput"), reasoningInput: byId("codexReasoningInput"),
  save: byId("codexSaveCommand"), test: byId("codexTestCommand"), toast: byId("toast"),
  languageButtons: document.querySelectorAll("[data-lang]"),
};
let codexStatus = null;
let toastTimer;

function notify(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.remove("visible"), 2600);
}

function render() {
  const css = !codexStatus ? "is-checking" : codexStatus.configured ? "is-ready" : "is-missing";
  const label = !codexStatus ? th("statusChecking") : codexStatus.configured ? th("statusReady") : th("statusMissing");
  [ui.homeStatus, ui.indicator].forEach(node => {
    node.classList.remove("is-checking", "is-ready", "is-missing"); node.classList.add(css);
  });
  ui.homeStatus.querySelector("span").textContent = label;
  ui.dialogStatus.textContent = label;
  const authLabels = {chatgpt: th("authChatgpt"), api_key: th("authApiKey"), access_token: th("authToken"), authenticated: th("authAuthenticated"), none: th("authNone")};
  ui.auth.textContent = codexStatus ? (authLabels[codexStatus.authMethod] || codexStatus.authMethod || "—") : "—";
  ui.version.textContent = codexStatus?.version || "—"; ui.savedCommand.textContent = codexStatus?.command || "—";
  ui.model.textContent = codexStatus?.model || "—"; ui.reasoning.textContent = codexStatus?.reasoningEffort || "—";
  ui.reply.textContent = codexStatus?.testReply || "—"; ui.error.textContent = codexStatus?.error || ""; ui.error.hidden = !codexStatus?.error;
  if (codexStatus?.command && document.activeElement !== ui.commandInput) ui.commandInput.value = codexStatus.command;
  if (codexStatus?.model && document.activeElement !== ui.modelInput) ui.modelInput.value = codexStatus.model;
  if (codexStatus?.reasoningEffort) ui.reasoningInput.value = codexStatus.reasoningEffort;
}

function setHomeLanguage(language) {
  homeLanguage = homeTranslations[language] ? language : "zh";
  localStorage.setItem(HOME_LANGUAGE_KEY, homeLanguage);
  document.documentElement.lang = {zh: "zh-CN", ja: "ja", en: "en", ko: "ko"}[homeLanguage];
  document.querySelectorAll("[data-home-i18n]").forEach(element => { element.textContent = th(element.dataset.homeI18n); });
  document.querySelectorAll("[data-home-i18n-placeholder]").forEach(element => { element.placeholder = th(element.dataset.homeI18nPlaceholder); });
  document.querySelectorAll("[data-home-i18n-aria-label]").forEach(element => { element.setAttribute("aria-label", th(element.dataset.homeI18nAriaLabel)); });
  ui.languageButtons.forEach(button => {
    const active = button.dataset.lang === homeLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  render();
}

async function refresh() {
  codexStatus = null; render(); ui.refresh.disabled = true;
  try { codexStatus = await SelfPageAPI.request("/api/codex/status"); }
  catch (error) { codexStatus = {configured: false, error: error.message}; }
  finally { ui.refresh.disabled = false; render(); }
}

function values() {
  return {command: ui.commandInput.value.trim(), model: ui.modelInput.value.trim(), reasoningEffort: ui.reasoningInput.value};
}

async function save(event) {
  event.preventDefault(); ui.save.disabled = true; ui.save.textContent = th("saving");
  try { codexStatus = await SelfPageAPI.request("/api/codex/config", {method: "POST", body: values()}); render(); notify(th("savedNotice")); }
  catch (error) { codexStatus = {...codexStatus, configured: false, error: error.message}; render(); notify(error.message); }
  finally { ui.save.disabled = false; ui.save.textContent = th("save"); }
}

async function test() {
  const draft = values(); if (!draft.command || !draft.model || !draft.reasoningEffort) return;
  ui.test.disabled = true; ui.test.textContent = th("testing");
  try {
    if (!codexStatus?.saved || codexStatus.command !== draft.command || codexStatus.model !== draft.model || codexStatus.reasoningEffort !== draft.reasoningEffort) codexStatus = await SelfPageAPI.request("/api/codex/config", {method: "POST", body: draft});
    codexStatus = await SelfPageAPI.request("/api/codex/test", {method: "POST", body: {}}); render(); notify(th("testedNotice"));
  } catch (error) { codexStatus = error.payload || {...codexStatus, configured: false, error: error.message}; render(); notify(error.message); }
  finally { ui.test.disabled = false; ui.test.textContent = th("test"); }
}

ui.open.addEventListener("click", () => ui.dialog.showModal()); ui.close.addEventListener("click", () => ui.dialog.close());
ui.dialog.addEventListener("click", event => { if (event.target === ui.dialog) ui.dialog.close(); });
ui.refresh.addEventListener("click", refresh); ui.form.addEventListener("submit", save); ui.test.addEventListener("click", test);
ui.languageButtons.forEach(button => button.addEventListener("click", () => setHomeLanguage(button.dataset.lang)));
setHomeLanguage(homeLanguage);
void refresh();
