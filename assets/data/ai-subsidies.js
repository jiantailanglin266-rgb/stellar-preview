/* =========================================================
   STELLAR | AI導入に活用できる補助金・助成金 データ
   ---------------------------------------------------------
   ● 更新方法
     - この配列を編集するだけで一覧・診断・目的別カードに反映されます。
     - 制度が終了しても削除せず status を "closed" に変更してください。
     - 金額・補助率・締切は制度／枠／年度で変動するため、原則
       「公式公募要領をご確認ください」とし、確認できた場合のみ記載。
     - 数値を追記する際は必ず公式一次情報を確認し lastVerifiedAt を更新。
   ● status: "open"|"upcoming"|"closed"|"ongoing"|"unknown"
   ● category: "tool"|"development"|"training"|"new-business"
               |"marketing"|"automation"|"regional"|"employment"
   ● 最終確認（制度の存在・公式URL）: 2026-07-24
     ※補助率・上限額・受付期間は未確定/変動のため各公式サイトで要確認
   ========================================================= */
window.AI_SUBSIDIES = [
  {
    id: "digital-ai-2026",
    name: "デジタル化・AI導入補助金2026",
    formerName: "旧：IT導入補助金",
    category: ["tool", "automation"],
    systemType: "補助金",
    organization: "中小企業庁／中小企業基盤整備機構",
    summary: "中小企業・小規模事業者の労働生産性向上に向けて、AIを含むITツール（ソフトウェア・クラウドサービス等）の導入を支援する制度です。2025年度補正予算事業より「IT導入補助金」から名称が変更されました。",
    aiUseCases: [
      "業務用AIツール・クラウドサービス",
      "顧客管理（CRM）・営業支援（SFA）",
      "会計・受発注・在庫管理ツール",
      "AIチャットボット・業務効率化ソフトウェア",
      "セキュリティ対策・導入時の設定支援"
    ],
    eligibleApplicants: ["中小企業", "小規模事業者", "個人事業主"],
    eligibleExpenses: ["登録されたITツールの導入費用", "クラウド利用料（一定期間）", "導入関連費・付随サービス"],
    subsidyRate: "公式公募要領をご確認ください",
    maximumAmount: "公式公募要領をご確認ください",
    status: "unknown",
    applicationStart: "公式サイトでご確認ください",
    applicationDeadline: "公式サイトでご確認ください（複数回の公募が行われる場合があります）",
    officialUrl: "https://it-shien.smrj.go.jp/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "すべてのAIツールが対象になるわけではなく、事務局に登録されたITツールや申請枠等の条件があります。",
      "「IT導入補助金」で検索される方向けの旧名称です。最新の枠・要件は公式公募要領をご確認ください。"
    ]
  },
  {
    id: "monodukuri",
    name: "ものづくり・商業・サービス生産性向上促進補助金",
    formerName: "通称：ものづくり補助金",
    category: ["development", "automation"],
    systemType: "補助金",
    organization: "中小企業庁／全国中小企業団体中央会",
    summary: "生産性向上に資する革新的な新製品・新サービス開発や生産プロセスの改善に必要な設備投資等を支援する制度です。AIを活用したシステム開発や自動化の取り組みでの活用が考えられます。",
    aiUseCases: [
      "AIを活用した新製品・新サービス開発",
      "AI画像解析・需要予測システム",
      "検品・品質管理の自動化",
      "製造工程の高度化",
      "設備とAIソフトウェアを組み合わせた生産性向上"
    ],
    eligibleApplicants: ["中小企業", "小規模事業者", "特定事業者"],
    eligibleExpenses: ["機械装置・システム構築費", "その他公募要領に定める経費"],
    subsidyRate: "公式公募要領をご確認ください",
    maximumAmount: "公式公募要領をご確認ください",
    status: "unknown",
    applicationStart: "公式サイトでご確認ください",
    applicationDeadline: "公式サイトでご確認ください（公募回次ごとに設定）",
    officialUrl: "https://portal.monodukuri-hojo.jp/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "単なる既存ツールの導入ではなく、革新的な取り組み・設備投資が前提となる枠があります。",
      "電子申請にGビズIDプライムが必要です。取得に時間がかかる場合があるため早めにご準備ください。"
    ]
  },
  {
    id: "shinjigyou-shinshutsu",
    name: "中小企業新事業進出補助金",
    formerName: "通称：新事業進出補助金",
    category: ["new-business", "development"],
    systemType: "補助金",
    organization: "中小企業庁／中小企業基盤整備機構",
    summary: "既存事業と異なる新市場・高付加価値事業への進出を後押しする制度です。AIを活用した新規事業やデジタルサービスの立ち上げでの活用が考えられます。",
    aiUseCases: [
      "AIを活用した新規事業の立ち上げ",
      "既存事業と異なるAIサービスの開発",
      "新市場向けのデジタルサービス",
      "新事業に必要なシステム・設備"
    ],
    eligibleApplicants: ["中小企業", "特定事業者"],
    eligibleExpenses: ["建物費・機械装置費・システム構築費等（公募要領による）"],
    subsidyRate: "公式公募要領をご確認ください",
    maximumAmount: "公式公募要領をご確認ください",
    status: "unknown",
    applicationStart: "公式サイトでご確認ください",
    applicationDeadline: "公式サイトでご確認ください（公募回次ごとに設定）",
    officialUrl: "https://shinjigyou-shinshutsu.smrj.go.jp/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "既存業務へのツール導入ではなく、『新事業進出』であることが要件です。",
      "事業計画の内容が審査されます。対象要件は公募要領をご確認ください。"
    ]
  },
  {
    id: "jizokuka",
    name: "小規模事業者持続化補助金",
    formerName: "通称：持続化補助金",
    category: ["marketing", "tool"],
    systemType: "補助金",
    organization: "中小企業庁（商工会議所・商工会）",
    summary: "小規模事業者が経営計画に基づいて行う販路開拓等の取り組みを支援する制度です。AIサービスの販路開拓や広報での活用が考えられます。",
    aiUseCases: [
      "AIサービスの販路開拓・広報",
      "新サービスを紹介するWebサイト・LP制作",
      "顧客獲得を目的とした販促物",
      "業務効率化に関連する一部の取り組み"
    ],
    eligibleApplicants: ["小規模事業者", "個人事業主"],
    eligibleExpenses: ["広報費・ウェブサイト関連費・機械装置等費 等（公募要領による）"],
    subsidyRate: "公式公募要領をご確認ください",
    maximumAmount: "公式公募要領をご確認ください",
    status: "unknown",
    applicationStart: "公式サイトでご確認ください",
    applicationDeadline: "公式サイトでご確認ください（公募回次ごとに設定）",
    officialUrl: "https://www.chusho.meti.go.jp/keiei/shokibo/jizoku/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "ウェブサイト関連費のみの申請が認められない場合や、補助額に上限が設けられている場合があります。",
      "単なるホームページ制作やツール購入が必ず対象になるわけではありません。公募要領をご確認ください。",
      "商工会議所地区・商工会地区で申請窓口が異なります。"
    ]
  },
  {
    id: "shoryokuka",
    name: "中小企業省力化投資補助金",
    formerName: "一般型／カタログ注文型",
    category: ["automation", "tool"],
    systemType: "補助金",
    organization: "中小企業庁／中小企業基盤整備機構",
    summary: "人手不足に悩む中小企業の省力化・自動化に資する設備やシステムの導入を支援する制度です。AI搭載設備や業務プロセスの自動化での活用が考えられます。",
    aiUseCases: [
      "省人化・自動化システム",
      "AI搭載設備",
      "業務プロセスの自動化",
      "人手不足の解消につながるシステム"
    ],
    eligibleApplicants: ["中小企業", "小規模事業者", "個人事業主"],
    eligibleExpenses: ["対象設備・システムの導入費用（型・枠による）"],
    subsidyRate: "公式公募要領をご確認ください",
    maximumAmount: "公式公募要領をご確認ください",
    status: "unknown",
    applicationStart: "公式サイトでご確認ください",
    applicationDeadline: "公式サイトでご確認ください（カタログ注文型は随時受付の場合あり）",
    officialUrl: "https://shoryokuka.smrj.go.jp/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "『カタログ注文型』と『一般型』で対象・手続きが異なります。",
      "対象製品・設備・導入計画に条件があります。最新の制度構成は公式サイトをご確認ください。"
    ]
  },
  {
    id: "jinzai-kaihatsu",
    name: "人材開発支援助成金",
    formerName: "人への投資促進コース／事業展開等リスキリング支援コース 等",
    category: ["training"],
    systemType: "助成金",
    organization: "厚生労働省（都道府県労働局・ハローワーク）",
    summary: "事業主が雇用する労働者に対して、職務に関連した知識・技能の習得のための訓練を計画に沿って実施した場合に、訓練経費や訓練期間中の賃金の一部を助成する制度です。生成AI・DX研修での活用が考えられます。",
    aiUseCases: [
      "生成AI研修・AIリテラシー研修",
      "プロンプト研修・DX人材育成",
      "データ分析・プログラミング研修",
      "AIを活用した業務改善研修"
    ],
    eligibleApplicants: ["労働者を雇用する事業主"],
    eligibleExpenses: ["訓練経費の一部", "訓練期間中の賃金の一部（コースによる）"],
    subsidyRate: "公式資料をご確認ください",
    maximumAmount: "公式資料をご確認ください",
    status: "unknown",
    applicationStart: "研修計画の事前提出が必要な場合があります（公式資料でご確認ください）",
    applicationDeadline: "公式サイトでご確認ください",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1_00011.html",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "研修開始後では申請できない場合があります。受講契約・研修開始前に必ず要件をご確認ください。",
      "対象訓練・訓練時間・対象労働者・助成内容はコースごとに異なります。"
    ]
  },
  {
    id: "career-up",
    name: "キャリアアップ助成金",
    formerName: "正社員化コース 等（雇用に関する関連制度）",
    category: ["employment", "training"],
    systemType: "助成金",
    organization: "厚生労働省（都道府県労働局・ハローワーク）",
    summary: "有期雇用労働者・短時間労働者・派遣労働者といった非正規雇用労働者の企業内でのキャリアアップ（正社員化・処遇改善等）を実施した事業主を支援する制度です。AI導入費用を直接補助する制度ではありません。",
    aiUseCases: [
      "※AI導入費用そのものの補助ではありません",
      "従業員の正社員化・処遇改善に関する制度"
    ],
    eligibleApplicants: ["非正規雇用労働者を雇用する事業主"],
    eligibleExpenses: ["正社員化・処遇改善の取り組みに対する助成（AI導入費は対象外）"],
    subsidyRate: "公式資料をご確認ください",
    maximumAmount: "公式資料をご確認ください",
    status: "unknown",
    applicationStart: "各コースの実施前に『キャリアアップ計画』の提出が必要です（公式資料でご確認ください）",
    applicationDeadline: "公式サイトでご確認ください",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "AI導入そのものではなく、従業員の雇用・処遇改善に関する制度です。",
      "『AI導入費用を補助する制度』ではないため、雇用に関する関連制度として掲載しています。"
    ]
  },
  {
    id: "local-dx",
    name: "各都道府県・市区町村のDX／デジタル化・人材育成支援",
    formerName: "例：東京都「DX推進トータルサポート事業」（東京都中小企業振興公社）ほか",
    category: ["regional", "tool", "training"],
    systemType: "その他",
    organization: "各都道府県・市区町村・産業振興機関・商工会議所等",
    summary: "自治体が独自に実施するDX・デジタル化・設備投資・人材育成の支援制度です。所在地によって制度の有無・内容が大きく異なります。お住まい・事業所所在地の自治体の公式情報をご確認ください。",
    aiUseCases: [
      "自治体独自のAI・DX導入支援",
      "デジタル化・設備投資支援",
      "自治体独自の研修助成",
      "商工会議所・産業振興機関の支援"
    ],
    eligibleApplicants: ["各制度の対象要件による"],
    eligibleExpenses: ["各制度の対象経費による"],
    subsidyRate: "各自治体の公式情報をご確認ください",
    maximumAmount: "各自治体の公式情報をご確認ください",
    status: "unknown",
    applicationStart: "各自治体の公式情報をご確認ください",
    applicationDeadline: "各自治体の公式情報をご確認ください",
    officialUrl: "https://www.jgrants-portal.go.jp/",
    sourceType: "official",
    lastVerifiedAt: "2026-07-24",
    notes: [
      "地域・年度によって利用できる制度が異なります。",
      "特定自治体の制度を検討する際は、現在募集中かを必ず各自治体の公式サイトでご確認ください。",
      "国・自治体の補助金はJグランツで検索・電子申請できる場合があります。"
    ]
  }
];

/* 申請・検索に役立つ公的リンク（一次情報） */
window.AI_SUBSIDY_RESOURCES = [
  { name: "Jグランツ（補助金の検索・電子申請）", org: "デジタル庁", url: "https://www.jgrants-portal.go.jp/" },
  { name: "GビズID（電子申請用の共通ID）", org: "デジタル庁", url: "https://gbiz-id.go.jp/" },
  { name: "中小企業庁 補助金公募情報", org: "中小企業庁", url: "https://www.chusho.meti.go.jp/koukai/hojyokin/kobo.html" },
  { name: "ミラサポplus（中小企業向け支援情報）", org: "中小企業庁", url: "https://mirasapo-plus.go.jp/" },
  { name: "雇用関係助成金（人材開発・キャリアアップ等）", org: "厚生労働省", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/index.html" }
];
