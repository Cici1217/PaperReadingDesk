"use strict";

const HOME_LANGUAGE_KEY = "selfPage.language.v1";
const homeTranslations = {
  zh: {
    skip: "跳到正文", navHome: "首页", navPapers: "论文阅读", heroLabel: "PAPERREADINGDESK", heroTitle: "本地论文翻译与阅读", heroLead: "导入 PDF，使用你自己的本机 Codex 或 Claude Code 完成翻译、摘要、问答和论文笔记。", enterLibrary: "进入论文库", featureShowcase: "功能展示 · 必读",
    codexEyebrow: "本机 AI 配置", codexOpen: "配置 Codex / Claude Code", localLabel: "LOCAL FIRST", localTitle: "论文只保存在本机", localDesc: "PaperReadingDesk 将论文、译文、笔记和设置保存在项目目录下的 data/ 文件夹中。",
    dialogTitle: "Codex / Claude Code 配置", close: "关闭", refresh: "重新读取", activeProvider: "当前使用", authMethod: "认证方式", version: "CLI 版本", savedCommand: "已保存命令", model: "模型", reasoning: "推理强度", testReply: "测试返回",
    codexFormTitle: "配置自己的本机 Codex", codexFormLead: "先在终端安装 Codex 并登录，再保存并测试下面的配置。", claudeFormTitle: "配置自己的 Claude Code", claudeFormLead: "即使本机尚未安装也可以先保存；测试时会返回明确的安装或登录错误。", querySummary: "Codex 登录与查询", query1: "执行 codex login status 确认登录。", query2: "执行 codex，输入 /model 查看模型和推理强度。", query3: "输入 /status 确认当前选择。", claudeGuideTitle: "Claude Code 安装与登录", claudeQuery1: "首次运行会打开浏览器，按提示登录 Claude 账号。", claudeQuery2: "如果未出现登录流程，请在 Claude Code 中输入 /login。", claudeQuery3: "输入 /status 确认账号和模型。浏览器未打开时按 c 复制登录链接。", claudeSecretNote: "项目只保存命令、模型和测试状态，不保存账号、密码或令牌。", codexCommandLabel: "Codex 命令", claudeCommandLabel: "Claude Code 命令", codexModelPlaceholder: "先运行 /model 查询", claudeModelPlaceholder: "sonnet、opus 或完整模型名", configuredHint: "保存并测试成功后，可将该 CLI 设为当前论文 AI 后端。", save: "保存配置", test: "测试配置", useProvider: "设为当前 AI",
    statusChecking: "正在读取…", statusReady: "配置成功", statusMissing: "未配置", authChatgpt: "ChatGPT 账号", authApiKey: "API Key", authToken: "Access Token", authClaude: "Claude 账号", authAuthenticated: "已认证", authNone: "尚未验证", saving: "保存中…", testing: "测试中…", savedNotice: "配置已保存，请继续测试", testedNotice: "配置测试成功", activatedNotice: "已切换当前 AI 后端"
  },
  ja: {
    skip: "本文へ移動", navHome: "ホーム", navPapers: "論文を読む", heroLabel: "PAPERREADINGDESK", heroTitle: "ローカル論文翻訳・リーダー", heroLead: "PDFを読み込み、ローカルのCodexまたはClaude Codeで翻訳、要約、質問応答、論文ノートを作成します。", enterLibrary: "論文ライブラリへ", featureShowcase: "機能紹介 · 必読",
    codexEyebrow: "ローカルAI設定", codexOpen: "Codex / Claude Codeを設定", localLabel: "LOCAL FIRST", localTitle: "論文はこのPC内だけに保存", localDesc: "PaperReadingDeskは論文、翻訳、ノート、設定をプロジェクト内のdata/フォルダーに保存します。", dialogTitle: "Codex / Claude Code設定", close: "閉じる", refresh: "再読み込み", activeProvider: "使用中", authMethod: "認証方法", version: "CLIバージョン", savedCommand: "保存済みコマンド", model: "モデル", reasoning: "推論強度", testReply: "テスト結果",
    codexFormTitle: "ローカルCodexを設定", codexFormLead: "Codexをインストールしてログインし、設定を保存してテストします。", claudeFormTitle: "Claude Codeを設定", claudeFormLead: "未インストールでも保存できます。テスト時にインストールまたはログインのエラーを明示します。", querySummary: "Codexのログインと確認", query1: "codex login statusでログインを確認します。", query2: "codexを起動し、/modelでモデルと推論強度を確認します。", query3: "/statusで現在の選択を確認します。", claudeGuideTitle: "Claude Codeのインストールとログイン", claudeQuery1: "初回起動時にブラウザーが開き、Claudeアカウントでログインします。", claudeQuery2: "ログイン画面が出ない場合はClaude Codeで/loginを入力します。", claudeQuery3: "/statusで確認します。ブラウザーが開かない場合はcでURLをコピーします。", claudeSecretNote: "コマンド、モデル、テスト状態だけを保存し、認証情報は保存しません。", codexCommandLabel: "Codexコマンド", claudeCommandLabel: "Claude Codeコマンド", codexModelPlaceholder: "/modelで確認", claudeModelPlaceholder: "sonnet、opus、または完全なモデル名", configuredHint: "テスト成功後、このCLIを現在のAIとして選択できます。", save: "設定を保存", test: "設定をテスト", useProvider: "現在のAIに設定", statusChecking: "読み込み中…", statusReady: "設定済み", statusMissing: "未設定", authChatgpt: "ChatGPTアカウント", authApiKey: "API Key", authToken: "Access Token", authClaude: "Claudeアカウント", authAuthenticated: "認証済み", authNone: "未確認", saving: "保存中…", testing: "テスト中…", savedNotice: "保存しました。続けてテストしてください", testedNotice: "設定テストに成功しました", activatedNotice: "現在のAIを切り替えました"
  },
  en: {
    skip: "Skip to content", navHome: "Home", navPapers: "Paper reading", heroLabel: "PAPERREADINGDESK", heroTitle: "Local paper translation and reading", heroLead: "Import PDFs and use your local Codex or Claude Code for translation, summaries, questions, and paper notes.", enterLibrary: "Open paper library", featureShowcase: "Feature tour · Start here",
    codexEyebrow: "LOCAL AI SETUP", codexOpen: "Configure Codex / Claude Code", localLabel: "LOCAL FIRST", localTitle: "Papers stay on this computer", localDesc: "PaperReadingDesk stores papers, translations, notes, and settings in the project's data/ directory.", dialogTitle: "Codex / Claude Code configuration", close: "Close", refresh: "Refresh", activeProvider: "Active", authMethod: "Authentication", version: "CLI version", savedCommand: "Saved command", model: "Model", reasoning: "Reasoning effort", testReply: "Test response",
    codexFormTitle: "Configure local Codex", codexFormLead: "Install and sign in to Codex, then save and test these settings.", claudeFormTitle: "Configure Claude Code", claudeFormLead: "You can save settings before installation; the test reports clear installation or sign-in errors.", querySummary: "Codex sign-in and values", query1: "Run codex login status to confirm sign-in.", query2: "Run codex and enter /model to see model and reasoning effort.", query3: "Enter /status to confirm the selection.", claudeGuideTitle: "Install and sign in to Claude Code", claudeQuery1: "The first launch opens a browser; follow it to sign in to your Claude account.", claudeQuery2: "If sign-in does not start, enter /login inside Claude Code.", claudeQuery3: "Enter /status to confirm. Press c to copy the login URL if the browser does not open.", claudeSecretNote: "Only the command, model, and test status are stored—never account credentials or tokens.", codexCommandLabel: "Codex command", claudeCommandLabel: "Claude Code command", codexModelPlaceholder: "Check with /model", claudeModelPlaceholder: "sonnet, opus, or a full model name", configuredHint: "After a successful test, set this CLI as the active paper AI backend.", save: "Save configuration", test: "Test configuration", useProvider: "Set as active AI", statusChecking: "Loading…", statusReady: "Configured", statusMissing: "Not configured", authChatgpt: "ChatGPT account", authApiKey: "API Key", authToken: "Access Token", authClaude: "Claude account", authAuthenticated: "Authenticated", authNone: "Not verified", saving: "Saving…", testing: "Testing…", savedNotice: "Saved; continue with the test", testedNotice: "Configuration test passed", activatedNotice: "Active AI backend changed"
  },
  ko: {
    skip: "본문으로 이동", navHome: "홈", navPapers: "논문 읽기", heroLabel: "PAPERREADINGDESK", heroTitle: "로컬 논문 번역 및 읽기", heroLead: "PDF를 가져와 로컬 Codex 또는 Claude Code로 번역, 요약, 질의응답 및 논문 노트를 만듭니다.", enterLibrary: "논문 라이브러리 열기", featureShowcase: "기능 둘러보기 · 필독", codexEyebrow: "로컬 AI 설정", codexOpen: "Codex / Claude Code 설정", localLabel: "LOCAL FIRST", localTitle: "논문은 이 컴퓨터에만 저장", localDesc: "PaperReadingDesk는 논문, 번역, 노트 및 설정을 프로젝트의 data/ 폴더에 저장합니다.", dialogTitle: "Codex / Claude Code 설정", close: "닫기", refresh: "새로고침", activeProvider: "현재 사용", authMethod: "인증 방식", version: "CLI 버전", savedCommand: "저장된 명령", model: "모델", reasoning: "추론 강도", testReply: "테스트 응답",
    codexFormTitle: "로컬 Codex 설정", codexFormLead: "Codex를 설치하고 로그인한 다음 설정을 저장하고 테스트하세요.", claudeFormTitle: "Claude Code 설정", claudeFormLead: "설치 전에도 저장할 수 있으며 테스트에서 설치 또는 로그인 오류를 명확히 표시합니다.", querySummary: "Codex 로그인 및 확인", query1: "codex login status로 로그인을 확인합니다.", query2: "codex에서 /model로 모델과 추론 강도를 확인합니다.", query3: "/status로 현재 선택을 확인합니다.", claudeGuideTitle: "Claude Code 설치 및 로그인", claudeQuery1: "처음 실행하면 브라우저가 열리고 Claude 계정 로그인을 안내합니다.", claudeQuery2: "로그인이 시작되지 않으면 Claude Code에서 /login을 입력합니다.", claudeQuery3: "/status로 확인합니다. 브라우저가 열리지 않으면 c를 눌러 URL을 복사합니다.", claudeSecretNote: "명령, 모델, 테스트 상태만 저장하며 인증 정보나 토큰은 저장하지 않습니다.", codexCommandLabel: "Codex 명령", claudeCommandLabel: "Claude Code 명령", codexModelPlaceholder: "/model로 확인", claudeModelPlaceholder: "sonnet, opus 또는 전체 모델명", configuredHint: "테스트 성공 후 이 CLI를 현재 AI로 설정할 수 있습니다.", save: "설정 저장", test: "설정 테스트", useProvider: "현재 AI로 설정", statusChecking: "불러오는 중…", statusReady: "설정 완료", statusMissing: "설정 안 됨", authChatgpt: "ChatGPT 계정", authApiKey: "API Key", authToken: "Access Token", authClaude: "Claude 계정", authAuthenticated: "인증됨", authNone: "확인 안 됨", saving: "저장 중…", testing: "테스트 중…", savedNotice: "저장했습니다. 계속 테스트하세요", testedNotice: "설정 테스트 성공", activatedNotice: "현재 AI를 변경했습니다"
  }
};

function initialLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (homeTranslations[requested]) return requested;
  const saved = localStorage.getItem(HOME_LANGUAGE_KEY);
  return homeTranslations[saved] ? saved : "zh";
}

let homeLanguage = initialLanguage();
let selectedProvider = "codex";
let aiStatus = null;
let toastTimer;
const th = key => homeTranslations[homeLanguage]?.[key] || homeTranslations.zh[key] || key;
const byId = id => document.getElementById(id);
const ui = {
  open: byId("codexConfigButton"), dialog: byId("codexConfigDialog"), close: byId("codexConfigClose"), refresh: byId("codexRefreshStatus"),
  homeStatus: byId("codexHomeStatus"), indicator: byId("codexDialogIndicator"), dialogStatus: byId("codexDialogStatus"), auth: byId("codexAuthMethod"), version: byId("codexVersion"), savedCommand: byId("codexSavedCommand"), model: byId("codexModel"), reasoning: byId("codexReasoning"), reasoningStatusRow: byId("reasoningStatusRow"), reply: byId("codexTestReply"), error: byId("codexTestError"),
  form: byId("codexConfigForm"), formTitle: byId("providerFormTitle"), formLead: byId("providerFormLead"), codexGuide: byId("codexLoginGuide"), claudeGuide: byId("claudeLoginGuide"), commandLabel: byId("commandLabel"), commandInput: byId("codexCommandInput"), modelInput: byId("codexModelInput"), reasoningInput: byId("codexReasoningInput"), reasoningInputRow: byId("reasoningInputRow"), save: byId("codexSaveCommand"), test: byId("codexTestCommand"), use: byId("useProviderCommand"), activeName: byId("activeProviderName"), toast: byId("toast"), providerTabs: document.querySelectorAll("[data-provider]"), languageButtons: document.querySelectorAll("[data-lang]")
};

function notify(message) { ui.toast.textContent = message; ui.toast.classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => ui.toast.classList.remove("visible"), 2600); }
function providerName(provider) { return provider === "claude" ? "Claude Code" : "Codex"; }
function currentStatus() { return aiStatus?.[selectedProvider] || null; }

function render() {
  const status = currentStatus();
  const overallReady = Boolean(aiStatus?.configured);
  const css = !aiStatus ? "is-checking" : overallReady ? "is-ready" : "is-missing";
  const dialogCss = !status ? "is-checking" : status.configured ? "is-ready" : "is-missing";
  ui.homeStatus.className = `codex-home-status ${css}`;
  ui.indicator.className = `codex-dialog-indicator ${dialogCss}`;
  ui.homeStatus.querySelector("span").textContent = !aiStatus ? th("statusChecking") : overallReady ? `${providerName(aiStatus.activeProvider)} · ${th("statusReady")}` : th("statusMissing");
  ui.dialogStatus.textContent = !status ? th("statusChecking") : status.configured ? th("statusReady") : th("statusMissing");
  ui.activeName.textContent = providerName(aiStatus?.activeProvider || "codex");
  const authLabels = {chatgpt: th("authChatgpt"), api_key: th("authApiKey"), access_token: th("authToken"), claude_account: th("authClaude"), authenticated: th("authAuthenticated"), none: th("authNone")};
  ui.auth.textContent = status ? (authLabels[status.authMethod] || status.authMethod || "—") : "—";
  ui.version.textContent = status?.version || "—"; ui.savedCommand.textContent = status?.command || "—"; ui.model.textContent = status?.model || "—"; ui.reasoning.textContent = status?.reasoningEffort || "—"; ui.reply.textContent = status?.testReply || "—";
  ui.error.textContent = status?.error || ""; ui.error.hidden = !status?.error;
  ui.reasoningStatusRow.hidden = selectedProvider === "claude"; ui.reasoningInputRow.hidden = selectedProvider === "claude"; ui.reasoningInput.required = selectedProvider === "codex";
  ui.codexGuide.hidden = selectedProvider !== "codex"; ui.claudeGuide.hidden = selectedProvider !== "claude";
  ui.formTitle.textContent = th(`${selectedProvider}FormTitle`); ui.formLead.textContent = th(`${selectedProvider}FormLead`); ui.commandLabel.textContent = th(`${selectedProvider}CommandLabel`); ui.modelInput.placeholder = th(`${selectedProvider}ModelPlaceholder`);
  ui.use.disabled = !status?.configured || aiStatus?.activeProvider === selectedProvider;
  ui.providerTabs.forEach(button => button.setAttribute("aria-selected", String(button.dataset.provider === selectedProvider)));
}

function loadInputs() {
  const status = currentStatus();
  ui.commandInput.value = status?.command || (selectedProvider === "claude" ? "claude" : "codex");
  ui.modelInput.value = status?.model || (selectedProvider === "claude" ? "sonnet" : "");
  ui.reasoningInput.value = status?.reasoningEffort || "medium";
}

function setHomeLanguage(language) {
  homeLanguage = homeTranslations[language] ? language : "zh"; localStorage.setItem(HOME_LANGUAGE_KEY, homeLanguage);
  document.documentElement.lang = {zh: "zh-CN", ja: "ja", en: "en", ko: "ko"}[homeLanguage];
  document.querySelectorAll("[data-home-i18n]").forEach(element => { element.textContent = th(element.dataset.homeI18n); });
  document.querySelectorAll("[data-home-i18n-aria-label]").forEach(element => element.setAttribute("aria-label", th(element.dataset.homeI18nAriaLabel)));
  ui.languageButtons.forEach(button => { const active = button.dataset.lang === homeLanguage; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  render();
}

async function refresh() {
  aiStatus = null; render(); ui.refresh.disabled = true;
  try { aiStatus = await SelfPageAPI.request("/api/ai/status"); }
  catch (error) { aiStatus = {activeProvider: "codex", configured: false, codex: {configured: false, error: error.message}, claude: {configured: false}}; }
  finally { ui.refresh.disabled = false; loadInputs(); render(); }
}

function values() { const value = {command: ui.commandInput.value.trim(), model: ui.modelInput.value.trim()}; if (selectedProvider === "codex") value.reasoningEffort = ui.reasoningInput.value.trim(); return value; }

async function save(event) {
  event.preventDefault(); ui.save.disabled = true; ui.save.textContent = th("saving");
  try { aiStatus[selectedProvider] = await SelfPageAPI.request(`/api/${selectedProvider}/config`, {method: "POST", body: values()}); render(); notify(th("savedNotice")); }
  catch (error) { aiStatus[selectedProvider] = {...currentStatus(), configured: false, error: error.message}; render(); notify(error.message); }
  finally { ui.save.disabled = false; ui.save.textContent = th("save"); }
}

async function test() {
  const draft = values(); if (!draft.command || !draft.model || (selectedProvider === "codex" && !draft.reasoningEffort)) return;
  ui.test.disabled = true; ui.test.textContent = th("testing");
  try {
    const status = currentStatus();
    if (!status?.saved || status.command !== draft.command || status.model !== draft.model || (selectedProvider === "codex" && status.reasoningEffort !== draft.reasoningEffort)) aiStatus[selectedProvider] = await SelfPageAPI.request(`/api/${selectedProvider}/config`, {method: "POST", body: draft});
    aiStatus[selectedProvider] = await SelfPageAPI.request(`/api/${selectedProvider}/test`, {method: "POST", body: {}}); render(); notify(th("testedNotice"));
  } catch (error) { aiStatus[selectedProvider] = error.payload || {...currentStatus(), configured: false, error: error.message}; render(); notify(error.message); }
  finally { ui.test.disabled = false; ui.test.textContent = th("test"); }
}

async function activate() {
  ui.use.disabled = true;
  try { aiStatus = await SelfPageAPI.request("/api/ai/provider", {method: "POST", body: {provider: selectedProvider}}); render(); notify(th("activatedNotice")); }
  catch (error) { notify(error.message); render(); }
}

ui.open.addEventListener("click", () => ui.dialog.showModal()); ui.close.addEventListener("click", () => ui.dialog.close()); ui.dialog.addEventListener("click", event => { if (event.target === ui.dialog) ui.dialog.close(); });
ui.refresh.addEventListener("click", refresh); ui.form.addEventListener("submit", save); ui.test.addEventListener("click", test); ui.use.addEventListener("click", activate);
ui.providerTabs.forEach(button => button.addEventListener("click", () => { selectedProvider = button.dataset.provider; loadInputs(); render(); }));
ui.languageButtons.forEach(button => button.addEventListener("click", () => setHomeLanguage(button.dataset.lang)));
setHomeLanguage(homeLanguage); void refresh();
