"use strict";

const FEATURE_LANGUAGE_KEY = "selfPage.language.v1";
const featureTranslations = {
  zh: {
    pageTitle: "功能展示 · PaperReadingDesk", skip: "跳到正文", navHome: "首页", navFeatures: "功能展示", navPapers: "论文阅读", mustRead: "第一次使用必看", title: "从 PDF 到可复用的论文笔记", lead: "按真实使用顺序查看 PaperReadingDesk：先配置本机 Codex，再导入论文，完成图片与公式保留、翻译、双语阅读、AI 阅读笔记和摘录。", openLibrary: "开始阅读论文", startTour: "开始功能导览", realScreens: "张实机截图", realScreensDesc: "以下内容均来自项目当前界面，并按完整工作流排列。", walkthroughLabel: "REAL WORKFLOW", walkthroughTitle: "按顺序认识完整功能", clickHint: "点击任意截图可以查看原始大图。", footer: "本地优先的论文阅读工作台",
    index1: "配置", index2: "导入", index3: "阅读", index4: "图片", index5: "公式", index6: "AI 辅助", index7: "笔记", index8: "插图", index9: "编排", index10: "三遍阅读", index11: "摘录",
    eyebrow1: "LOCAL CODEX", heading1: "连接你自己的本机 Codex", desc1: "在主页保存 Codex 命令、模型和推理强度，并直接检查登录方式、CLI 版本与测试返回。当前 AI 功能仅支持 Codex，配置成功后才会启用。",
    eyebrow2: "IMPORT & LIBRARY", heading2: "批量导入并整理论文库", desc2: "拖入一个或多个 PDF，统一选择自动分析、单栏或双栏版式。论文可放入自建文件夹，并显示阅读状态、文件大小、翻译耗时和 token 使用量。",
    eyebrow3: "BILINGUAL READING", heading3: "目录、翻译与双语阅读", desc3: "自动恢复论文标题、摘要和章节目录，提供双语、仅英文、仅译文三种阅读模式。",
    eyebrow4: "FIGURES & TABLES", heading4: "图片、表格与双语图注", desc4: "将论文中的图片和表格放回相应正文位置，同时保留原图注和译文。若复杂版式导致边界不理想，可用方向按钮手动扩展裁剪范围。",
    eyebrow5: "EQUATIONS", heading5: "可复制公式与原 PDF 对照", desc5: "可靠转写的公式以清晰的 LaTeX 重新排版，并可一键复制源码；原 PDF 公式始终可以展开核对，避免只看转写结果而丢失依据。",
    eyebrow6: "AI ASSISTED READING", heading6: "AI 阅读笔记、高亮与提问", desc6: "AI 辅助阅读提供“笔记指南”和“三遍阅读法”两种生成方法，每次生成都会保留新版本。阅读正文时也可以选择片段，围绕原文向 Codex 提问。",
    eyebrow7: "EDITABLE NOTES", heading7: "版本化 Markdown 笔记", desc7: "生成结果不是一次性文本：左侧可直接编辑 Markdown，右侧同步查看排版预览。修改可以保存，也可以打印或导出为 PDF。",
    eyebrow8: "INSERT PAPER VISUALS", heading8: "点击论文图片插入笔记", desc8: "笔记编辑器列出当前论文提取出的图片与表格。点击缩略图即可把带图注的 Markdown 图片引用插入笔记，无需手工寻找图片地址。",
    eyebrow9: "VISUAL NOTE COMPOSITION", heading9: "图文一起组织研究笔记", desc9: "在 Markdown 源文中组织论点、公式和插图，同时通过预览确认最终阅读效果，让论文中的视觉证据真正进入笔记，而不是与文字分离。",
    eyebrow10: "THREE-PASS METHOD", heading10: "用三遍阅读法拆解论文", desc10: "三遍阅读法会从一句话结论、论文类型、研究问题与背景开始，继续检查方法、证据、实验可信度和复现线索，适合系统理解与审查论文。", citation10: "方法来源：S. Keshav，《How to Read a Paper》，ACM SIGCOMM CCR 37(3)，2007",
    eyebrow11: "PAPER CLIPPINGS", heading11: "独立保存论文摘录", desc11: "把值得保留的原文、回答或手写内容保存到当前论文。摘录只负责记录与编辑，不会自动生成 AI 阅读笔记，也不会与其他论文混在一起。",
    alt1: "本机 Codex 配置界面", alt2: "PDF 导入与论文库界面", alt3: "论文目录与双语阅读界面", alt4: "论文图片与图注展示界面", alt5: "论文公式转写与原 PDF 公式对照界面", alt6: "AI 阅读笔记与高亮提问界面", alt7: "AI 阅读笔记 Markdown 编辑与预览界面", alt8: "从论文图片库插入 Markdown 笔记界面", alt9: "图文混排的论文笔记预览界面", alt10: "三遍阅读法生成的结构化论文笔记", alt11: "当前论文的摘录保存界面",
    finalLabel: "READY TO READ", finalTitle: "现在，把一篇论文拖进来", finalDesc: "所有 PDF、译文、笔记、问答和摘录都保存在本机项目的 data/ 目录中。"
  },
  ja: {
    pageTitle: "機能紹介 · PaperReadingDesk", skip: "本文へ移動", navHome: "ホーム", navFeatures: "機能紹介", navPapers: "論文を読む", mustRead: "初めて使う前に必読", title: "PDFから再利用できる論文ノートへ", lead: "実際の利用順に PaperReadingDesk を紹介します。ローカル Codex の設定、論文の読み込み、図・数式、翻訳、対訳、AI読解ノート、抜粋までを確認できます。", openLibrary: "論文を読み始める", startTour: "機能ツアーを開始", realScreens: "枚の実画面", realScreensDesc: "現在のプロジェクト画面を、完全なワークフロー順に掲載しています。", walkthroughLabel: "REAL WORKFLOW", walkthroughTitle: "全機能を順番に見る", clickHint: "画像をクリックすると原寸で表示できます。", footer: "ローカルファーストの論文読解ワークスペース",
    index1: "設定", index2: "読込", index3: "読解", index4: "図", index5: "数式", index6: "AI支援", index7: "ノート", index8: "図の挿入", index9: "編集", index10: "三段階", index11: "抜粋",
    eyebrow1: "LOCAL CODEX", heading1: "自分のローカル Codex を接続", desc1: "ホームで Codex コマンド、モデル、推論強度を保存し、認証方法、CLI バージョン、テスト結果を確認します。現在 AI 機能が対応するのは Codex のみです。",
    eyebrow2: "IMPORT & LIBRARY", heading2: "PDFをまとめて読み込み、整理", desc2: "複数のPDFを追加し、自動判定・1段組・2段組を一括指定できます。フォルダー整理に加え、状態、容量、翻訳時間、token 使用量も表示します。",
    eyebrow3: "BILINGUAL READING", heading3: "目次、翻訳、対訳読解", desc3: "タイトル、要旨、章構成を復元し、対訳・英語のみ・翻訳のみを切り替えられます。",
    eyebrow4: "FIGURES & TABLES", heading4: "図表と対訳キャプション", desc4: "図と表を本文の対応位置に戻し、原文と翻訳キャプションを保持します。複雑なレイアウトでは方向ボタンで切り抜き範囲を広げられます。",
    eyebrow5: "EQUATIONS", heading5: "コピー可能な数式と原PDFの照合", desc5: "信頼できる数式はLaTeXで再表示し、ソースをコピーできます。原PDFの数式も常に展開して照合できます。",
    eyebrow6: "AI ASSISTED READING", heading6: "AI読解ノート、ハイライト、質問", desc6: "「ノートガイド」と「三段階読解法」の2方式でノートを生成し、毎回新しい版を保存します。本文を選択してCodexへ質問することもできます。",
    eyebrow7: "EDITABLE NOTES", heading7: "版管理されたMarkdownノート", desc7: "左でMarkdownを編集し、右で組版プレビューを確認できます。変更を保存し、印刷またはPDFとして書き出せます。",
    eyebrow8: "INSERT PAPER VISUALS", heading8: "論文画像をクリックしてノートへ挿入", desc8: "抽出済みの図表一覧から、キャプション付きMarkdown画像参照をワンクリックで挿入できます。",
    eyebrow9: "VISUAL NOTE COMPOSITION", heading9: "文章と図を一緒に構成", desc9: "主張、数式、図をMarkdown内で整理し、プレビューで完成形を確認できます。視覚的な証拠もノートの一部になります。",
    eyebrow10: "THREE-PASS METHOD", heading10: "三段階読解法で論文を分解", desc10: "一文要約、論文タイプ、研究課題、背景から始め、手法、証拠、実験の妥当性、再現手がかりまで体系的に確認します。", citation10: "出典：S. Keshav, “How to Read a Paper,” ACM SIGCOMM CCR 37(3), 2007",
    eyebrow11: "PAPER CLIPPINGS", heading11: "論文ごとに抜粋を保存", desc11: "原文、回答、手入力メモを現在の論文に保存します。抜粋は記録と編集だけを行い、AI読解ノートを自動生成しません。",
    alt1: "ローカルCodex設定画面", alt2: "PDF読込とライブラリ画面", alt3: "目次と対訳読解画面", alt4: "図とキャプション画面", alt5: "数式転写と原PDF照合画面", alt6: "AI読解ノートと質問画面", alt7: "Markdown編集とプレビュー画面", alt8: "論文画像をMarkdownへ挿入する画面", alt9: "図入り論文ノートのプレビュー", alt10: "三段階読解法の構造化ノート", alt11: "論文抜粋の保存画面",
    finalLabel: "READY TO READ", finalTitle: "論文を1本追加してみましょう", finalDesc: "PDF、翻訳、ノート、質問、抜粋はすべてプロジェクトの data/ にローカル保存されます。"
  },
  en: {
    pageTitle: "Feature tour · PaperReadingDesk", skip: "Skip to content", navHome: "Home", navFeatures: "Feature tour", navPapers: "Paper reading", mustRead: "Start here before first use", title: "From PDF to reusable research notes", lead: "Follow PaperReadingDesk in real usage order: configure local Codex, import papers, preserve figures and equations, translate, read bilingually, create AI reading notes, and save clippings.", openLibrary: "Start reading papers", startTour: "Start feature tour", realScreens: "real screenshots", realScreensDesc: "Every image comes from the current project and follows the complete workflow.", walkthroughLabel: "REAL WORKFLOW", walkthroughTitle: "See every feature in order", clickHint: "Click any screenshot to open the full-size image.", footer: "Local-first paper reading workspace",
    index1: "Setup", index2: "Import", index3: "Read", index4: "Figures", index5: "Equations", index6: "AI assist", index7: "Notes", index8: "Insert", index9: "Compose", index10: "Three-pass", index11: "Clippings",
    eyebrow1: "LOCAL CODEX", heading1: "Connect your own local Codex", desc1: "Save the Codex command, model, and reasoning effort on the home page, then verify authentication, CLI version, and the test response. AI features currently support Codex only.",
    eyebrow2: "IMPORT & LIBRARY", heading2: "Import in batches and organize a library", desc2: "Drop one or more PDFs and apply auto, single-column, or double-column layout handling to the batch. Organize papers in folders and see status, file size, translation time, and token usage.",
    eyebrow3: "BILINGUAL READING", heading3: "Outline, translation, and bilingual reading", desc3: "Recover the title, abstract, and section outline, then switch between bilingual, English-only, and translation-only modes.",
    eyebrow4: "FIGURES & TABLES", heading4: "Figures, tables, and bilingual captions", desc4: "Place figures and tables back beside the relevant text while retaining source and translated captions. Direction controls can expand imperfect crops from complex layouts.",
    eyebrow5: "EQUATIONS", heading5: "Copyable equations with PDF evidence", desc5: "Reliable transcriptions are rendered as clean LaTeX with one-click source copying. The original PDF equation remains available for comparison.",
    eyebrow6: "AI ASSISTED READING", heading6: "AI reading notes, highlights, and questions", desc6: "Generate notes with either the notes guide or three-pass method; each run becomes a new version. Select source passages to ask Codex focused questions while reading.",
    eyebrow7: "EDITABLE NOTES", heading7: "Versioned Markdown notes", desc7: "Edit Markdown on the left and inspect the formatted preview on the right. Save changes, print the result, or export it as PDF.",
    eyebrow8: "INSERT PAPER VISUALS", heading8: "Click paper visuals into a note", desc8: "The editor lists extracted figures and tables. Click a thumbnail to insert a captioned Markdown image reference without finding URLs manually.",
    eyebrow9: "VISUAL NOTE COMPOSITION", heading9: "Compose research notes with text and visuals", desc9: "Organize claims, equations, and figures in Markdown while previewing the finished reading experience, so visual evidence stays part of the note.",
    eyebrow10: "THREE-PASS METHOD", heading10: "Break down a paper with the three-pass method", desc10: "Start with a one-sentence result, paper type, research question, and context, then inspect method, evidence, experimental validity, and reproduction clues.", citation10: "Source: S. Keshav, “How to Read a Paper,” ACM SIGCOMM CCR 37(3), 2007",
    eyebrow11: "PAPER CLIPPINGS", heading11: "Save clippings independently", desc11: "Keep source text, answers, or manual material with the current paper. Clippings are for saving and editing only; they do not automatically generate AI reading notes.",
    alt1: "Local Codex configuration", alt2: "PDF import and paper library", alt3: "Paper outline and bilingual reader", alt4: "Paper figure and caption display", alt5: "Equation transcription and original PDF comparison", alt6: "AI reading notes and highlighted questions", alt7: "Markdown note editor and preview", alt8: "Insert paper images into Markdown notes", alt9: "Research note preview with figures", alt10: "Structured notes generated with the three-pass method", alt11: "Clippings saved for the current paper",
    finalLabel: "READY TO READ", finalTitle: "Now drop in a paper", finalDesc: "PDFs, translations, notes, questions, and clippings are stored locally in the project's data/ directory."
  },
  ko: {
    pageTitle: "기능 둘러보기 · PaperReadingDesk", skip: "본문으로 이동", navHome: "홈", navFeatures: "기능 둘러보기", navPapers: "논문 읽기", mustRead: "처음 사용하기 전 필독", title: "PDF에서 재사용 가능한 논문 노트까지", lead: "실제 사용 순서로 PaperReadingDesk를 살펴보세요. 로컬 Codex 설정, 논문 가져오기, 이미지와 수식 보존, 번역, 대조 읽기, AI 읽기 노트와 스크랩을 소개합니다.", openLibrary: "논문 읽기 시작", startTour: "기능 안내 시작", realScreens: "장의 실제 화면", realScreensDesc: "현재 프로젝트의 실제 화면을 전체 작업 흐름 순서로 배치했습니다.", walkthroughLabel: "REAL WORKFLOW", walkthroughTitle: "모든 기능을 순서대로 보기", clickHint: "스크린샷을 클릭하면 원본 크기로 볼 수 있습니다.", footer: "로컬 우선 논문 읽기 작업 공간",
    index1: "설정", index2: "가져오기", index3: "읽기", index4: "이미지", index5: "수식", index6: "AI 보조", index7: "노트", index8: "삽입", index9: "편집", index10: "3단계", index11: "스크랩",
    eyebrow1: "LOCAL CODEX", heading1: "자신의 로컬 Codex 연결", desc1: "홈에서 Codex 명령, 모델, 추론 강도를 저장하고 인증 방식, CLI 버전, 테스트 응답을 확인합니다. 현재 AI 기능은 Codex만 지원합니다.",
    eyebrow2: "IMPORT & LIBRARY", heading2: "일괄 가져오기와 논문 라이브러리 정리", desc2: "여러 PDF를 놓고 자동 분석, 단일 열, 두 열 방식을 한 번에 선택합니다. 폴더로 정리하고 상태, 크기, 번역 시간, token 사용량을 확인할 수 있습니다.",
    eyebrow3: "BILINGUAL READING", heading3: "목차, 번역, 대조 읽기", desc3: "제목, 초록, 장 목차를 복원하고 대조 보기, 영어만, 번역만 모드를 제공합니다.",
    eyebrow4: "FIGURES & TABLES", heading4: "이미지·표와 이중 언어 캡션", desc4: "이미지와 표를 관련 본문 위치에 배치하고 원문과 번역 캡션을 유지합니다. 복잡한 레이아웃의 잘림은 방향 버튼으로 확장할 수 있습니다.",
    eyebrow5: "EQUATIONS", heading5: "복사 가능한 수식과 원본 PDF 대조", desc5: "신뢰할 수 있는 수식은 LaTeX로 다시 표시하고 소스를 복사할 수 있습니다. 원본 PDF 수식도 항상 펼쳐 비교할 수 있습니다.",
    eyebrow6: "AI ASSISTED READING", heading6: "AI 읽기 노트, 하이라이트, 질문", desc6: "노트 가이드와 3단계 읽기법 두 방식으로 생성하며 매번 새 버전을 보존합니다. 본문을 선택해 Codex에 질문할 수도 있습니다.",
    eyebrow7: "EDITABLE NOTES", heading7: "버전별 Markdown 노트", desc7: "왼쪽에서 Markdown을 편집하고 오른쪽에서 미리보기를 확인합니다. 저장, 인쇄, PDF 내보내기를 지원합니다.",
    eyebrow8: "INSERT PAPER VISUALS", heading8: "논문 이미지를 클릭해 노트에 삽입", desc8: "추출된 이미지와 표에서 썸네일을 클릭하면 캡션이 포함된 Markdown 이미지 참조가 바로 삽입됩니다.",
    eyebrow9: "VISUAL NOTE COMPOSITION", heading9: "글과 이미지를 함께 구성", desc9: "Markdown에 주장, 수식, 이미지를 구성하고 완성된 결과를 미리보며 시각적 근거를 노트 안에 유지합니다.",
    eyebrow10: "THREE-PASS METHOD", heading10: "3단계 읽기법으로 논문 분석", desc10: "한 문장 결론, 논문 유형, 연구 질문과 배경에서 시작해 방법, 근거, 실험 타당성, 재현 단서를 체계적으로 확인합니다.", citation10: "출처: S. Keshav, “How to Read a Paper,” ACM SIGCOMM CCR 37(3), 2007",
    eyebrow11: "PAPER CLIPPINGS", heading11: "논문별 스크랩 저장", desc11: "원문, 답변, 직접 입력한 내용을 현재 논문에 저장합니다. 스크랩은 기록과 편집만 하며 AI 읽기 노트를 자동 생성하지 않습니다.",
    alt1: "로컬 Codex 설정 화면", alt2: "PDF 가져오기와 논문 라이브러리", alt3: "논문 목차와 대조 읽기", alt4: "논문 이미지와 캡션", alt5: "수식 변환과 원본 PDF 비교", alt6: "AI 읽기 노트와 질문", alt7: "Markdown 편집과 미리보기", alt8: "논문 이미지를 Markdown에 삽입", alt9: "이미지가 포함된 논문 노트", alt10: "3단계 읽기법 구조화 노트", alt11: "현재 논문의 스크랩 저장 화면",
    finalLabel: "READY TO READ", finalTitle: "이제 논문 한 편을 추가하세요", finalDesc: "PDF, 번역문, 노트, 질문, 스크랩은 프로젝트의 data/ 디렉터리에 로컬로 저장됩니다."
  }
};

function initialFeatureLanguage() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (featureTranslations[requested]) return requested;
  const saved = localStorage.getItem(FEATURE_LANGUAGE_KEY);
  return featureTranslations[saved] ? saved : "zh";
}

function setFeatureLanguage(language) {
  const selected = featureTranslations[language] ? language : "zh";
  const t = key => featureTranslations[selected][key] || featureTranslations.zh[key] || key;
  localStorage.setItem(FEATURE_LANGUAGE_KEY, selected);
  document.documentElement.lang = {zh: "zh-CN", ja: "ja", en: "en", ko: "ko"}[selected];
  document.title = t("pageTitle");
  document.querySelectorAll("[data-feature-i18n]").forEach(element => {
    element.textContent = t(element.dataset.featureI18n);
  });
  document.querySelectorAll("[data-feature-i18n-alt]").forEach(element => {
    element.alt = t(element.dataset.featureI18nAlt);
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    const active = button.dataset.lang === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelectorAll("[data-lang]").forEach(button => {
  button.addEventListener("click", () => setFeatureLanguage(button.dataset.lang));
});
setFeatureLanguage(initialFeatureLanguage());
