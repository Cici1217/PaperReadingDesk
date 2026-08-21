const paperStore = window.localStorage;
const PAPER_LANGUAGE_KEY = "selfPage.language.v1";
const PAPER_TARGET_LANGUAGE_KEY = "selfPage.paperTargetLanguage.v1";
const PAPER_LAYOUT_MODE_KEY = "selfPage.paperLayoutMode.v1";

const paperTranslations = {
  zh: {
    skip: "跳到正文", navHome: "首页", navCommands: "常用命令", navProjects: "项目", navStudy: "学习", navPapers: "论文", navNotes: "笔记",
    label: "论文阅读器", title: "论文阅读", lead: "拖入英文 PDF，由本机 Codex 翻译，在同一页进行中英对照阅读。",
    dropTitle: "拖拽 PDF 到这里", dropHint: "或点击选择文件 · 单个文件不超过 60 MB", libraryLabel: "论文库", libraryTitle: "论文库",
    emptyTitle: "选择一篇论文开始阅读", emptyDesc: "上传后会自动提取文本并排队翻译。扫描版 PDF 暂时需要先做 OCR。", original: "原 PDF ↗", retry: "重试翻译",
    chinese: "中文", english: "English", footer: "PDF 与译文只保存在这台电脑。",
    summarize: "生成总体概括", summaryView: "重新生成", summaryRunning: "生成中…", summaryRetry: "重试生成", summaryLabel: "AI READING NOTES", summaryTitle: "AI 阅读笔记", summaryWaiting: "Codex 正在生成新的笔记版本。", summaryFailed: "生成失败", versionHint: "每次生成都会保存为一个新版本，不会覆盖旧笔记。", generateGuideNote: "按笔记指南生成", generateThreePass: "按三遍阅读法生成", noAiNotes: "还没有 AI 阅读笔记，请选择一种方法生成。", versionLabel: "版本 {version}", methodGuide: "笔记指南", methodThreePass: "三遍阅读法", statusQueuedNote: "等待生成", statusGeneratingNote: "生成中", statusErrorNote: "生成失败", summaryOne: "一句话", summaryOverview: "概要", summaryContributions: "主要贡献", summaryMethod: "方法 pipeline", summaryResults: "实验与结果", summaryLimitations: "局限", summaryTerms: "关键概念", summaryQuestions: "带着这些问题读", summaryType: "论文类型", summaryResearch: "研究问题", summaryContext: "研究背景", summaryAssumptions: "假设与可信度", summaryAudit: "实验审查", summaryReproduce: "复现清单",
    allPapers: "全部论文", addFolder: "＋ 文件夹", folderName: "文件夹名称", renameFolder: "重命名", deleteFolder: "删除文件夹", uncategorized: "未分类", outline: "目录", collapseSidebar: "收起目录", showSidebar: "展开目录", collapseLibrary: "收起论文库", showLibrary: "展开论文库", backToLibrary: "返回论文库", readerRoomTitle: "全文阅读", readerRoomLead: "在一个安静的阅读空间里，连续读完这篇论文。", modeBilingual: "中英对照", modeEnglish: "只看英文", modeChinese: "只看中文", moduleReading: "中英对照阅读", moduleAssist: "AI 辅助阅读", moduleNotes: "论文摘录", ctrlTip: "按住 Ctrl，将鼠标放在英文句子上查看中文", questionsTitle: "高亮与提问", notesTitle: "论文摘录", generateNotes: "让 AI 整理摘录", notesHint: "这里用于保存当前论文的摘录。", manualSnippetPlaceholder: "输入与这篇论文有关的摘录…", manualSnippetAdd: "添加摘录", saveSnippet: "保存摘录", saveFinalNote: "保存整理结果", saved: "修改已保存", askAI: "问 AI", addNote: "加入论文摘录", yourQuestion: "你的问题", sendQuestion: "提问并高亮", noOutline: "未识别到编号目录", abstract: "摘要", copyFormula: "复制公式源码", formulaCopied: "公式 Markdown 已复制", noQuestions: "还没有高亮或问题。选择一段文字开始。", noSnippets: "还没有摘录。", notesRunning: "AI 正在整理摘录…", savedToNotes: "已加入论文摘录",
    noPapers: "还没有论文，把 PDF 拖到上方开始。", uploading: "正在上传并提取文本…", uploadDone: "已加入翻译队列", uploadError: "上传失败",
    statusExtracting: "提取文本", statusQueued: "等待翻译", statusTranslating: "翻译中", statusReady: "可阅读", statusError: "出错",
    progress: "已翻译 {done} / {total} 个阅读单元（{percent}%）", pending: "等待翻译…", page: "第 {page} 页", units: "{count} 个阅读单元", deleteConfirm: "确定删除这篇论文、PDF 和全部译文吗？", retrySent: "已重新加入翻译队列", serverError: "无法连接论文后端。请使用 server.py 启动主页。"
  },
  ja: {
    skip: "本文へ移動", navHome: "ホーム", navCommands: "コマンド", navProjects: "プロジェクト", navStudy: "学習", navPapers: "論文", navNotes: "ノート",
    label: "論文リーダー", title: "論文を読む", lead: "英語PDFを追加すると、ローカルのCodexが翻訳し、同じ画面で英中対訳を読めます。",
    dropTitle: "PDFをここにドロップ", dropHint: "クリックして選択 · 1ファイル60 MBまで", libraryLabel: "ライブラリ", libraryTitle: "論文ライブラリ",
    emptyTitle: "論文を選択してください", emptyDesc: "アップロード後、自動でテキストを抽出して翻訳します。スキャンPDFは先にOCRが必要です。", original: "元のPDF ↗", retry: "翻訳を再試行",
    chinese: "中文", english: "English", footer: "PDFと翻訳はこのPC内だけに保存されます。",
    summarize: "全体要約を作成", summaryView: "再生成", summaryRunning: "生成中…", summaryRetry: "再試行", summaryLabel: "AI READING NOTES", summaryTitle: "AI読解ノート", summaryWaiting: "Codexが新しいノート版を生成中です。", summaryFailed: "生成に失敗", versionHint: "生成するたびに旧版を上書きせず、新しい版として保存します。", generateGuideNote: "ノートガイドで生成", generateThreePass: "三段階読解法で生成", noAiNotes: "AI読解ノートはまだありません。", versionLabel: "バージョン {version}", methodGuide: "ノートガイド", methodThreePass: "三段階読解法", statusQueuedNote: "生成待ち", statusGeneratingNote: "生成中", statusErrorNote: "生成失敗", summaryOne: "一文要約", summaryOverview: "概要", summaryContributions: "主な貢献", summaryMethod: "手法", summaryResults: "実験と結果", summaryLimitations: "限界", summaryTerms: "主要概念", summaryQuestions: "読解の問い", summaryType: "論文タイプ", summaryResearch: "研究課題", summaryContext: "背景", summaryAssumptions: "前提と妥当性", summaryAudit: "実験監査", summaryReproduce: "再現チェック",
    allPapers: "すべて", addFolder: "＋ フォルダ", folderName: "フォルダ名", renameFolder: "名前変更", deleteFolder: "削除", uncategorized: "未分類", outline: "目次", collapseSidebar: "目次を閉じる", showSidebar: "目次を開く", collapseLibrary: "ライブラリを閉じる", showLibrary: "ライブラリを開く", backToLibrary: "論文ライブラリへ戻る", readerRoomTitle: "全文読解", readerRoomLead: "落ち着いた読書スペースで、この論文を通して読みます。", modeBilingual: "対訳", modeEnglish: "英語のみ", modeChinese: "中国語のみ", moduleReading: "対訳", moduleAssist: "AI精読", moduleNotes: "論文の抜粋", ctrlTip: "Ctrlを押しながら英文に重ねると中国語訳を表示", questionsTitle: "ハイライトと質問", notesTitle: "論文の抜粋", generateNotes: "AIで抜粋を整理", notesHint: "ここでは、選択中の論文の抜粋を保存します。", manualSnippetPlaceholder: "この論文に関する抜粋を入力…", manualSnippetAdd: "抜粋を追加", saveSnippet: "抜粋を保存", saveFinalNote: "整理結果を保存", saved: "保存しました", askAI: "AIに質問", addNote: "論文の抜粋へ", yourQuestion: "質問", sendQuestion: "質問してハイライト", noOutline: "番号付き目次を検出できません", abstract: "要旨", copyFormula: "数式ソースをコピー", formulaCopied: "数式の Markdown をコピーしました", noQuestions: "質問はまだありません。", noSnippets: "抜粋はまだありません。", notesRunning: "AIが抜粋を整理中…", savedToNotes: "論文の抜粋に追加しました",
    noPapers: "論文はまだありません。上にPDFをドロップしてください。", uploading: "アップロードしてテキストを抽出中…", uploadDone: "翻訳キューに追加しました", uploadError: "アップロード失敗",
    statusExtracting: "抽出中", statusQueued: "翻訳待ち", statusTranslating: "翻訳中", statusReady: "閲覧可能", statusError: "エラー",
    progress: "{done} / {total} 単位を翻訳済み（{percent}%）", pending: "翻訳待ち…", page: "{page}ページ", units: "{count}単位", deleteConfirm: "この論文、PDF、翻訳をすべて削除しますか？", retrySent: "翻訳キューへ戻しました", serverError: "論文バックエンドに接続できません。server.pyで起動してください。"
  },
  en: {
    skip: "Skip to content", navHome: "Home", navCommands: "Commands", navProjects: "Projects", navStudy: "Study", navPapers: "Papers", navNotes: "Notes",
    label: "PAPER READER", title: "Paper reading", lead: "Drop in an English PDF, translate it with the local Codex backend, and read the English and Chinese together.",
    dropTitle: "Drop PDFs here", dropHint: "or click to choose · 60 MB maximum per file", libraryLabel: "LIBRARY", libraryTitle: "Paper library",
    emptyTitle: "Select a paper to start reading", emptyDesc: "Text is extracted and queued for translation after upload. Scanned PDFs need OCR first.", original: "Original PDF ↗", retry: "Retry translation",
    chinese: "Chinese", english: "English", footer: "PDFs and translations stay on this computer.",
    summarize: "Generate overview", summaryView: "Regenerate", summaryRunning: "Generating…", summaryRetry: "Retry", summaryLabel: "AI READING NOTES", summaryTitle: "AI reading notes", summaryWaiting: "Codex is generating a new note version.", summaryFailed: "Generation failed", versionHint: "Every generation is saved as a new version without overwriting older notes.", generateGuideNote: "Use notes guide", generateThreePass: "Use three-pass method", noAiNotes: "No AI reading notes yet. Choose a method to generate one.", versionLabel: "Version {version}", methodGuide: "Notes guide", methodThreePass: "Three-pass method", statusQueuedNote: "Queued", statusGeneratingNote: "Generating", statusErrorNote: "Failed", summaryOne: "In one sentence", summaryOverview: "Overview", summaryContributions: "Contributions", summaryMethod: "Method pipeline", summaryResults: "Experiments & results", summaryLimitations: "Limitations", summaryTerms: "Key terms", summaryQuestions: "Questions for close reading", summaryType: "Paper type", summaryResearch: "Research question", summaryContext: "Context", summaryAssumptions: "Assumptions & validity", summaryAudit: "Experiment audit", summaryReproduce: "Reproduction checklist",
    allPapers: "All papers", addFolder: "＋ Folder", folderName: "Folder name", renameFolder: "Rename", deleteFolder: "Delete folder", uncategorized: "Uncategorized", outline: "Outline", collapseSidebar: "Collapse outline", showSidebar: "Expand outline", collapseLibrary: "Collapse library", showLibrary: "Expand library", backToLibrary: "Back to paper library", readerRoomTitle: "Full-text reading", readerRoomLead: "A focused reading room for going through the whole paper.", modeBilingual: "Bilingual", modeEnglish: "English only", modeChinese: "Chinese only", moduleReading: "Bilingual reading", moduleAssist: "AI close reading", moduleNotes: "Paper clippings", ctrlTip: "Hold Ctrl and hover an English sentence to see its Chinese translation", questionsTitle: "Highlights & questions", notesTitle: "Paper clippings", generateNotes: "Organize clippings with AI", notesHint: "Save clippings from the selected paper here.", manualSnippetPlaceholder: "Add material about this paper…", manualSnippetAdd: "Add clipping", saveSnippet: "Save clipping", saveFinalNote: "Save result", saved: "Changes saved", askAI: "Ask AI", addNote: "Add paper clipping", yourQuestion: "Your question", sendQuestion: "Ask and highlight", noOutline: "No numbered outline detected", abstract: "Abstract", copyFormula: "Copy formula source", formulaCopied: "Formula Markdown copied", noQuestions: "No highlights or questions yet.", noSnippets: "No clippings yet.", notesRunning: "AI is organizing the clippings…", savedToNotes: "Added to paper clippings",
    noPapers: "No papers yet. Drop a PDF above to begin.", uploading: "Uploading and extracting text…", uploadDone: "Added to the translation queue", uploadError: "Upload failed",
    statusExtracting: "Extracting", statusQueued: "Queued", statusTranslating: "Translating", statusReady: "Ready", statusError: "Error",
    progress: "Translated {done} / {total} reading units ({percent}%)", pending: "Waiting for translation…", page: "Page {page}", units: "{count} reading units", deleteConfirm: "Delete this paper, its PDF, and all translations?", retrySent: "Returned to translation queue", serverError: "Cannot reach the paper backend. Start the site with server.py."
  }
};

Object.assign(paperTranslations.zh, { chooseTargetTitle: "选择论文翻译语言", chooseTargetDesc: "该设置只用于这篇论文，与程序界面语言相互独立。", cancel: "取消", "target.zh": "中文", "target.ja": "日本語", "target.ko": "한국어", modeBilingualTarget: "English ↔ {target}", modeTranslation: "只看{target}", translationLabel: "{target}译文", copyTitle: "复制完整标题", titleCopied: "已复制", originalEquation: "查看原 PDF 公式", formulaPending: "公式正在等待可靠的 LaTeX 转写；暂时显示原 PDF 公式。", enrichPaper: "补全公式与图注" });
Object.assign(paperTranslations.ja, { chooseTargetTitle: "論文の翻訳言語を選択", chooseTargetDesc: "この設定はこの論文だけに適用され、UI言語とは独立しています。", cancel: "キャンセル", "target.zh": "中文", "target.ja": "日本語", "target.ko": "한국어", modeBilingualTarget: "English ↔ {target}", modeTranslation: "{target}のみ", translationLabel: "{target}訳", copyTitle: "タイトル全文をコピー", titleCopied: "コピー済み", originalEquation: "元PDFの数式を確認", formulaPending: "信頼できる LaTeX 変換を待っています。現在は元 PDF の数式を表示します。", enrichPaper: "数式と図注を補完" });
Object.assign(paperTranslations.en, { chooseTargetTitle: "Choose the paper translation language", chooseTargetDesc: "This setting belongs to this paper and is independent of the interface language.", cancel: "Cancel", "target.zh": "Chinese", "target.ja": "Japanese", "target.ko": "Korean", modeBilingualTarget: "English ↔ {target}", modeTranslation: "{target} only", translationLabel: "{target} translation", copyTitle: "Copy full title", titleCopied: "Copied", originalEquation: "View original PDF equation", formulaPending: "This formula is waiting for a reliable LaTeX transcription; the original PDF rendering is shown for now.", enrichPaper: "Complete formulas & captions" });
paperTranslations.ko = {
  skip: "본문으로 이동", navHome: "홈", navCommands: "명령어", navProjects: "프로젝트", navStudy: "학습", navPapers: "논문", navNotes: "노트",
  label: "논문 리더", title: "논문 읽기", lead: "영문 PDF를 추가하고 로컬 Codex로 번역하여 원문과 번역문을 함께 읽습니다.",
  dropTitle: "PDF를 여기에 놓으세요", dropHint: "또는 클릭하여 선택 · 파일당 최대 60MB", libraryLabel: "라이브러리", libraryTitle: "논문 라이브러리",
  emptyTitle: "읽을 논문을 선택하세요", emptyDesc: "업로드 후 텍스트를 추출하고 번역 대기열에 추가합니다. 스캔 PDF는 먼저 OCR이 필요합니다.", original: "원본 PDF ↗", retry: "번역 다시 시도",
  chinese: "중국어", english: "English", footer: "PDF와 번역문은 이 컴퓨터에만 저장됩니다.",
  summarize: "전체 개요 생성", summaryView: "다시 생성", summaryRunning: "생성 중…", summaryRetry: "다시 시도", summaryLabel: "AI 읽기 노트", summaryTitle: "AI 읽기 노트", summaryWaiting: "Codex가 새 노트 버전을 생성하고 있습니다.", summaryFailed: "생성 실패", versionHint: "생성할 때마다 이전 노트를 덮어쓰지 않고 새 버전으로 저장합니다.", generateGuideNote: "노트 가이드로 생성", generateThreePass: "3단계 읽기법으로 생성", noAiNotes: "AI 읽기 노트가 없습니다. 생성 방식을 선택하세요.", versionLabel: "버전 {version}", methodGuide: "노트 가이드", methodThreePass: "3단계 읽기법", statusQueuedNote: "대기 중", statusGeneratingNote: "생성 중", statusErrorNote: "생성 실패", summaryOne: "한 문장 요약", summaryOverview: "개요", summaryContributions: "주요 기여", summaryMethod: "방법 파이프라인", summaryResults: "실험 및 결과", summaryLimitations: "한계", summaryTerms: "핵심 개념", summaryQuestions: "정독 질문", summaryType: "논문 유형", summaryResearch: "연구 질문", summaryContext: "연구 배경", summaryAssumptions: "가정과 타당성", summaryAudit: "실험 검토", summaryReproduce: "재현 체크리스트",
  allPapers: "모든 논문", addFolder: "＋ 폴더", folderName: "폴더 이름", renameFolder: "이름 변경", deleteFolder: "폴더 삭제", uncategorized: "미분류", outline: "목차", collapseSidebar: "목차 접기", showSidebar: "목차 펼치기", collapseLibrary: "라이브러리 접기", showLibrary: "라이브러리 펼치기", backToLibrary: "논문 라이브러리로 돌아가기", readerRoomTitle: "전체 논문 읽기", readerRoomLead: "집중할 수 있는 공간에서 논문 전체를 이어서 읽습니다.", modeBilingual: "대조 읽기", modeEnglish: "영어만", modeChinese: "중국어만", moduleReading: "대조 읽기", moduleAssist: "AI 정독", moduleNotes: "논문 스크랩", ctrlTip: "Ctrl을 누른 채 영문 문장에 마우스를 올리면 번역문을 봅니다.", questionsTitle: "하이라이트 및 질문", notesTitle: "논문 스크랩", generateNotes: "AI로 스크랩 정리", notesHint: "여기에 현재 논문의 스크랩을 저장합니다.", manualSnippetPlaceholder: "이 논문에 관한 내용을 입력하세요…", manualSnippetAdd: "스크랩 추가", saveSnippet: "스크랩 저장", saveFinalNote: "정리 결과 저장", saved: "변경 사항을 저장했습니다", askAI: "AI에게 질문", addNote: "논문 스크랩에 추가", yourQuestion: "질문", sendQuestion: "질문하고 하이라이트", noOutline: "번호가 있는 목차를 찾지 못했습니다", abstract: "초록", copyFormula: "수식 소스 복사", formulaCopied: "수식 Markdown을 복사했습니다", noQuestions: "하이라이트나 질문이 없습니다.", noSnippets: "스크랩이 없습니다.", notesRunning: "AI가 스크랩을 정리하고 있습니다…", savedToNotes: "논문 스크랩에 추가했습니다",
  noPapers: "아직 논문이 없습니다. 위에 PDF를 놓아 시작하세요.", uploading: "업로드하고 텍스트를 추출하는 중…", uploadDone: "번역 대기열에 추가했습니다", uploadError: "업로드 실패",
  statusExtracting: "추출 중", statusQueued: "번역 대기", statusTranslating: "번역 중", statusReady: "읽기 가능", statusError: "오류",
  progress: "읽기 단위 {done} / {total}개 번역 완료 ({percent}%)", pending: "번역 대기 중…", page: "{page}페이지", units: "읽기 단위 {count}개", deleteConfirm: "이 논문과 PDF 및 모든 번역을 삭제할까요?", retrySent: "번역 대기열에 다시 추가했습니다", serverError: "논문 서버에 연결할 수 없습니다. server.py로 사이트를 시작하세요.",
  chooseTargetTitle: "논문 번역 언어 선택", chooseTargetDesc: "이 설정은 해당 논문에만 적용되며 인터페이스 언어와 독립적입니다.", cancel: "취소", "target.zh": "중국어", "target.ja": "일본어", "target.ko": "한국어", modeBilingualTarget: "English ↔ {target}", modeTranslation: "{target}만", translationLabel: "{target} 번역", copyTitle: "전체 제목 복사", titleCopied: "복사됨", originalEquation: "원본 PDF 수식 보기", formulaPending: "신뢰할 수 있는 LaTeX 변환을 기다리는 중입니다. 현재는 원본 PDF 수식을 표시합니다.", enrichPaper: "수식 및 캡션 보완"
};

const requestedModule = new URLSearchParams(location.search).get("module");
const requestedPaperKey = new URLSearchParams(location.search).get("paper");
const paperState = { papers: [], folders: [], activeFolder: "all", openFolders: new Set(), selectedId: null, requestedPaperKey, readerMode: Boolean(requestedPaperKey), holdRequestedPaper: Boolean(requestedPaperKey), selectedPaper: null, paperIR: null, images: [], sections: [], annotations: [], snippets: [], aiNoteVersions: [], selectedAiNoteVersionId: null, activeAnswer: null, module: ["reading", "assist", "notes"].includes(requestedModule) ? requestedModule : "reading", readingMode: paperStore.getItem("selfPage.readingMode.v1") || "dual", language: loadPaperLanguage(), pollTimer: null, selection: null, hoveredSentence: null };
const PAPER_VISUAL_TYPES = new Set(["figure", "table", "algorithm", "listing", "scheme", "chart", "graph", "plate", "box", "map", "photo", "image", "picture", "diagram", "illustration", "exhibit", "screenshot"]);
Object.assign(paperTranslations.zh, { chooseTargetTitle: "选择翻译语言与版式", chooseTargetDesc: "本次拖入的全部论文共用这些设置，避免批量导入时逐篇确认。", translationTarget: "翻译语言", paperLayout: "论文版式", layoutAuto: "自动分析", layoutAutoHint: "逐页快速判断，不调用 AI", layoutSingle: "单栏", layoutSingleHint: "按页面从上到下读取", layoutDouble: "双栏", layoutDoubleHint: "每页先左栏再右栏", startImport: "开始导入", cropExpand: "扩展图片裁剪", cropLeft: "向左扩展", cropRight: "向右扩展", cropTop: "向上扩展", cropBottom: "向下扩展", cropAll: "向四周扩展", cropSaved: "图片裁剪已更新" });
Object.assign(paperTranslations.ja, { chooseTargetTitle: "翻訳言語とレイアウトを選択", chooseTargetDesc: "今回追加するすべての論文に同じ設定を適用します。", translationTarget: "翻訳言語", paperLayout: "論文レイアウト", layoutAuto: "自動判定", layoutAutoHint: "各ページを高速判定（AI不使用）", layoutSingle: "1段組", layoutSingleHint: "ページを上から下へ読む", layoutDouble: "2段組", layoutDoubleHint: "各ページの左段から右段へ読む", startImport: "インポート開始", cropExpand: "画像範囲を拡張", cropLeft: "左へ拡張", cropRight: "右へ拡張", cropTop: "上へ拡張", cropBottom: "下へ拡張", cropAll: "全方向へ拡張", cropSaved: "画像範囲を更新しました" });
Object.assign(paperTranslations.en, { chooseTargetTitle: "Choose translation and layout", chooseTargetDesc: "These settings apply once to every paper in this drop, so batch imports need no repeated prompts.", translationTarget: "Translation language", paperLayout: "Paper layout", layoutAuto: "Auto-detect", layoutAutoHint: "Fast per-page detection, no AI call", layoutSingle: "Single column", layoutSingleHint: "Read each page from top to bottom", layoutDouble: "Double column", layoutDoubleHint: "Read the left column before the right", startImport: "Start import", cropExpand: "Expand image crop", cropLeft: "Expand left", cropRight: "Expand right", cropTop: "Expand upward", cropBottom: "Expand downward", cropAll: "Expand on all sides", cropSaved: "Image crop updated" });
Object.assign(paperTranslations.ko, { chooseTargetTitle: "번역 언어와 레이아웃 선택", chooseTargetDesc: "이번에 추가하는 모든 논문에 같은 설정을 한 번만 적용합니다.", translationTarget: "번역 언어", paperLayout: "논문 레이아웃", layoutAuto: "자동 분석", layoutAutoHint: "AI 없이 페이지별 빠른 판별", layoutSingle: "단일 열", layoutSingleHint: "페이지를 위에서 아래로 읽기", layoutDouble: "두 열", layoutDoubleHint: "각 페이지에서 왼쪽 열 다음 오른쪽 열", startImport: "가져오기 시작", cropExpand: "이미지 자르기 확장", cropLeft: "왼쪽으로 확장", cropRight: "오른쪽으로 확장", cropTop: "위로 확장", cropBottom: "아래로 확장", cropAll: "모든 방향으로 확장", cropSaved: "이미지 자르기를 업데이트했습니다" });
Object.assign(paperTranslations.zh, { translationStats: "翻译耗时 {time} · {tokens} tokens", translationTokenDetail: "输入 {input} · 缓存输入 {cached} · 输出 {output} · 其中推理输出 {reasoning}" });
Object.assign(paperTranslations.ja, { translationStats: "翻訳時間 {time} · {tokens} tokens", translationTokenDetail: "入力 {input} · キャッシュ入力 {cached} · 出力 {output} · 推論出力 {reasoning}" });
Object.assign(paperTranslations.en, { translationStats: "Translation time {time} · {tokens} tokens", translationTokenDetail: "Input {input} · cached input {cached} · output {output} · reasoning output {reasoning}" });
Object.assign(paperTranslations.ko, { translationStats: "번역 시간 {time} · {tokens} tokens", translationTokenDetail: "입력 {input} · 캐시 입력 {cached} · 출력 {output} · 추론 출력 {reasoning}" });
document.body.classList.toggle("reader-page", paperState.readerMode);
const paperEls = {
  languageButtons: document.querySelectorAll("[data-lang]"), dropZone: document.querySelector("#paperDropZone"), fileInput: document.querySelector("#paperFileInput"), translationLanguageDialog: document.querySelector("#translationLanguageDialog"), importOptionsForm: document.querySelector("#paperImportOptionsForm"), modeBilingualButton: document.querySelector("#modeBilingualButton"), modeTranslationButton: document.querySelector("#modeTranslationButton"), translationColumnLabel: document.querySelector("#translationColumnLabel"), paperCount: document.querySelector("#paperCount"), allPaperCount: document.querySelector("#allPaperCount"), uploadNotice: document.querySelector("#uploadNotice"), paperList: document.querySelector("#paperList"), folderList: document.querySelector("#folderList"), allPapersFolder: document.querySelector("#allPapersFolder"), addFolderButton: document.querySelector("#addFolderButton"), paperFolderSelect: document.querySelector("#paperFolderSelect"), libraryBar: document.querySelector("#paperLibraryBar"), libraryToggle: document.querySelector("#paperLibraryToggle"), activeFolderTitle: document.querySelector("#activeFolderTitle"), activeFolderMeta: document.querySelector("#activeFolderMeta"), workspace: document.querySelector("#paperWorkspace"), outlineToggle: document.querySelector("#outlineSidebarToggle"), outline: document.querySelector("#paperOutline"), readerEmpty: document.querySelector("#readerEmpty"), readerContent: document.querySelector("#readerContent"), readerStatus: document.querySelector("#readerStatus"), readerTitle: document.querySelector("#readerTitle"), readerMeta: document.querySelector("#readerMeta"), readerTranslationStats: document.querySelector("#readerTranslationStats"), openOriginalPdf: document.querySelector("#openOriginalPdf"), retryTranslation: document.querySelector("#retryTranslation"), guideNoteButton: document.querySelector("#guideNoteButton"), threePassNoteButton: document.querySelector("#threePassNoteButton"), aiNoteVersionList: document.querySelector("#aiNoteVersionList"), summaryStatus: document.querySelector("#summaryStatus"), summaryContent: document.querySelector("#summaryContent"), progress: document.querySelector("#translationProgress"), progressBar: document.querySelector("#translationProgressBar"), progressText: document.querySelector("#translationProgressText"), moduleButtons: document.querySelectorAll("[data-paper-module]"), readerModeButtons: document.querySelectorAll("[data-reading-mode]"), columnLabels: document.querySelector("#columnLabels"), modules: { reading: document.querySelector("#moduleReading"), assist: document.querySelector("#moduleAssist"), notes: document.querySelector("#moduleNotes") }, error: document.querySelector("#paperError"), reader: document.querySelector("#bilingualReader"), translationTooltip: document.querySelector("#translationTooltip"), annotationList: document.querySelector("#annotationList"), snippetList: document.querySelector("#snippetList"), manualSnippetForm: document.querySelector("#manualSnippetForm"), manualSnippetInput: document.querySelector("#manualSnippetInput"), selectionTools: document.querySelector("#selectionTools"), askSelection: document.querySelector("#askSelection"), saveSelection: document.querySelector("#saveSelection"), questionDialog: document.querySelector("#questionDialog"), questionQuote: document.querySelector("#questionQuote"), questionInput: document.querySelector("#questionInput"), submitQuestion: document.querySelector("#submitQuestion"), answerDialog: document.querySelector("#answerDialog"), answerQuote: document.querySelector("#answerQuote"), answerQuestion: document.querySelector("#answerQuestion"), answerBody: document.querySelector("#answerBody"), askFromAnswer: document.querySelector("#askFromAnswer"), saveAnswerToNotes: document.querySelector("#saveAnswerToNotes"), toast: document.querySelector("#toast")
};

initPapers();

function initPapers() {
  setPaperLanguage(paperState.language);
  paperEls.languageButtons.forEach(button => button.addEventListener("click", () => setPaperLanguage(button.dataset.lang)));
  paperEls.fileInput.addEventListener("change", () => uploadPapers(paperEls.fileInput.files));
  ["dragenter", "dragover"].forEach(type => paperEls.dropZone.addEventListener(type, event => { event.preventDefault(); paperEls.dropZone.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach(type => paperEls.dropZone.addEventListener(type, event => { event.preventDefault(); paperEls.dropZone.classList.remove("dragging"); }));
  paperEls.dropZone.addEventListener("drop", event => uploadPapers(event.dataTransfer.files));
  paperEls.moduleButtons.forEach(button => button.addEventListener("click", () => switchModule(button.dataset.paperModule)));
  paperEls.readerModeButtons.forEach(button => button.addEventListener("click", () => setReadingMode(button.dataset.readingMode)));
  paperEls.retryTranslation.addEventListener("click", retrySelectedPaper);
  paperEls.guideNoteButton.addEventListener("click", () => generateAiNote("guide"));
  paperEls.threePassNoteButton.addEventListener("click", () => generateAiNote("three_pass"));
  paperEls.manualSnippetForm.addEventListener("submit", addManualSnippet);
  paperEls.allPapersFolder.addEventListener("click", () => setActiveFolder("all"));
  paperEls.addFolderButton.addEventListener("click", () => addFolder());
  paperEls.paperFolderSelect.addEventListener("change", moveSelectedPaper);
  paperEls.outlineToggle.addEventListener("click", toggleOutlineSidebar);
  paperEls.libraryToggle.addEventListener("click", togglePaperLibrary);
  document.addEventListener("keydown", event => {
    if (event.key !== "Control") return;
    document.body.classList.add("ctrl-held");
  });
  document.addEventListener("keyup", event => {
    if (event.key !== "Control") return;
    document.body.classList.remove("ctrl-held");
    hideTranslationTooltip();
  });
  document.addEventListener("mousemove", updateCtrlHover, { passive: true });
  window.addEventListener("blur", () => {
    document.body.classList.remove("ctrl-held");
    hideTranslationTooltip();
    paperState.hoveredSentence = null;
  });
  paperEls.readerContent.addEventListener("mouseup", captureSelection);
  paperEls.askSelection.addEventListener("click", openQuestionDialog);
  paperEls.saveSelection.addEventListener("click", saveSelectionToNotes);
  paperEls.submitQuestion.addEventListener("click", submitSelectionQuestion);
  paperEls.askFromAnswer.addEventListener("click", askFromAnswer);
  paperEls.saveAnswerToNotes.addEventListener("click", saveAnswerToNotes);
  const savedOutlineState = paperStore.getItem("selfPage.paperOutlineCollapsed.v1");
  const savedLibraryState = paperStore.getItem("selfPage.paperLibraryCollapsed.v1");
  if (savedOutlineState === "true" || (savedOutlineState === null && window.innerWidth < 900)) {
    paperEls.workspace.classList.add("outline-collapsed");
  }
  if (savedLibraryState === "true") paperEls.libraryBar.classList.add("library-collapsed");
  updateOutlineToggle();
  updateLibraryToggle();
  setReadingMode(paperState.readingMode);
  switchModule(paperState.module);
  refreshPaperLibrary();
}

function tp(key, values = {}) {
  let text = paperTranslations[paperState.language]?.[key] || paperTranslations.zh[key] || key;
  Object.entries(values).forEach(([name, value]) => { text = text.replaceAll("{" + name + "}", String(value)); });
  return text;
}

function toggleOutlineSidebar() {
  const collapsed = paperEls.workspace.classList.toggle("outline-collapsed");
  paperStore.setItem("selfPage.paperOutlineCollapsed.v1", String(collapsed));
  updateOutlineToggle();
}

function updateOutlineToggle() {
  const collapsed = paperEls.workspace.classList.contains("outline-collapsed");
  paperEls.outlineToggle.setAttribute("aria-expanded", String(!collapsed));
  paperEls.outlineToggle.title = tp(collapsed ? "showSidebar" : "collapseSidebar");
  paperEls.outlineToggle.setAttribute("aria-label", paperEls.outlineToggle.title);
  paperEls.outlineToggle.querySelector("span").textContent = collapsed ? "›" : "‹";
}

function togglePaperLibrary() {
  const collapsed = paperEls.libraryBar.classList.toggle("library-collapsed");
  paperStore.setItem("selfPage.paperLibraryCollapsed.v1", String(collapsed));
  updateLibraryToggle();
}

function updateLibraryToggle() {
  const collapsed = paperEls.libraryBar.classList.contains("library-collapsed");
  paperEls.libraryToggle.setAttribute("aria-expanded", String(!collapsed));
  paperEls.libraryToggle.title = tp(collapsed ? "showLibrary" : "collapseLibrary");
  paperEls.libraryToggle.setAttribute("aria-label", paperEls.libraryToggle.title);
  paperEls.libraryToggle.querySelector("span").textContent = collapsed ? "⌄" : "⌃";
}

function setPaperLanguage(language) {
  paperState.language = paperTranslations[language] ? language : "zh";
  paperStore.setItem(PAPER_LANGUAGE_KEY, paperState.language);
  document.documentElement.lang = { zh: "zh-CN", ja: "ja", en: "en", ko: "ko" }[paperState.language];
  document.querySelectorAll("[data-paper-i18n]").forEach(element => { element.textContent = tp(element.dataset.paperI18n); });
  document.querySelectorAll("[data-paper-i18n-placeholder]").forEach(element => { element.placeholder = tp(element.dataset.paperI18nPlaceholder); });
  const noPopupHint = tp("ctrlTip");
  const ctrlTip = document.querySelector(".ctrl-tip");
  if (ctrlTip) ctrlTip.textContent = noPopupHint;
  const answerLabels = {
    zh: ["基于回答继续提问", "保存回答到摘录"],
    ja: ["回答から再質問", "回答を抜粋に保存"],
    en: ["Ask from this answer", "Save answer to clippings"],
    ko: ["답변을 바탕으로 다시 질문", "답변을 스크랩에 저장"],
  }[paperState.language];
  if (answerLabels) {
    paperEls.askFromAnswer.textContent = answerLabels[0];
    paperEls.saveAnswerToNotes.textContent = answerLabels[1];
  }
  paperEls.languageButtons.forEach(button => { const active = button.dataset.lang === paperState.language; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  updatePaperTargetLabels();
  updateOutlineToggle();
  updateLibraryToggle();
  renderPaperList(); renderSelectedPaper(); renderSummary();
}

function loadPaperLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (paperTranslations[requested]) return requested;
  const saved = paperStore.getItem(PAPER_LANGUAGE_KEY);
  return paperTranslations[saved] ? saved : "zh";
}

async function uploadPapers(fileList) {
  const files = Array.from(fileList || []).filter(file => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  if (!files.length) return;
  const importOptions = await choosePaperImportOptions();
  paperEls.fileInput.value = "";
  if (!importOptions) return;
  for (const file of files) {
    showUploadNotice(tp("uploading") + " " + file.name);
    try {
      const data = await SelfPageAPI.request("/api/papers", { method: "POST", headers: { "Content-Type": "application/pdf", "X-Filename": encodeURIComponent(file.name), "X-Translation-Language": importOptions.targetLanguage, "X-Paper-Layout": importOptions.layoutMode }, body: file });
      paperState.selectedId = data.id;
      paperState.holdRequestedPaper = false;
      showToast(tp("uploadDone"));
    } catch (error) {
      showToast(tp("uploadError") + ": " + error.message);
    }
    await refreshPaperLibrary();
  }
  paperEls.fileInput.value = "";
  paperEls.uploadNotice.hidden = true;
}

function choosePaperImportOptions() {
  const dialog = paperEls.translationLanguageDialog;
  if (!dialog?.showModal || !paperEls.importOptionsForm) return Promise.resolve({ targetLanguage: "zh", layoutMode: "auto" });
  const targetLanguage = paperStore.getItem(PAPER_TARGET_LANGUAGE_KEY) || "zh";
  const layoutMode = paperStore.getItem(PAPER_LAYOUT_MODE_KEY) || "auto";
  const targetInput = paperEls.importOptionsForm.querySelector(`[name="targetLanguage"][value="${targetLanguage}"]`) || paperEls.importOptionsForm.querySelector('[name="targetLanguage"][value="zh"]');
  const layoutInput = paperEls.importOptionsForm.querySelector(`[name="layoutMode"][value="${layoutMode}"]`) || paperEls.importOptionsForm.querySelector('[name="layoutMode"][value="auto"]');
  targetInput.checked = true;
  layoutInput.checked = true;
  dialog.returnValue = "";
  dialog.showModal();
  return new Promise(resolve => dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "confirm") return resolve(null);
    const data = new FormData(paperEls.importOptionsForm);
    const selectedTarget = String(data.get("targetLanguage") || "zh");
    const selectedLayout = String(data.get("layoutMode") || "auto");
    if (!["zh", "ja", "ko"].includes(selectedTarget) || !["auto", "single", "double"].includes(selectedLayout)) return resolve(null);
    paperStore.setItem(PAPER_TARGET_LANGUAGE_KEY, selectedTarget);
    paperStore.setItem(PAPER_LAYOUT_MODE_KEY, selectedLayout);
    resolve({ targetLanguage: selectedTarget, layoutMode: selectedLayout });
  }, { once: true }));
}

function paperTargetLanguage() {
  return paperState.paperIR?.language?.target || paperState.selectedPaper?.targetLanguage || "zh";
}

function updatePaperTargetLabels() {
  const target = paperTargetLanguage();
  const targetName = tp(`target.${target}`);
  if (paperEls.translationColumnLabel) paperEls.translationColumnLabel.textContent = targetName;
  if (paperEls.modeBilingualButton) paperEls.modeBilingualButton.textContent = tp("modeBilingualTarget", { target: targetName });
  if (paperEls.modeTranslationButton) paperEls.modeTranslationButton.textContent = tp("modeTranslation", { target: targetName });
  if (paperEls.translationTooltip) paperEls.translationTooltip.dataset.label = tp("translationLabel", { target: targetName });
}

function showUploadNotice(message) { paperEls.uploadNotice.textContent = message; paperEls.uploadNotice.hidden = false; }

async function refreshPaperLibrary() {
  try {
    const [paperResponse, folderResponse] = await Promise.all([SelfPageAPI.request("/api/papers"), SelfPageAPI.request("/api/folders")]);
    paperState.papers = paperResponse.papers;
    paperState.folders = folderResponse.folders;
    if (paperState.readerMode && paperState.holdRequestedPaper && paperState.requestedPaperKey) {
      paperState.selectedId = resolveRequestedPaper(paperState.requestedPaperKey)?.id || null;
    }
    const requestedMissing = paperState.readerMode && paperState.holdRequestedPaper && paperState.requestedPaperKey && !paperState.selectedId;
    if (!paperState.readerMode) paperState.selectedId = null;
    if (paperState.selectedId && !paperState.papers.some(paper => paper.id === paperState.selectedId)) paperState.selectedId = null;
    if (requestedMissing) showUploadNotice("这篇论文尚未导入本地论文库。");
    const previousPaper = paperState.selectedPaper;
    const nextPaper = paperState.papers.find(paper => paper.id === paperState.selectedId) || null;
    const selectedChanged = previousPaper?.id !== nextPaper?.id;
    const translationChanged = previousPaper?.status !== nextPaper?.status || previousPaper?.translatedCount !== nextPaper?.translatedCount;
    const paperChanged = selectedChanged || ["status", "progress", "translatedCount", "summaryStatus", "aiNotePending"].some(key => previousPaper?.[key] !== nextPaper?.[key]) || previousPaper?.translationStats?.elapsedSeconds !== nextPaper?.translationStats?.elapsedSeconds || previousPaper?.translationStats?.totalTokens !== nextPaper?.translationStats?.totalTokens;
    paperState.selectedPaper = nextPaper;
    if (selectedChanged) { paperState.paperIR = null; paperState.images = []; paperState.sections = []; }
    renderFolders(); renderPaperList();
    if (paperChanged) renderSelectedPaper();
    if (paperState.selectedPaper && (selectedChanged || translationChanged || !paperState.paperIR?.blocks?.length)) await loadPaperData();
    schedulePoll();
  } catch (error) {
    showUploadNotice(tp("serverError"));
  }
}

function normalizedPaperKey(value) {
  return String(value || "").toLowerCase().replace(/\.pdf$/i, "").replaceAll("π", "pi").replace(/[^a-z0-9]+/g, "");
}

function resolveRequestedPaper(key) {
  const direct = paperState.papers.find(paper => paper.id === key);
  if (direct) return direct;
  const wanted = normalizedPaperKey(key);
  const filenameMatch = paperState.papers.find(paper => normalizedPaperKey(paper.filename) === wanted);
  if (filenameMatch) return filenameMatch;
  return paperState.papers.find(paper => normalizedPaperKey(paper.title) === wanted) || null;
}

function schedulePoll() {
  clearTimeout(paperState.pollTimer);
  if (paperState.papers.some(paper => ["extracting", "queued", "translating"].includes(paper.status) || paper.aiNotePending || ["queued", "summarizing"].includes(paper.summaryStatus) || ["queued", "generating"].includes(paper.notesStatus)) || paperState.annotations.some(item => ["queued", "answering"].includes(item.status))) paperState.pollTimer = setTimeout(async () => { await refreshPaperLibrary(); if (paperState.selectedPaper) await Promise.all([loadAnnotations(), loadAiNoteVersions()]); }, 2500);
}

function folderChildren(parentId = null) {
  return paperState.folders.filter(folder => (folder.parentId || null) === parentId);
}

function descendantFolderIds(folderId) {
  const ids = new Set([folderId]);
  let changed = true;
  while (changed) {
    changed = false;
    paperState.folders.forEach(folder => {
      if (folder.parentId && ids.has(folder.parentId) && !ids.has(folder.id)) {
        ids.add(folder.id);
        changed = true;
      }
    });
  }
  return ids;
}

function folderPaperCount(folderId) {
  const ids = descendantFolderIds(folderId);
  return paperState.papers.filter(paper => ids.has(paper.folderId)).length;
}

function folderPath(folderId) {
  const names = [];
  const visited = new Set();
  let folder = paperState.folders.find(item => item.id === folderId);
  while (folder && !visited.has(folder.id)) {
    visited.add(folder.id);
    names.unshift(folder.name);
    folder = paperState.folders.find(item => item.id === folder.parentId);
  }
  return names.join(" / ");
}

function openPaper(paper) {
  const params = new URLSearchParams({ paper: paper.id, module: "reading" });
  if (paperState.language !== "zh") params.set("lang", paperState.language);
  location.href = `./papers.html?${params.toString()}`;
}

function renderPaperList() {
  paperEls.paperCount.textContent = String(paperState.papers.length);
  paperEls.allPaperCount.textContent = String(paperState.papers.length);
  const activeFolder = paperState.folders.find(folder => folder.id === paperState.activeFolder);
  const visiblePapers = paperState.activeFolder === "all"
    ? paperState.papers
    : paperState.activeFolder === "none"
      ? paperState.papers.filter(paper => !paper.folderId)
      : paperState.papers.filter(paper => descendantFolderIds(paperState.activeFolder).has(paper.folderId));
  if (paperEls.activeFolderTitle) paperEls.activeFolderTitle.textContent = activeFolder?.name || (paperState.activeFolder === "none" ? tp("uncategorized") : tp("allPapers"));
  if (paperEls.activeFolderMeta) paperEls.activeFolderMeta.textContent = `${visiblePapers.length} / ${paperState.papers.length}`;
  if (!visiblePapers.length) { const empty = document.createElement("p"); empty.className = "paper-list-empty"; empty.textContent = tp("noPapers"); paperEls.paperList.replaceChildren(empty); return; }
  const nodes = visiblePapers.map(paper => {
    const wrapper = document.createElement("div"); wrapper.className = "paper-list-card";
    const button = document.createElement("button"); button.type = "button"; button.className = "paper-list-item"; button.classList.toggle("selected", paper.id === paperState.selectedId);
    const title = document.createElement("h3"); title.textContent = paper.title;
    const meta = document.createElement("p"); const status = document.createElement("span"); status.className = "paper-status" + (paper.status === "error" ? " error" : ""); status.textContent = statusText(paper); const target = document.createElement("span"); target.textContent = `EN ↔ ${tp(`target.${paper.targetLanguage || "zh"}`)}`; const size = document.createElement("span"); size.textContent = formatBytes(paper.sizeBytes); meta.append(status, target, size); if (hasTranslationStats(paper)) { const usage = document.createElement("span"); usage.textContent = shortTranslationStats(paper); usage.title = detailedTranslationTokens(paper); meta.append(usage); } button.append(title, meta);
    button.addEventListener("click", () => openPaper(paper));
    const pdf = document.createElement("a"); pdf.className = "paper-list-pdf"; pdf.href = SelfPageAPI.url(`/api/papers/${paper.id}/pdf`); pdf.target = "_blank"; pdf.rel = "noreferrer"; pdf.textContent = "PDF ↗"; pdf.setAttribute("aria-label", `Open PDF: ${paper.title}`);
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "paper-list-delete"; remove.textContent = "×"; remove.setAttribute("aria-label", "Delete " + paper.title); remove.addEventListener("click", () => deletePaper(paper));
    wrapper.append(button, pdf, remove); return wrapper;
  });
  paperEls.paperList.replaceChildren(...nodes);
}

function renderFolderBranch(parentId = null, depth = 0) {
  const nodes = [];
  folderChildren(parentId).forEach(folder => {
    const children = folderChildren(folder.id);
    const hasChildren = children.length > 0;
    const node = document.createElement("div"); node.className = "folder-node";
    const row = document.createElement("div"); row.className = "folder-row"; row.style.setProperty("--folder-indent", `${depth * 11}px`);
    const expand = document.createElement("button"); expand.className = "folder-expand"; expand.type = "button"; expand.disabled = !hasChildren;
    expand.textContent = hasChildren ? (paperState.openFolders.has(folder.id) ? "⌄" : "›") : "·";
    expand.setAttribute("aria-label", hasChildren ? "展开或收起文件夹" : "没有子文件夹");
    expand.addEventListener("click", event => {
      event.stopPropagation();
      if (!hasChildren) return;
      if (paperState.openFolders.has(folder.id)) paperState.openFolders.delete(folder.id); else paperState.openFolders.add(folder.id);
      renderFolders();
    });
    const button = document.createElement("button"); button.className = "folder-filter"; button.type = "button"; button.classList.toggle("active", paperState.activeFolder === folder.id);
    const name = document.createElement("span"); name.className = "folder-name"; name.textContent = folder.name;
    const count = document.createElement("small"); count.textContent = folderPaperCount(folder.id); button.append(name, count);
    button.addEventListener("click", () => setActiveFolder(folder.id));
    const menu = document.createElement("button"); menu.className = "folder-menu"; menu.type = "button"; menu.textContent = "···"; menu.setAttribute("aria-label", folder.name);
    menu.addEventListener("click", event => { event.stopPropagation(); editFolder(folder); });
    row.append(expand, button, menu); node.append(row);
    if (hasChildren && paperState.openFolders.has(folder.id)) {
      const childList = document.createElement("div"); childList.className = "folder-children"; childList.append(...renderFolderBranch(folder.id, depth + 1)); node.append(childList);
    }
    nodes.push(node);
  });
  return nodes;
}

function renderFolders() {
  paperEls.allPapersFolder.classList.toggle("active", paperState.activeFolder === "all");
  const nodes = renderFolderBranch();
  const uncategorized = paperState.papers.filter(paper => !paper.folderId).length;
  if (uncategorized) {
    const button = document.createElement("button"); button.className = "folder-filter"; button.type = "button"; button.classList.toggle("active", paperState.activeFolder === "none");
    button.innerHTML = `<span>${escapeHtml(tp("uncategorized"))}</span><small>${uncategorized}</small>`; button.addEventListener("click", () => setActiveFolder("none")); nodes.push(button);
  }
  paperEls.folderList.replaceChildren(...nodes);
  const options = [new Option(tp("uncategorized"), ""), ...paperState.folders.map(folder => new Option(`${folderPath(folder.id)}`, folder.id))];
  paperEls.paperFolderSelect.replaceChildren(...options);
  paperEls.paperFolderSelect.value = paperState.selectedPaper?.folderId || "";
}

function setActiveFolder(folderId) { paperState.activeFolder = folderId; renderFolders(); renderPaperList(); }
async function addFolder(parentId = null) {
  const normalizedParentId = typeof parentId === "string" && parentId.trim() ? parentId.trim() : null;
  const name = window.prompt(tp("folderName"));
  if (!name?.trim()) return;
  try {
    await apiJson("/api/folders", { method: "POST", body: { name: name.trim(), parentId: normalizedParentId } });
    if (normalizedParentId) paperState.openFolders.add(normalizedParentId);
    await refreshPaperLibrary();
    showToast(tp("saved"));
  } catch (error) {
    showToast(error.message);
  }
}
async function editFolder(folder) {
  const action = window.prompt(`${tp("renameFolder")}: r\n新建子文件夹: c\n${tp("deleteFolder")}: d`, "r");
  try {
    if (action === "r") {
      const name = window.prompt(tp("folderName"), folder.name);
      if (!name?.trim()) return;
      await apiJson(`/api/folders/${folder.id}/rename`, { method: "POST", body: { name: name.trim() } });
    } else if (action === "c") {
      await addFolder(folder.id);
      return;
    } else if (action === "d" && window.confirm(`${tp("deleteFolder")}: ${folder.name}?`)) {
      await apiJson(`/api/folders/${folder.id}`, { method: "DELETE" });
      if (paperState.activeFolder === folder.id) paperState.activeFolder = "all";
    } else {
      return;
    }
    await refreshPaperLibrary();
    showToast(tp("saved"));
  } catch (error) {
    showToast(error.message);
  }
}
async function moveSelectedPaper() {
  if (!paperState.selectedPaper) return;
  const previousFolderId = paperState.selectedPaper.folderId || "";
  try {
    await apiJson(`/api/papers/${paperState.selectedPaper.id}/folder`, { method: "POST", body: { folderId: paperEls.paperFolderSelect.value || null } });
    await refreshPaperLibrary();
    showToast(tp("saved"));
  } catch (error) {
    paperEls.paperFolderSelect.value = previousFolderId;
    showToast(error.message);
  }
}

function statusText(paper) {
  const key = { extracting: "statusExtracting", queued: "statusQueued", translating: "statusTranslating", ready: "statusReady", error: "statusError" }[paper.status] || "statusQueued";
  return tp(key) + (paper.status === "translating" ? " · " + paper.progress + "%" : "");
}

function hasTranslationStats(paper) {
  const stats = paper?.translationStats;
  return Boolean(stats?.startedAt || stats?.elapsedSeconds || stats?.totalTokens);
}

function formatDuration(seconds) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  if (value < 60) return `${value}s`;
  if (value < 3600) return `${Math.floor(value / 60)}m ${value % 60}s`;
  return `${Math.floor(value / 3600)}h ${Math.floor((value % 3600) / 60)}m`;
}

function formatTokenCount(value) {
  return new Intl.NumberFormat(paperState.language === "zh" ? "zh-CN" : paperState.language).format(Math.max(0, Number(value) || 0));
}

function shortTranslationStats(paper) {
  const stats = paper.translationStats || {};
  return tp("translationStats", { time: formatDuration(stats.elapsedSeconds), tokens: formatTokenCount(stats.totalTokens) });
}

function detailedTranslationTokens(paper) {
  const stats = paper.translationStats || {};
  return tp("translationTokenDetail", {
    input: formatTokenCount(stats.inputTokens), cached: formatTokenCount(stats.cachedInputTokens),
    output: formatTokenCount(stats.outputTokens), reasoning: formatTokenCount(stats.reasoningOutputTokens)
  });
}

function renderSelectedPaper() {
  const paper = paperState.selectedPaper;
  paperEls.readerEmpty.hidden = Boolean(paper); paperEls.readerContent.hidden = !paper;
  if (!paper) return;
  updatePaperTargetLabels();
  paperEls.readerStatus.textContent = statusText(paper); paperEls.readerTitle.textContent = paper.title;
  paperEls.readerMeta.textContent = paper.filename + " · " + formatBytes(paper.sizeBytes) + " · " + tp("units", { count: paper.unitCount });
  paperEls.readerTranslationStats.hidden = !hasTranslationStats(paper);
  paperEls.readerTranslationStats.textContent = hasTranslationStats(paper) ? shortTranslationStats(paper) : "";
  paperEls.readerTranslationStats.title = hasTranslationStats(paper) ? detailedTranslationTokens(paper) : "";
  paperEls.openOriginalPdf.href = SelfPageAPI.url("/api/papers/" + paper.id + "/pdf");
  updatePaperEnrichmentButton();
  const active = ["extracting", "queued", "translating"].includes(paper.status);
  paperEls.progress.hidden = !active; paperEls.progressBar.style.width = paper.progress + "%";
  paperEls.progressText.textContent = tp("progress", { done: paper.translatedCount, total: paper.unitCount, percent: paper.progress });
  paperEls.error.hidden = paper.status !== "error"; paperEls.error.textContent = paper.error || "";
  paperEls.paperFolderSelect.value = paper.folderId || "";
  renderSummary(); renderReader(); renderOutline(); renderAnnotations(); renderNotes();
}

async function loadPaperData() {
  const paper = paperState.selectedPaper;
  if (!paper || !paper.unitCount) { paperState.paperIR = null; renderReader(); return; }
  try {
  const [paperIR, annotations, snippets, aiNotes] = await Promise.all([
      apiJson(`/api/papers/${paper.id}/paper-ir`),
      apiJson(`/api/papers/${paper.id}/annotations`),
      apiJson(`/api/papers/${paper.id}/snippets`),
      apiJson(`/api/papers/${paper.id}/ai-notes`)
    ]);
    paperState.paperIR = paperIR; paperState.images = paperIR.assets || []; paperState.sections = paperIR.outline || []; paperState.annotations = annotations.annotations; paperState.snippets = snippets.snippets; paperState.aiNoteVersions = aiNotes.versions;
    updatePaperTargetLabels();
    updatePaperEnrichmentButton();
    if (!paperState.aiNoteVersions.some(version => version.id === paperState.selectedAiNoteVersionId)) paperState.selectedAiNoteVersionId = paperState.aiNoteVersions[0]?.id || null;
    renderReader(); renderOutline(); renderAnnotations(); renderNotes(); renderSummary(); schedulePoll();
  } catch (error) { paperEls.error.hidden = false; paperEls.error.textContent = error.message; }
}

function updatePaperEnrichmentButton() {
  const paper = paperState.selectedPaper;
  if (!paper || !paperEls.retryTranslation) return;
  const equationsPending = (paperState.paperIR?.equations || []).some(equation => equation.latexStatus !== "ready" || !equation.latex);
  const captionsPending = (paperState.paperIR?.assets || []).some(asset => asset.caption && !asset.translatedCaption);
  const enrichmentPending = paper.status === "ready" && (equationsPending || captionsPending);
  paperEls.retryTranslation.hidden = paper.status !== "error" && !enrichmentPending;
  paperEls.retryTranslation.textContent = enrichmentPending ? tp("enrichPaper") : tp("retry");
}

async function loadAnnotations() { if (!paperState.selectedPaper) return; const data = await apiJson(`/api/papers/${paperState.selectedPaper.id}/annotations`); paperState.annotations = data.annotations; renderAnnotations(); schedulePoll(); }
async function loadAiNoteVersions() {
  if (!paperState.selectedPaper) return;
  const data = await apiJson(`/api/papers/${paperState.selectedPaper.id}/ai-notes`);
  const signature = versions => versions.map(version => [version.id, version.status, version.updatedAt, version.content?.markdown?.length || 0].join(":")).join("|");
  const before = signature(paperState.aiNoteVersions);
  paperState.aiNoteVersions = data.versions;
  if (!paperState.aiNoteVersions.some(version => version.id === paperState.selectedAiNoteVersionId)) paperState.selectedAiNoteVersionId = paperState.aiNoteVersions[0]?.id || null;
  if (before !== signature(paperState.aiNoteVersions)) renderSummary();
  schedulePoll();
}

function switchModule(module) {
  paperState.module = module;
  paperEls.moduleButtons.forEach(button => button.classList.toggle("active", button.dataset.paperModule === module));
  Object.entries(paperEls.modules).forEach(([name, element]) => { element.hidden = name !== module; });
  if (module === "assist") renderSummary();
  if (module === "notes") renderNotes();
}

function setReadingMode(mode) {
  paperState.readingMode = ["dual", "english", "chinese"].includes(mode) ? mode : "dual";
  paperStore.setItem("selfPage.readingMode.v1", paperState.readingMode);
  paperEls.readerModeButtons.forEach(button => {
    const active = button.dataset.readingMode === paperState.readingMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  paperEls.columnLabels.hidden = paperState.readingMode !== "dual";
  if (paperState.paperIR?.blocks?.length) renderReader();
}

function renderReader() {
  paperEls.reader.className = `bilingual-reader ${paperState.readingMode}-mode`;
  const blocks = paperState.paperIR?.blocks || [];
  const frontMatter = paperState.paperIR?.frontMatter;
  if (!blocks.length && !frontMatter) { clearMathTypesetting(paperEls.reader); paperEls.reader.replaceChildren(); return; }
  const nodes = blocks.map(block => {
    if (block.type === "heading") return createPaperHeading(block);
    if (block.type === "paragraph") return createBilingualParagraph(block);
    if (block.type === "reference") return createReferenceEntry(block);
    if (block.type === "equation") return createEquationBlock(block);
    if (PAPER_VISUAL_TYPES.has(block.type)) return createPaperVisual(block);
    return document.createComment(`Unknown Paper IR block: ${block.type}`);
  });
  clearMathTypesetting(paperEls.reader);
  paperEls.reader.replaceChildren(...(frontMatter ? [createPaperFrontMatter(frontMatter)] : []), ...nodes);
  applyPersistentHighlights();
  queueMathTypeset(paperEls.reader);
}

function createPaperFrontMatter(frontMatter) {
  const header = document.createElement("header"); header.className = "paper-front-matter";
  const title = document.createElement("h1"); title.className = "paper-document-title";
  appendTextRuns(title, frontMatter.titleRuns, frontMatter.title || paperState.selectedPaper?.title || "");
  const titleCopy = document.createElement("button"); titleCopy.type = "button"; titleCopy.className = "paper-title-copy"; titleCopy.textContent = tp("copyTitle");
  titleCopy.addEventListener("click", async () => {
    await copyPlainText(frontMatter.title || paperState.selectedPaper?.title || "");
    titleCopy.textContent = tp("titleCopied"); window.setTimeout(() => { titleCopy.textContent = tp("copyTitle"); }, 1400);
  });
  header.append(title, titleCopy);
  if (frontMatter.translatedTitle) {
    const translatedTitle = document.createElement("p"); translatedTitle.className = "paper-document-title-zh";
    appendTextRuns(translatedTitle, frontMatter.translatedTitleRuns, frontMatter.translatedTitle);
    header.append(translatedTitle);
  }
  if (frontMatter.authors?.length) {
    const authors = document.createElement("p"); authors.className = "paper-document-authors"; authors.textContent = frontMatter.authors.join(" · "); header.append(authors);
  }
  const abstract = frontMatter.abstract;
  if (abstract) {
    const section = document.createElement("section"); section.className = "paper-abstract"; section.id = abstract.id || "abstract";
    const heading = document.createElement("h2"); heading.textContent = tp("abstract");
    const pair = document.createElement("article"); pair.className = "reading-unit paragraph-pair abstract-pair"; pair.dataset.blockId = abstract.id || "abstract";
    const en = document.createElement("div"); en.className = "paragraph-en source-sentence"; en.tabIndex = 0; en.translationText = abstract.translatedText || tp("pending");
    appendTextRuns(en, abstract.sourceRuns, abstract.sourceText);
    const zh = document.createElement("div"); zh.className = "paragraph-zh translated-sentence";
    appendTextRuns(zh, abstract.translatedRuns, abstract.translatedText || tp("pending"));
    zh.classList.toggle("translation-pending", !abstract.translatedText);
    pair.append(en, zh); section.append(heading, pair); header.append(section);
  }
  return header;
}

function createPaperHeading(block) {
  const level = Math.max(1, Math.min(3, Number(block.level) || 1));
  const heading = document.createElement("header"); heading.className = `section-marker section-level-${level}`; heading.id = block.id;
  const number = document.createElement("span"); number.className = "section-number"; number.textContent = block.number || "";
  const stack = document.createElement("div"); stack.className = "section-title-stack";
  const title = document.createElement(level === 1 ? "h2" : level === 2 ? "h3" : "h4"); title.textContent = block.title;
  stack.append(title);
  if (block.translatedTitle) {
    const translated = document.createElement("p"); translated.className = "section-title-zh"; translated.textContent = block.translatedTitle; stack.append(translated);
  }
  heading.append(number, stack);
  return heading;
}

function createBilingualParagraph(block) {
  const metadata = block.role === "metadata";
  const article = document.createElement("article"); article.className = "reading-unit " + (metadata ? "metadata-row" : "paragraph-pair"); article.id = block.id; article.dataset.blockId = block.id;
  const en = document.createElement("div"); en.className = "paragraph-en source-sentence"; en.tabIndex = 0; en.translationText = block.translatedText || tp("pending");
  appendTextRuns(en, block.sourceRuns, block.sourceText);
  appendReferenceLinks(en, [...(block.visualRefs || [...(block.figureRefs || []), ...(block.tableRefs || [])]), ...(block.equationRefs || [])]);
  if (metadata) { article.append(en); return article; }
  const zh = document.createElement("div"); zh.className = "paragraph-zh translated-sentence";
  appendTextRuns(zh, block.translatedRuns, block.translatedText || tp("pending"));
  zh.classList.toggle("translation-pending", !block.translatedText);
  article.append(en, zh);
  return article;
}

function createReferenceEntry(block) {
  const entry = document.createElement("article");
  entry.className = "paper-reference-entry";
  entry.id = block.id;
  entry.dataset.blockId = block.id;
  appendTextRuns(entry, block.sourceRuns, block.sourceText);
  return entry;
}

function appendTextRuns(element, runs, fallback) {
  const normalizedRuns = Array.isArray(runs) && runs.length ? runs : [{ type: "text", text: fallback || "" }];
  normalizedRuns.forEach(run => {
    if (run.type === "inline_math") {
      const shell = document.createElement("span"); shell.className = "inline-math-shell";
      const formula = document.createElement("span"); formula.className = "math-fragment"; formula.textContent = `\\(${run.latex}\\)`;
      shell.append(formula, createMathCopyButton(run.latex, false)); element.append(shell);
    } else element.append(document.createTextNode(run.text || ""));
  });
}

function appendReferenceLinks(element, referenceIds) {
  const uniqueIds = [...new Set(referenceIds)];
  if (!uniqueIds.length) return;
  const references = document.createElement("span"); references.className = "paper-reference-links";
  uniqueIds.forEach(id => references.append(createFigureReference(id)));
  element.append(document.createTextNode(" "), references);
}

function createFigureReference(referenceId) {
  const target = (paperState.paperIR?.assets || []).find(asset => asset.id === referenceId)
    || (paperState.paperIR?.blocks || []).find(block => block.id === referenceId);
  const link = document.createElement("a"); link.className = "figure-reference"; link.href = `#${referenceId}`; link.textContent = target?.label || target?.number || referenceId;
  link.addEventListener("click", event => { event.preventDefault(); document.getElementById(referenceId)?.scrollIntoView({ behavior: "smooth", block: "center" }); });
  return link;
}

function createEquationBlock(block) {
  const section = document.createElement("section"); section.className = "paper-equation"; section.id = block.id;
  const label = document.createElement("div"); label.className = "paper-visual-label"; label.textContent = block.label || "Equation";
  section.append(label);
  if (block.latex) {
    section.append(createMathCopyButton(block.latex, true));
    const formula = document.createElement("div"); formula.className = "display-equation"; formula.textContent = `\\[${block.latex}\\]`;
    section.append(formula);
    if (block.src) {
      const original = document.createElement("details"); original.className = "equation-original";
      const summary = document.createElement("summary"); summary.textContent = tp("originalEquation");
      const image = document.createElement("img"); image.className = "equation-source-crop"; image.src = SelfPageAPI.url(block.src); image.loading = "lazy"; image.alt = `${block.label || "Equation"}, original PDF rendering`;
      original.append(summary, image); section.append(original);
    }
  } else if (block.src) {
    const link = document.createElement("a"); link.href = SelfPageAPI.url(block.src); link.target = "_blank"; link.rel = "noreferrer"; link.className = "equation-source-link";
    const image = document.createElement("img"); image.className = "equation-source-crop"; image.src = link.href; image.loading = "lazy"; image.alt = `${block.label || "Equation"}, original PDF rendering`;
    link.append(image); section.append(link);
    if (block.sourceText) {
      const accessible = document.createElement("span"); accessible.className = "sr-only"; accessible.textContent = block.sourceText; section.append(accessible);
    }
  } else {
    const pending = document.createElement("p"); pending.className = "equation-pending"; pending.textContent = tp("formulaPending"); section.append(pending);
  }
  return section;
}

function markdownMathSource(source, display) {
  let latex = String(source || "").trim();
  const pairs = [["$$", "$$"], ["\\[", "\\]"], ["\\(", "\\)"], ["$", "$"]];
  for (const [opening, closing] of pairs) {
    if (latex.startsWith(opening) && latex.endsWith(closing)) {
      latex = latex.slice(opening.length, -closing.length).trim(); break;
    }
  }
  return display ? `$$\n${latex}\n$$` : `$${latex}$`;
}

function createMathCopyButton(latex, display) {
  const button = document.createElement("button"); button.type = "button"; button.className = `math-copy-button ${display ? "display-math-copy" : "inline-math-copy"}`;
  button.textContent = tp("copyFormula"); button.title = tp("copyFormula"); button.setAttribute("aria-label", tp("copyFormula"));
  button.addEventListener("click", async event => {
    event.preventDefault(); event.stopPropagation();
    await copyPlainText(markdownMathSource(latex, display));
    button.classList.add("copied"); button.textContent = "✓"; showToast(tp("formulaCopied"));
    window.setTimeout(() => { button.classList.remove("copied"); button.textContent = tp("copyFormula"); }, 1400);
  });
  return button;
}

async function copyPlainText(value) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); return; } catch (_) { /* use the local fallback */ }
  }
  const input = document.createElement("textarea"); input.value = value; input.setAttribute("readonly", ""); input.className = "clipboard-fallback";
  document.body.append(input); input.select(); document.execCommand("copy"); input.remove();
}

function updateCtrlHover(event) {
  document.body.classList.toggle("ctrl-held", Boolean(event.ctrlKey));
  const sentence = event.target.closest?.(".source-sentence");
  paperState.hoveredSentence = sentence || null;
  if (!event.ctrlKey || !sentence) {
    hideTranslationTooltip();
    return;
  }
}

function showTranslationTooltip(sentence) {
  if (!sentence?.isConnected || !paperEls.translationTooltip) return;
  if (paperEls.translationTooltip.sourceSentence !== sentence) {
    setMathText(paperEls.translationTooltip, sentence.translationText || tp("pending"));
    paperEls.translationTooltip.sourceSentence = sentence;
    queueMathTypeset(paperEls.translationTooltip);
  }
  const rect = sentence.getBoundingClientRect();
  const width = Math.min(430, window.innerWidth - 24);
  paperEls.translationTooltip.style.width = width + "px";
  paperEls.translationTooltip.style.left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.left)) + "px";
  const placeBelow = rect.top < 230;
  paperEls.translationTooltip.style.top = (placeBelow ? rect.bottom + 10 : Math.max(12, rect.top - Math.min(210, paperEls.translationTooltip.scrollHeight || 150) - 10)) + "px";
  paperEls.translationTooltip.classList.add("visible");
}

function hideTranslationTooltip() {
  paperEls.translationTooltip?.classList.remove("visible");
}

function createPaperVisual(image) {
  const figure = document.createElement("figure"); figure.className = `paper-figure paper-${image.type || "figure"} ${image.type === "table" ? "paper-table" : ""}`; figure.id = image.id;
  figure.style.setProperty("--figure-width", Math.max(0.56, image.widthRatio || 1) * 100 + "%");
  const label = document.createElement("div"); label.className = "paper-visual-label"; label.textContent = image.label || String(image.type || "Figure").replace(/^./, character => character.toUpperCase());
  const link = document.createElement("a"); link.href = SelfPageAPI.url(image.src); link.target = "_blank"; link.rel = "noreferrer";
  const visual = document.createElement("img"); visual.src = link.href; visual.loading = "lazy"; visual.alt = `${image.label || "Paper figure"} from page ${image.page}`;
  const caption = document.createElement("figcaption");
  const sourceCaption = document.createElement("span"); sourceCaption.className = "paper-caption-source";
  sourceCaption.textContent = image.caption || `${image.label || image.type || "Figure"} · PDF page ${image.page}`;
  caption.append(sourceCaption);
  if (image.translatedCaption) {
    const translatedCaption = document.createElement("span"); translatedCaption.className = "paper-caption-translation";
    translatedCaption.lang = paperState.paperIR?.language?.translation || "";
    translatedCaption.textContent = image.translatedCaption; caption.append(translatedCaption);
  }
  link.append(visual); figure.append(label, link, caption);
  if (/\/api\/paper-images\/\d+$/.test(image.src || "")) {
    const tools = document.createElement("div"); tools.className = "paper-crop-tools"; tools.setAttribute("aria-label", tp("cropExpand"));
    [["←", "left", "cropLeft"], ["↑", "top", "cropTop"], ["↔", "all", "cropAll"], ["↓", "bottom", "cropBottom"], ["→", "right", "cropRight"]].forEach(([symbol, direction, key]) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = symbol; button.title = tp(key); button.setAttribute("aria-label", tp(key));
      button.addEventListener("click", () => expandVisualCrop(image, visual, direction, button)); tools.append(button);
    });
    figure.append(tools);
  }
  return figure;
}

async function expandVisualCrop(asset, imageElement, direction, button) {
  const match = String(asset.src || "").match(/\/api\/paper-images\/(\d+)$/);
  if (!match) return;
  const step = 0.045;
  let left = Number(asset.leftRatio) || 0;
  let top = Number(asset.topRatio) || 0;
  let right = Math.min(1, left + (Number(asset.widthRatio) || 1));
  let bottom = Math.min(1, top + (Number(asset.heightRatio) || 1));
  if (direction === "left" || direction === "all") left = Math.max(0, left - step);
  if (direction === "right" || direction === "all") right = Math.min(1, right + step);
  if (direction === "top" || direction === "all") top = Math.max(0, top - step);
  if (direction === "bottom" || direction === "all") bottom = Math.min(1, bottom + step);
  button.disabled = true;
  try {
    const updated = await SelfPageAPI.request(`/api/paper-images/${match[1]}/crop`, { method: "PATCH", body: { leftRatio: left, topRatio: top, widthRatio: right - left, heightRatio: bottom - top } });
    Object.assign(asset, updated);
    imageElement.src = SelfPageAPI.url(asset.src) + `?crop=${Date.now()}`;
    showToast(tp("cropSaved"));
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
  }
}

function renderOutline() {
  if (!paperState.sections.length) { const empty = document.createElement("p"); empty.className = "paper-list-empty"; empty.textContent = tp("noOutline"); paperEls.outline.replaceChildren(empty); return; }
  paperEls.outline.replaceChildren(...paperState.sections.map(section => {
    const button = document.createElement("button"); button.type = "button"; button.className = "outline-item";
    const level = Math.max(1, Math.min(3, Number(section.level) || String(section.number).split(".").length));
    button.classList.add("outline-level-" + Math.min(level, 3));
    const number = document.createElement("span"); number.className = "outline-number"; number.textContent = section.number;
    const titles = document.createElement("span"); titles.className = "outline-titles";
    const title = document.createElement("span"); title.className = "outline-title-en"; title.textContent = section.title; titles.append(title);
    if (section.translatedTitle) { const translated = document.createElement("span"); translated.className = "outline-title-zh"; translated.textContent = section.translatedTitle; titles.append(translated); }
    button.append(number, titles);
    button.addEventListener("click", () => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    return button;
  }));
}

function setMathText(element, text) {
  const source = String(text || "");
  clearMathTypesetting(element);
  element.replaceChildren();
  const ranges = findMathRanges(source);
  if (!ranges.length) { element.textContent = source; return; }
  let cursor = 0;
  ranges.forEach(range => {
    if (range.start > cursor) element.append(document.createTextNode(source.slice(cursor, range.start)));
    const formula = document.createElement("span"); formula.className = "math-fragment";
    formula.textContent = "\\(" + mathToTex(source.slice(range.start, range.end)) + "\\)";
    element.append(formula);
    cursor = range.end;
  });
  if (cursor < source.length) element.append(document.createTextNode(source.slice(cursor)));
}

function findMathRanges(source) {
  const ranges = [];
  const add = (start, end) => {
    if (start < 0 || end <= start || ranges.some(item => start < item.end && end > item.start)) return;
    ranges.push({ start, end });
  };

  const explicit = /\\(?:mathbf|mathrm|mathit|hat|bar|theta|alpha|beta|gamma|sim|frac|sum|prod|mathcal|left|right|cdot|times|in|leq|geq|log)\b/g;
  for (const match of source.matchAll(explicit)) {
    let end = source.length;
    const remainder = source.slice(match.index);
    const boundary = remainder.search(/\s+(?=(?:where|which|we then|this equation)\b|首先|然后|我们|其中|式中|这里|这使)/i);
    if (boundary > 0) end = match.index + boundary;
    add(match.index, end);
    break;
  }

  for (const match of source.matchAll(/=/g)) {
    const before = source.slice(0, match.index);
    const lhs = before.match(/(?:[A-Za-zℓπτϵδθφ][A-Za-z0-9ℓπτϵδθφ′]*(?:\s*\([^)]{0,100}\))?(?:\s*[+−-]\s*[A-Za-z0-9ℓπτϵδθφ′]+)*)\s*$/);
    if (!lhs) continue;
    const start = before.lastIndexOf(lhs[0]);
    let cursor = match.index + 1;
    while (source[cursor] === " ") cursor += 1;
    const end = findFormulaEnd(source, cursor);
    add(start, end);
  }

  for (const match of source.matchAll(/∼/g)) {
    const before = source.slice(0, match.index);
    const lhs = before.match(/(?:[A-Za-zℓπτϵδθφ][A-Za-z0-9ℓπτϵδθφ′]*(?:\s*\([^)]{0,100}\))?(?:\s*[+−-]\s*[A-Za-z0-9ℓπτϵδθφ′]+)*)\s*$/);
    if (lhs) add(before.lastIndexOf(lhs[0]), findFormulaEnd(source, match.index + 1));
  }

  const functionPattern = /(?<![A-Za-z])(?:p|q|vθ|u)\s*\([^)]{1,100}\)/g;
  for (const match of source.matchAll(functionPattern)) add(match.index, match.index + match[0].length);
  const variablePattern = /(?:π\d+(?:\.\d+)?|D[rv]|Pθ|a[\u0302̂]t(?:\+\d+)?|[as]1(?:\.\.\.|…)T|[AIa]τt(?:\+[A-Z0-9τδ−]+|[′'])?|[AI][0-9in]t|(?<![A-Za-z])(?:A[tT]|o[tT]|q[tT]|s[tT]|aT|v[tT]τ?|Lτ)(?:\+[A-Z0-9δ−]+)?(?![A-Za-z])|(?<![A-Za-z])[τδθϵℓH](?![A-Za-z])|(?<![A-Za-z])l(?![A-Za-z]))/g;
  for (const match of source.matchAll(variablePattern)) add(match.index, match.index + match[0].length);
  return ranges.sort((a, b) => a.start - b.start);
}

function findFormulaEnd(source, start) {
  let round = 0; let square = 0; let curly = 0; let cursor = start;
  while (source[cursor] === " ") cursor += 1;
  const first = source[cursor];
  const expectedClose = { "[": "]", "{": "}" }[first];
  if (expectedClose) {
    let depth = 0;
    for (let index = cursor; index < source.length; index += 1) {
      if (source[index] === first) depth += 1;
      if (source[index] === expectedClose) {
        depth -= 1;
        if (depth === 0) return index + 1;
      }
    }
  }
  const numeric = source.slice(cursor).match(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)/);
  if (numeric) return cursor + numeric[0].length;
  for (; cursor < source.length; cursor += 1) {
    const char = source[cursor];
    if (char === "(") round += 1;
    else if (char === ")") round = Math.max(0, round - 1);
    else if (char === "[") square += 1;
    else if (char === "]") square = Math.max(0, square - 1);
    else if (char === "{") curly += 1;
    else if (char === "}") curly = Math.max(0, curly - 1);
    else if (round === 0 && square === 0 && curly === 0 && /[;；.。!?！？]/.test(char)) break;
    else if (round === 0 && square === 0 && curly === 0 && /[,，]/.test(char)
      && /^(?:\s*)(?:where|which|and|with|corresponds|denotes|其中|式中|这里|然后|随后|并且)/i.test(source.slice(cursor + 1))) break;
    else if (round === 0 && square === 0 && curly === 0 && /\s/.test(char)
      && /^(?:\s*)(?:where|which|corresponds|denotes|is visualized|表示|其中|式中|这里)/i.test(source.slice(cursor))) break;
  }
  return cursor;
}

function mathToTex(raw) {
  let value = raw.trim().replace(/(?<!\\)&/g, "\\&").replace(/(?<!\\)%/g, "\\%").replace(/(?<!\\)#/g, "\\#");
  if (/\\(?:mathbf|mathrm|mathit|hat|bar|theta|frac|sum|prod|mathcal)\b/.test(value)) return value;
  value = value
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\|\|(.+?)\|\|(\d*)/g, (_, body, subscript) => `\\lVert ${body} \\rVert${subscript ? `_{${subscript}}` : ""}`)
    .replace(/π(\d+(?:\.\d+)?)/g, (_, number) => `\\pi_{${number}}`)
    .replace(/a[\u0302̂]t(?:\+(\d+))?/g, (_, step) => `\\hat{a}_{t${step ? `+${step}` : ""}}`)
    .replace(/D([rv])/g, "D_{$1}")
    .replace(/Pθ/g, "P_{\\theta}")
    .replace(/\b([as])1(?:\.\.\.|…)T\b/g, "$1_{1:T}")
    .replace(/\b([AI])([0-9in])t\b/g, "$1_t^{$2}")
    .replace(/\b([AIa])τt([′']?)(?:\+([A-Z0-9τδ−]+))?/g, (_, name, prime, offset) => `${name}_{t${prime ? "'" : ""}${offset ? `+${offset}` : ""}}^{\\tau}`)
    .replace(/vtτ/g, "v_t^{\\tau}")
    .replace(/Lτ/g, "L^{\\tau}")
    .replace(/vθ/g, "v_{\\theta}")
    .replace(/ℓt/g, "\\ell_t")
    .replace(/\b([as])(\d+|[tT])(?:\+([A-Z0-9δ−]+))?\b/g, (_, name, subscript, step) => `${name}_{${subscript}${step ? `+${step}` : ""}}`)
    .replace(/\b([Aoqv])t(?:\+([A-Z0-9δ−]+))?\b/g, (_, name, offset) => `${name}_{t${offset ? `+${offset}` : ""}}`)
    .replace(/\bN\s*\(/g, "\\mathcal{N}(")
    .replace(/\bEp\(([^)]+)\)\s*,\s*q\(([^)]+)\)/g, "\\mathbb{E}_{p($1),q($2)}")
    .replace(/\bEp\s*\(/g, "\\mathbb{E}_{p}(")
    .replace(/\.\.\.|…/g, "\\ldots")
    .replace(/τ/g, "\\tau ")
    .replace(/δ/g, "\\delta ")
    .replace(/θ/g, "\\theta ")
    .replace(/ϵ/g, "\\epsilon ")
    .replace(/φ/g, "\\phi ")
    .replace(/ℓ/g, "\\ell ")
    .replace(/∼/g, "\\sim")
    .replace(/∈/g, "\\in")
    .replace(/→/g, "\\to")
    .replace(/×/g, "\\times")
    .replace(/·/g, "\\cdot")
    .replace(/−/g, "-")
    .replace(/\|/g, "\\mid ");
  return value;
}

let mathTypesetChain = Promise.resolve();

function clearMathTypesetting(element) {
  if (element && typeof window.MathJax?.typesetClear === "function") window.MathJax.typesetClear([element]);
}

function queueMathTypeset(element) {
  if (!element) return;
  if (typeof window.MathJax?.typesetPromise === "function") {
    mathTypesetChain = mathTypesetChain.then(async () => {
      if (window.MathJax.startup?.promise) await window.MathJax.startup.promise;
      await window.MathJax.typesetPromise([element]);
      element.querySelectorAll("mjx-merror").forEach(error => {
        console.error("MathJax formula error", error.textContent);
        const equation = error.closest(".paper-equation");
        const original = equation?.querySelector(".equation-original");
        if (equation) equation.classList.add("math-render-error");
        if (original) original.open = true;
      });
    }).catch(error => console.error("MathJax typesetting failed", error));
  } else if (window.MathJax?.Hub) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, element]);
  }
}

async function generateAiNote(method) {
  const paper = paperState.selectedPaper;
  if (!paper) return;
  try {
    const data = await apiJson(`/api/papers/${paper.id}/ai-notes`, { method: "POST", body: JSON.stringify({ method }) });
    paperState.aiNoteVersions.unshift(data.version);
    paperState.selectedAiNoteVersionId = data.version.id;
    paper.aiNotePending = true;
    renderSummary(); schedulePoll();
  } catch (error) {
    showToast(tp("summaryFailed") + ": " + error.message);
  }
}

function renderSummary() {
  const paper = paperState.selectedPaper;
  if (!paper) return;
  const previousEditor = paperEls.summaryContent.querySelector(".markdown-source-editor");
  const previousPreview = paperEls.summaryContent.querySelector(".note-paper-preview");
  const previousScroll = {
    editor: previousEditor?.scrollTop || 0,
    preview: previousPreview?.scrollTop || 0,
  };
  paperEls.guideNoteButton.disabled = !paper.unitCount;
  paperEls.threePassNoteButton.disabled = !paper.unitCount;
  paperEls.summaryContent.replaceChildren();
  paperEls.summaryContent.classList.remove("guide-note-mode");
  const versionNodes = paperState.aiNoteVersions.map(version => {
    const button = document.createElement("button"); button.type = "button"; button.className = "ai-note-version"; button.classList.toggle("active", version.id === paperState.selectedAiNoteVersionId);
    const title = document.createElement("strong"); title.textContent = tp("versionLabel", { version: version.versionNo });
    const method = document.createElement("span"); method.textContent = tp(version.method === "guide" ? "methodGuide" : "methodThreePass");
    const meta = document.createElement("small"); meta.textContent = formatNoteVersionMeta(version);
    button.append(title, method, meta); button.addEventListener("click", () => { paperState.selectedAiNoteVersionId = version.id; renderSummary(); });
    return button;
  });
  paperEls.aiNoteVersionList.replaceChildren(...versionNodes);
  if (!paperState.aiNoteVersions.length) {
    const empty = document.createElement("p"); empty.className = "paper-list-empty"; empty.textContent = tp("noAiNotes"); paperEls.aiNoteVersionList.replaceChildren(empty);
    paperEls.summaryStatus.hidden = true; return;
  }
  const version = paperState.aiNoteVersions.find(item => item.id === paperState.selectedAiNoteVersionId) || paperState.aiNoteVersions[0];
  if (version.id !== paperState.selectedAiNoteVersionId) paperState.selectedAiNoteVersionId = version.id;
  if (["queued", "generating"].includes(version.status)) { paperEls.summaryStatus.hidden = false; paperEls.summaryStatus.textContent = tp("summaryWaiting"); return; }
  if (version.status === "error") { paperEls.summaryStatus.hidden = false; paperEls.summaryStatus.textContent = tp("summaryFailed") + ": " + (version.error || ""); return; }
  paperEls.summaryStatus.hidden = true;
  if (!version.content) return;
  if (version.method === "guide") {
    paperEls.summaryContent.classList.add("guide-note-mode");
    paperEls.summaryContent.append(renderMarkdownWorkbench(version));
  } else {
    renderThreePassContent(version.content);
  }
  applyPersistentHighlights(); queueMathTypeset(paperEls.summaryContent);
  requestAnimationFrame(() => {
    const editor = paperEls.summaryContent.querySelector(".markdown-source-editor");
    const preview = paperEls.summaryContent.querySelector(".note-paper-preview");
    if (editor) editor.scrollTop = previousScroll.editor;
    if (preview) preview.scrollTop = previousScroll.preview;
  });
}

function renderThreePassContent(summary) {
  const nodes = [];
  nodes.push(summaryBlock(tp("summaryOne"), summary.oneSentence, "summary-one"));
  if (summary.paperType) nodes.push(summaryBlock(tp("summaryType"), summary.paperType));
  if (summary.researchQuestion) nodes.push(summaryBlock(tp("summaryResearch"), summary.researchQuestion));
  if (summary.context) nodes.push(summaryBlock(tp("summaryContext"), summary.context));
  nodes.push(summaryBlock(tp("summaryOverview"), summary.overview));
  [["summaryContributions", summary.contributions], ["summaryMethod", summary.method], ["summaryResults", summary.results], ["summaryAssumptions", summary.assumptions], ["summaryAudit", summary.experimentAudit], ["summaryReproduce", summary.reproductionChecklist], ["summaryLimitations", summary.limitations], ["summaryQuestions", summary.readingQuestions]].forEach(([label, items]) => {
    if (items?.length) nodes.push(summaryList(tp(label), items));
  });
  if (summary.terms?.length) {
    const section = document.createElement("section"); const heading = document.createElement("h4"); heading.textContent = tp("summaryTerms"); const list = document.createElement("dl");
    summary.terms.forEach(item => { const term = document.createElement("dt"); term.textContent = item.term; const explanation = document.createElement("dd"); setMathText(explanation, item.explanation); list.append(term, explanation); });
    section.append(heading, list); nodes.push(section);
  }
  paperEls.summaryContent.replaceChildren(...nodes);
}

function formatNoteVersionMeta(version) {
  const statusKey = { queued: "statusQueuedNote", generating: "statusGeneratingNote", error: "statusErrorNote" }[version.status];
  const date = new Date(version.createdAt).toLocaleString({ zh: "zh-CN", ja: "ja-JP", en: "en-US", ko: "ko-KR" }[paperState.language], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return statusKey ? `${tp(statusKey)} · ${date}` : date;
}

let notePreviewTimer;
const noteSaveTimers = new Map();

function noteWorkbenchText() {
  return {
    zh: { source: "Markdown 源文件", preview: "编译预览", syncHint: "双击任意一侧可跳转到另一侧的对应位置", images: "论文图片", insert: "点击图片插入 Markdown", save: "保存", saved: "已保存", saving: "正在保存…", saveError: "保存失败", print: "打印 / 导出 PDF", noImages: "这篇论文没有提取到图片。", page: "第 {page} 页" },
    ja: { source: "Markdown ソース", preview: "コンパイルプレビュー", syncHint: "どちらかをダブルクリックすると、反対側の対応箇所へ移動します", images: "論文画像", insert: "画像をクリックして Markdown に挿入", save: "保存", saved: "保存済み", saving: "保存中…", saveError: "保存失敗", print: "印刷 / PDF出力", noImages: "抽出された画像はありません。", page: "{page}ページ" },
    en: { source: "Markdown source", preview: "Compiled preview", syncHint: "Double-click either pane to jump to the matching location", images: "Paper images", insert: "Click an image to insert its Markdown", save: "Save", saved: "Saved", saving: "Saving…", saveError: "Save failed", print: "Print / export PDF", noImages: "No images were extracted from this paper.", page: "Page {page}" }
  }[paperState.language] || {};
}

function renderMarkdownWorkbench(version) {
  const labels = noteWorkbenchText();
  const workbench = document.createElement("div"); workbench.className = "markdown-workbench";
  const sourcePane = document.createElement("section"); sourcePane.className = "markdown-source-pane";
  const sourceHead = document.createElement("div"); sourceHead.className = "markdown-pane-head";
  const sourceTitle = document.createElement("strong"); sourceTitle.textContent = labels.source;
  const sourceActions = document.createElement("div"); sourceActions.className = "markdown-pane-actions";
  const saveState = document.createElement("span"); saveState.className = "markdown-save-state";
  const saveButton = document.createElement("button"); saveButton.type = "button"; saveButton.textContent = labels.save;
  sourceActions.append(saveState, saveButton); sourceHead.append(sourceTitle, sourceActions);
  const editor = document.createElement("textarea"); editor.className = "markdown-source-editor"; editor.spellcheck = false; editor.value = version.content.markdown || ""; editor.setAttribute("aria-label", labels.source);
  const imageLibrary = renderNoteImageLibrary(editor, labels);
  sourcePane.append(sourceHead, editor, imageLibrary);

  const previewPane = document.createElement("section"); previewPane.className = "markdown-preview-pane";
  const previewHead = document.createElement("div"); previewHead.className = "markdown-pane-head";
  const previewTitle = document.createElement("strong"); previewTitle.textContent = labels.preview;
  const printButton = document.createElement("button"); printButton.type = "button"; printButton.textContent = labels.print;
  previewHead.append(previewTitle, printButton);
  const preview = document.createElement("article"); preview.className = "note-paper-preview"; preview.setAttribute("aria-label", labels.preview);
  renderCompiledMarkdown(editor.value, preview);
  previewPane.append(previewHead, preview);
  workbench.append(sourcePane, previewPane);

  const save = async () => {
    const timer = noteSaveTimers.get(version.id); if (timer) clearTimeout(timer);
    noteSaveTimers.delete(version.id); saveState.textContent = labels.saving; saveButton.disabled = true;
    try {
      await apiJson(`/api/ai-notes/${version.id}/content`, { method: "POST", body: JSON.stringify({ markdown: editor.value }) });
      saveState.textContent = labels.saved;
    } catch (error) {
      saveState.textContent = `${labels.saveError}: ${error.message}`;
    } finally { saveButton.disabled = false; }
  };
  const scheduleSave = () => {
    const oldTimer = noteSaveTimers.get(version.id); if (oldTimer) clearTimeout(oldTimer);
    saveState.textContent = labels.saving;
    noteSaveTimers.set(version.id, setTimeout(save, 900));
  };
  editor.addEventListener("input", () => {
    version.content.markdown = editor.value;
    clearTimeout(notePreviewTimer);
    notePreviewTimer = setTimeout(() => renderCompiledMarkdown(editor.value, preview), 220);
    scheduleSave();
  });
  editor.addEventListener("blur", () => { if (noteSaveTimers.has(version.id)) save(); });
  saveButton.addEventListener("click", save);
  printButton.addEventListener("click", () => printNotePreview(preview));
  bindMarkdownBidirectionalSync(editor, preview);
  return workbench;
}

function renderNoteImageLibrary(editor, labels) {
  const details = document.createElement("details"); details.className = "note-image-library";
  const summary = document.createElement("summary"); summary.textContent = `${labels.images} · ${labels.insert}`; details.append(summary);
  if (!paperState.images.length) { const empty = document.createElement("p"); empty.textContent = labels.noImages; details.append(empty); return details; }
  const grid = document.createElement("div"); grid.className = "note-image-grid";
  paperState.images.forEach((image, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "note-image-choice";
    const visual = document.createElement("img"); visual.src = SelfPageAPI.url(image.src); visual.loading = "lazy"; visual.alt = image.caption || labels.page.replace("{page}", image.page);
    const caption = document.createElement("span"); caption.textContent = image.caption || `${labels.page.replace("{page}", image.page)} · ${index + 1}`;
    button.append(visual, caption);
    button.addEventListener("click", () => {
      const alt = (image.caption || `Figure ${index + 1}`).replace(/[\[\]]/g, "").slice(0, 180);
      const insertion = `\n\n![${alt}](${image.src})\n\n`;
      const start = editor.selectionStart; const end = editor.selectionEnd;
      editor.setRangeText(insertion, start, end, "end"); editor.dispatchEvent(new Event("input")); editor.focus();
    });
    grid.append(button);
  });
  details.append(grid); return details;
}

function renderCompiledMarkdown(markdown, preview) {
  preview.replaceChildren(compileMarkdownDocument(markdown));
  queueMathTypeset(preview);
}

function appendMarkdownSyncBlock(documentNode, node, startLine, endLine) {
  node.classList.add("markdown-sync-block");
  node.dataset.sourceStart = String(startLine);
  node.dataset.sourceEnd = String(Math.max(startLine, endLine));
  documentNode.append(node);
}

function compileMarkdownDocument(markdown) {
  const documentNode = document.createElement("div"); documentNode.className = "note-document";
  const lines = String(markdown).replace(/\r/g, "").split("\n");
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]; const trimmed = line.trim();
    if (!trimmed) { index += 1; continue; }
    if (trimmed.startsWith("```")) {
      const startLine = index;
      const codeLines = []; index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) { codeLines.push(lines[index]); index += 1; }
      index += index < lines.length ? 1 : 0;
      const pre = document.createElement("pre"); const code = document.createElement("code"); code.textContent = codeLines.join("\n"); pre.append(code); appendMarkdownSyncBlock(documentNode, pre, startLine, index - 1); continue;
    }
    if (trimmed.startsWith("$$") || trimmed === "\\[") {
      const startLine = index;
      const closing = trimmed.startsWith("$$") ? "$$" : "\\]"; const mathLines = [line];
      const closedInline = closing === "$$" && trimmed.length > 4 && trimmed.endsWith("$$");
      index += 1;
      if (!closedInline) while (index < lines.length) { mathLines.push(lines[index]); const done = lines[index].trim().endsWith(closing); index += 1; if (done) break; }
      const math = document.createElement("div"); math.className = "note-display-math"; math.textContent = mathLines.join("\n"); appendMarkdownSyncBlock(documentNode, math, startLine, index - 1); continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { const startLine = index; const node = document.createElement(`h${heading[1].length}`); appendMarkdownInline(node, heading[2]); index += 1; appendMarkdownSyncBlock(documentNode, node, startLine, startLine); continue; }
    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) { const startLine = index; index += 1; appendMarkdownSyncBlock(documentNode, document.createElement("hr"), startLine, startLine); continue; }
    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) { const startLine = index; index += 1; appendMarkdownSyncBlock(documentNode, createMarkdownFigure(image[1], image[2]), startLine, startLine); continue; }
    if (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const startLine = index;
      const tableLines = [line]; index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) { tableLines.push(lines[index]); index += 1; }
      appendMarkdownSyncBlock(documentNode, createMarkdownTable(tableLines), startLine, index - 1); continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/); const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      const startLine = index;
      const list = document.createElement(bullet ? "ul" : "ol");
      while (index < lines.length) {
        const match = lines[index].match(bullet ? /^\s*[-*+]\s+(.+)$/ : /^\s*\d+[.)]\s+(.+)$/); if (!match) break;
        const item = document.createElement("li"); appendMarkdownInline(item, match[1]); list.append(item); index += 1;
      }
      appendMarkdownSyncBlock(documentNode, list, startLine, index - 1); continue;
    }
    if (trimmed.startsWith(">")) {
      const startLine = index;
      const quote = document.createElement("blockquote"); const parts = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) { parts.push(lines[index].trim().replace(/^>\s?/, "")); index += 1; }
      appendMarkdownInline(quote, parts.join(" ")); appendMarkdownSyncBlock(documentNode, quote, startLine, index - 1); continue;
    }
    const startLine = index;
    const paragraphLines = [trimmed]; index += 1;
    while (index < lines.length && lines[index].trim() && !isMarkdownBlockStart(lines, index)) { paragraphLines.push(lines[index].trim()); index += 1; }
    const paragraph = document.createElement("p"); appendMarkdownInline(paragraph, paragraphLines.join(" ")); appendMarkdownSyncBlock(documentNode, paragraph, startLine, index - 1);
  }
  return documentNode;
}

function markdownLineAtOffset(markdown, offset) {
  return String(markdown).slice(0, Math.max(0, offset)).split("\n").length - 1;
}

function markdownOffsetAtLine(markdown, line) {
  const value = String(markdown); let offset = 0;
  for (let current = 0; current < line; current += 1) {
    const nextBreak = value.indexOf("\n", offset);
    if (nextBreak === -1) return value.length;
    offset = nextBreak + 1;
  }
  return offset;
}

function closestMarkdownPreviewBlock(preview, line) {
  const blocks = [...preview.querySelectorAll("[data-source-start]")];
  return blocks.find(block => line >= Number(block.dataset.sourceStart) && line <= Number(block.dataset.sourceEnd))
    || blocks.reduce((closest, block) => {
      const start = Number(block.dataset.sourceStart); const end = Number(block.dataset.sourceEnd);
      const distance = line < start ? start - line : line - end;
      return !closest || distance < closest.distance ? { block, distance } : closest;
    }, null)?.block;
}

function flashMarkdownSyncTarget(target) {
  target.classList.remove("markdown-sync-target");
  void target.offsetWidth;
  target.classList.add("markdown-sync-target");
  setTimeout(() => target.classList.remove("markdown-sync-target"), 1100);
}

function bindMarkdownBidirectionalSync(editor, preview) {
  editor.addEventListener("dblclick", () => {
    const line = markdownLineAtOffset(editor.value, editor.selectionStart);
    const target = closestMarkdownPreviewBlock(preview, line);
    if (!target) return;
    const previewRect = preview.getBoundingClientRect(); const targetRect = target.getBoundingClientRect();
    const targetTop = preview.scrollTop + targetRect.top - previewRect.top;
    preview.scrollTo({ top: Math.max(0, targetTop - (preview.clientHeight - targetRect.height) / 2), behavior: "smooth" });
    flashMarkdownSyncTarget(target);
  });
  preview.addEventListener("dblclick", event => {
    const target = event.target.closest("[data-source-start]");
    if (!target || !preview.contains(target)) return;
    event.preventDefault();
    const line = Number(target.dataset.sourceStart); const offset = markdownOffsetAtLine(editor.value, line);
    editor.focus({ preventScroll: true }); editor.setSelectionRange(offset, offset);
    const style = getComputedStyle(editor); const lineHeight = parseFloat(style.lineHeight) || 18;
    editor.scrollTo({ top: Math.max(0, line * lineHeight - editor.clientHeight / 2 + lineHeight), behavior: "smooth" });
    flashMarkdownSyncTarget(editor);
  });
}

function isMarkdownBlockStart(lines, index) {
  const line = lines[index]; const trimmed = line.trim();
  return /^(?:#{1,6}\s+|```|\$\$|\\\[|>|[-*+]\s+|\d+[.)]\s+|!\[)/.test(trimmed)
    || /^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)
    || (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1]));
}

function appendMarkdownInline(container, text) {
  const pattern = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\$[^$\n]+\$|\\\([^\n]*?\\\))/g;
  let cursor = 0;
  for (const match of String(text).matchAll(pattern)) {
    if (match.index > cursor) container.append(document.createTextNode(text.slice(cursor, match.index)));
    const token = match[0];
    if ((token.startsWith("**") && token.endsWith("**")) || (token.startsWith("__") && token.endsWith("__"))) {
      const strong = document.createElement("strong"); strong.textContent = token.slice(2, -2); container.append(strong);
    } else if (token.startsWith("`")) {
      const code = document.createElement("code"); code.textContent = token.slice(1, -1); container.append(code);
    } else if (token.startsWith("![")) {
      const image = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/); if (image) container.append(createMarkdownImage(image[1], image[2]));
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/); const anchor = document.createElement("a"); anchor.textContent = link[1]; anchor.href = safeMarkdownLink(link[2]); anchor.target = "_blank"; anchor.rel = "noreferrer"; container.append(anchor);
    } else container.append(document.createTextNode(token));
    cursor = match.index + token.length;
  }
  if (cursor < text.length) container.append(document.createTextNode(text.slice(cursor)));
}

function safeMarkdownLink(value) {
  try { const url = new URL(value, location.origin); return ["http:", "https:"].includes(url.protocol) ? url.href : "#"; } catch { return "#"; }
}

function createMarkdownImage(alt, source) {
  const image = document.createElement("img"); image.alt = alt;
  image.src = /^\/api\/paper-images\/\d+$/.test(source) ? source : ""; return image;
}

function createMarkdownFigure(alt, source) {
  const figure = document.createElement("figure"); const image = createMarkdownImage(alt, source); figure.append(image);
  if (alt) { const caption = document.createElement("figcaption"); caption.textContent = alt; figure.append(caption); }
  return figure;
}

function splitMarkdownTableRow(line) { return line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim()); }
function createMarkdownTable(lines) {
  const table = document.createElement("table"); const head = document.createElement("thead"); const headRow = document.createElement("tr");
  splitMarkdownTableRow(lines[0]).forEach(value => { const cell = document.createElement("th"); appendMarkdownInline(cell, value); headRow.append(cell); }); head.append(headRow); table.append(head);
  const body = document.createElement("tbody"); lines.slice(1).forEach(line => { const row = document.createElement("tr"); splitMarkdownTableRow(line).forEach(value => { const cell = document.createElement("td"); appendMarkdownInline(cell, value); row.append(cell); }); body.append(row); }); table.append(body); return table;
}

function printNotePreview(preview) {
  document.body.classList.add("note-preview-print"); preview.classList.add("print-target");
  const cleanup = () => { document.body.classList.remove("note-preview-print"); preview.classList.remove("print-target"); };
  window.addEventListener("afterprint", cleanup, { once: true }); window.print(); setTimeout(cleanup, 1500);
}

function summaryBlock(title, text, className = "") { const section = document.createElement("section"); section.className = className; const heading = document.createElement("h4"); heading.textContent = title; const body = document.createElement("p"); setMathText(body, text || ""); section.append(heading, body); return section; }
function summaryList(title, items) { const section = document.createElement("section"); const heading = document.createElement("h4"); heading.textContent = title; const list = document.createElement("ul"); items.forEach(item => { const li = document.createElement("li"); setMathText(li, item); list.append(li); }); section.append(heading, list); return section; }

function captureSelection(event) {
  if (event.target.closest(".translation-tooltip, .selection-tools")) return;
  const selection = window.getSelection(); const quote = selection?.toString().trim();
  if (!quote || quote.length < 2 || !paperState.selectedPaper) { paperEls.selectionTools.hidden = true; return; }
  const range = selection.getRangeAt(0);
  if (!paperEls.readerContent.contains(range.commonAncestorContainer)) return;
  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
  const sourceView = container.closest("#moduleAssist") ? "assist" : "reading";
  const contextElement = container.closest(".reading-unit, .summary-content section") || container;
  paperState.selection = { quote: quote.slice(0, 5000), context: (contextElement.textContent || "").slice(0, 12000), sourceView, range: range.cloneRange() };
  const rect = range.getBoundingClientRect();
  paperEls.selectionTools.style.left = `${Math.min(window.innerWidth - 160, Math.max(8, rect.left + rect.width / 2 - 65))}px`;
  paperEls.selectionTools.style.top = `${Math.max(8, rect.top - 45)}px`;
  paperEls.selectionTools.hidden = false;
}

function openQuestionDialog() {
  if (!paperState.selection) return;
  paperEls.selectionTools.hidden = true; paperEls.questionQuote.textContent = paperState.selection.quote; paperEls.questionInput.value = "";
  paperEls.questionDialog.showModal(); setTimeout(() => paperEls.questionInput.focus(), 50);
}

async function submitSelectionQuestion() {
  const question = paperEls.questionInput.value.trim(); const selected = paperState.selection;
  if (!question || !selected || !paperState.selectedPaper) return;
  paperEls.submitQuestion.disabled = true;
  try {
    await apiJson(`/api/papers/${paperState.selectedPaper.id}/annotations`, { method: "POST", body: JSON.stringify({ ...selected, range: undefined, question }) });
    paperEls.questionDialog.close(); await loadAnnotations(); showToast("已高亮，AI 正在回答");
  } catch (error) { showToast(error.message); }
  paperEls.submitQuestion.disabled = false;
}

async function saveSelectionToNotes() {
  const selected = paperState.selection; if (!selected || !paperState.selectedPaper) return;
  paperEls.selectionTools.hidden = true;
  await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`, { method: "POST", body: JSON.stringify({ quote: selected.quote, context: selected.context, sourceView: selected.sourceView }) });
  const data = await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`); paperState.snippets = data.snippets; renderNotes(); showToast(tp("savedToNotes"));
}

function renderAnnotations() {
  if (!paperEls.annotationList) return;
  if (!paperState.annotations.length) { const empty = document.createElement("p"); empty.className = "paper-list-empty"; empty.textContent = tp("noQuestions"); paperEls.annotationList.replaceChildren(empty); applyPersistentHighlights(); return; }
  paperEls.annotationList.replaceChildren(...paperState.annotations.map(item => {
    const card = document.createElement("article"); card.className = "annotation-card";
    const quote = document.createElement("blockquote"); quote.textContent = item.quote;
    const question = document.createElement("h4"); question.textContent = item.question;
    const answer = document.createElement("p"); answer.textContent = item.status === "ready" ? item.answer.answer : item.status === "error" ? item.error : "AI 回答中…";
    const remove = miniDelete(async () => { await apiJson(`/api/annotations/${item.id}`, { method: "DELETE" }); await loadAnnotations(); });
    card.append(quote, question, answer, remove);
    if (item.status === "ready") card.addEventListener("click", event => { if (!event.target.closest(".delete-mini")) openAnswer(item); });
    return card;
  }));
  applyPersistentHighlights();
}

function applyPersistentHighlights() {
  document.querySelectorAll("mark.paper-highlight").forEach(mark => mark.replaceWith(document.createTextNode(mark.textContent)));
  paperState.annotations.filter(item => item.status === "ready").forEach(item => {
    const root = item.source_view === "assist" ? paperEls.summaryContent : paperEls.reader;
    highlightFirstText(root, item.quote, item);
  });
}

function highlightFirstText(root, quote, annotation) {
  if (!root || !quote) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) {
    return node.parentElement.closest(".translation-tooltip, .MathJax, script, mark") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  }});
  while (walker.nextNode()) {
    const node = walker.currentNode; const index = node.data.indexOf(quote);
    if (index < 0) continue;
    const range = document.createRange(); range.setStart(node, index); range.setEnd(node, index + quote.length);
    const mark = document.createElement("mark"); mark.className = "paper-highlight"; mark.dataset.annotationId = annotation.id;
    range.surroundContents(mark); mark.addEventListener("click", () => openAnswer(annotation)); return;
  }
}

function openAnswer(item) {
  paperState.activeAnswer = item;
  paperEls.answerQuote.textContent = item.quote; paperEls.answerQuestion.textContent = item.question;
  const answer = item.answer || {}; paperEls.answerBody.replaceChildren();
  paperEls.answerBody.append(compileMarkdownDocument(answer.answer || ""));
  if (answer.evidence?.length) paperEls.answerBody.append(summaryList("依据", answer.evidence));
  if (answer.uncertainty) paperEls.answerBody.append(summaryBlock("不确定性", answer.uncertainty));
  paperEls.answerDialog.showModal();
}

function askFromAnswer() {
  const item = paperState.activeAnswer;
  const answer = item?.answer?.answer?.trim();
  if (!item || !answer) return;
  paperState.selection = {
    quote: answer.slice(0, 5000),
    context: `原文摘录：${item.quote}\n\n原问题：${item.question}\n\nAI回答：${answer}`.slice(0, 12000),
    sourceView: "assist",
  };
  paperEls.answerDialog.close();
  openQuestionDialog();
}

async function saveAnswerToNotes() {
  const item = paperState.activeAnswer;
  const answer = item?.answer?.answer?.trim();
  if (!item || !answer || !paperState.selectedPaper) return;
  const quote = `问题：${item.question}\n\n回答：${answer}`.slice(0, 10000);
  await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`, { method: "POST", body: JSON.stringify({ quote, context: item.quote, sourceView: "assist" }) });
  paperState.snippets = (await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`)).snippets;
  paperEls.answerDialog.close();
  renderNotes();
  showToast(tp("savedToNotes"));
}

function renderNotes() {
  const paper = paperState.selectedPaper; if (!paper) return;
  if (!paperState.snippets.length) { const empty = document.createElement("p"); empty.className = "paper-list-empty"; empty.textContent = tp("noSnippets"); paperEls.snippetList.replaceChildren(empty); }
  else paperEls.snippetList.replaceChildren(...paperState.snippets.map(item => {
    const card = document.createElement("article"); card.className = "snippet-card editable-snippet";
    const editor = document.createElement("textarea"); editor.rows = 4; editor.value = item.quote;
    const save = document.createElement("button"); save.className = "snippet-save"; save.type = "button"; save.textContent = tp("saveSnippet");
    save.addEventListener("click", async () => { await apiJson(`/api/snippets/${item.id}/update`, { method: "POST", body: JSON.stringify({ quote: editor.value }) }); item.quote = editor.value; showToast(tp("saved")); });
    card.append(editor, save, miniDelete(async () => { await apiJson(`/api/snippets/${item.id}`, { method: "DELETE" }); paperState.snippets = (await apiJson(`/api/papers/${paper.id}/snippets`)).snippets; renderNotes(); })); return card;
  }));
}

async function addManualSnippet(event) {
  event.preventDefault(); const quote = paperEls.manualSnippetInput.value.trim();
  if (!quote || !paperState.selectedPaper) return;
  await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`, { method: "POST", body: JSON.stringify({ quote, context: "", sourceView: "manual" }) });
  paperEls.manualSnippetInput.value = ""; paperState.snippets = (await apiJson(`/api/papers/${paperState.selectedPaper.id}/snippets`)).snippets; renderNotes();
}

function miniDelete(handler) { const button = document.createElement("button"); button.className = "delete-mini"; button.type = "button"; button.textContent = "×"; button.addEventListener("click", event => { event.stopPropagation(); handler(); }); return button; }

async function retrySelectedPaper() { if (!paperState.selectedPaper) return; try { await apiJson("/api/papers/" + paperState.selectedPaper.id + "/retry", { method: "POST" }); showToast(tp("retrySent")); await refreshPaperLibrary(); } catch (error) { showToast(error.message); } }

async function deletePaper(paper) { if (!window.confirm(tp("deleteConfirm"))) return; try { await apiJson("/api/papers/" + paper.id, { method: "DELETE" }); if (paperState.selectedId === paper.id) { paperState.selectedId = null; paperState.paperIR = null; } await refreshPaperLibrary(); } catch (error) { showToast(error.message); } }

function formatBytes(bytes) { if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"; return (bytes / 1024 / 1024).toFixed(1) + " MB"; }
async function apiJson(url, options = {}) {
  const requestOptions = { ...options };
  if (typeof requestOptions.body === "string") {
    try { requestOptions.body = JSON.parse(requestOptions.body); } catch (_) { /* keep a malformed body for the API client to report */ }
  }
  return SelfPageAPI.request(url, requestOptions);
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
let paperToastTimer;
function showToast(message) { clearTimeout(paperToastTimer); paperEls.toast.textContent = message; paperEls.toast.classList.add("show"); paperToastTimer = setTimeout(() => paperEls.toast.classList.remove("show"), 2200); }
