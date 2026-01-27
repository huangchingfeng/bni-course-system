// BNI 新北市西B區 - 多語系翻譯檔案
// Multilingual Translation System

export type Locale = "zh-TW" | "en" | "ja" | "ko" | "la"

// ============================================================
// 繁體中文 (Traditional Chinese)
// ============================================================
const zhTW = {
  // Brand
  brand: {
    name: "BNI 新北市西B區",
    tagline: "卓越源於連結",
    region: "新北市西B區 華字輩",
  },

  // Navigation
  nav: {
    home: "首頁",
    courses: "課程總覽",
    myCourses: "我的課程",
    admin: "管理後台",
    login: "登入",
    logout: "登出",
    profile: "個人資料",
  },

  // Home Page
  home: {
    hero: {
      title: "專業培訓，卓越成長",
      subtitle: "探索 BNI 新北市西B區的精選培訓課程，與頂尖商業夥伴共同成長",
      cta: "瀏覽課程",
      secondaryCta: "了解更多",
    },
    stats: {
      courses: "場培訓課程",
      members: "位活躍會員",
      chapters: "個分會",
      referrals: "年度引薦數",
    },
    featured: {
      title: "精選課程",
      subtitle: "為您推薦最適合的培訓課程",
      viewAll: "查看全部",
    },
  },

  // Courses
  courses: {
    title: "課程總覽",
    subtitle: "探索所有培訓課程，提升您的商業技能",
    search: "搜尋課程...",
    filter: {
      all: "全部課程",
      type: "課程類型",
      date: "日期",
      status: "狀態",
    },
    card: {
      register: "立即報名",
      registered: "已報名",
      full: "已額滿",
      closed: "已截止",
      online: "線上課程",
      offline: "實體課程",
      seats: "剩餘名額",
      unlimited: "名額不限",
    },
    detail: {
      about: "課程介紹",
      schedule: "時間安排",
      location: "上課地點",
      instructor: "講師資訊",
      requirements: "報名須知",
    },
    empty: "目前沒有符合條件的課程",
    loading: "載入中...",
  },

  // Course Types
  courseTypes: {
    MSP: "成功會員培訓",
    "1ON1": "1對1工作坊",
    REFERRAL: "引薦工作坊",
    PT: "PT工作坊",
    PRESENTATION: "簡報工作坊",
    CHAPTER: "組聚培訓",
    LTNA: "LTnA 八大會議",
    LEADERSHIP: "領導團隊培訓",
    DNA: "DnA 實體聚會",
  },

  // Registration
  registration: {
    title: "課程報名",
    confirm: "確認報名",
    cancel: "取消報名",
    success: "報名成功！",
    cancelled: "已取消報名",
    error: "報名失敗，請稍後再試",
    alreadyRegistered: "您已報名此課程",
    loginRequired: "請先登入以報名課程",
  },

  // My Courses
  myCourses: {
    title: "我的課程",
    subtitle: "管理您的報名紀錄",
    upcoming: "即將參加",
    past: "歷史課程",
    empty: "您尚未報名任何課程",
    status: {
      registered: "已報名",
      cancelled: "已取消",
      attended: "已出席",
      noShow: "未出席",
    },
  },

  // Admin
  admin: {
    dashboard: {
      title: "管理儀表板",
      welcome: "歡迎回來",
      overview: "總覽",
      recentRegistrations: "最近報名",
      courseStats: "課程統計",
    },
    courses: {
      title: "課程管理",
      add: "新增課程",
      edit: "編輯課程",
      delete: "刪除課程",
      registrations: "報名名單",
    },
    members: {
      title: "會員管理",
      add: "新增會員",
      edit: "編輯會員",
      list: "會員列表",
    },
    chapters: {
      title: "分會管理",
      list: "分會列表",
    },
    stats: {
      title: "統計報表",
      participation: "參與率統計",
      export: "匯出報表",
    },
  },

  // Auth
  auth: {
    login: {
      title: "歡迎回來",
      subtitle: "登入您的帳號以繼續",
      email: "電子郵件",
      password: "密碼",
      submit: "登入",
      withLine: "使用 LINE 登入",
      noAccount: "還沒有帳號？",
      register: "立即註冊",
    },
    logout: {
      title: "登出",
      confirm: "確定要登出嗎？",
    },
  },

  // Common
  common: {
    loading: "載入中...",
    error: "發生錯誤",
    retry: "重試",
    save: "儲存",
    cancel: "取消",
    delete: "刪除",
    edit: "編輯",
    view: "查看",
    back: "返回",
    next: "下一步",
    previous: "上一步",
    submit: "提交",
    search: "搜尋",
    filter: "篩選",
    sort: "排序",
    all: "全部",
    none: "無",
    yes: "是",
    no: "否",
    date: "日期",
    time: "時間",
    location: "地點",
    status: "狀態",
    actions: "操作",
  },

  // Footer
  footer: {
    about: "關於我們",
    contact: "聯絡我們",
    privacy: "隱私政策",
    terms: "服務條款",
    copyright: "© 2026 BNI 新北市西B區. All rights reserved.",
  },
}

// ============================================================
// English
// ============================================================
const en = {
  // Brand
  brand: {
    name: "BNI Xinbei West B",
    tagline: "Excellence Through Connection",
    region: "Xinbei City West B District",
  },

  // Navigation
  nav: {
    home: "Home",
    courses: "Courses",
    myCourses: "My Courses",
    admin: "Admin",
    login: "Sign In",
    logout: "Sign Out",
    profile: "Profile",
  },

  // Home Page
  home: {
    hero: {
      title: "Professional Training, Exceptional Growth",
      subtitle: "Discover premium training courses at BNI Xinbei West B and grow alongside top business partners",
      cta: "Browse Courses",
      secondaryCta: "Learn More",
    },
    stats: {
      courses: "Training Sessions",
      members: "Active Members",
      chapters: "Chapters",
      referrals: "Annual Referrals",
    },
    featured: {
      title: "Featured Courses",
      subtitle: "Recommended training programs for you",
      viewAll: "View All",
    },
  },

  // Courses
  courses: {
    title: "All Courses",
    subtitle: "Explore all training courses and enhance your business skills",
    search: "Search courses...",
    filter: {
      all: "All Courses",
      type: "Course Type",
      date: "Date",
      status: "Status",
    },
    card: {
      register: "Register Now",
      registered: "Registered",
      full: "Full",
      closed: "Closed",
      online: "Online",
      offline: "In-Person",
      seats: "Seats Left",
      unlimited: "Unlimited",
    },
    detail: {
      about: "About This Course",
      schedule: "Schedule",
      location: "Location",
      instructor: "Instructor",
      requirements: "Requirements",
    },
    empty: "No courses match your criteria",
    loading: "Loading...",
  },

  // Course Types
  courseTypes: {
    MSP: "Member Success Program",
    "1ON1": "One-on-One Workshop",
    REFERRAL: "Referral Workshop",
    PT: "Power Team Workshop",
    PRESENTATION: "Presentation Workshop",
    CHAPTER: "Chapter Training",
    LTNA: "LTnA Meeting",
    LEADERSHIP: "Leadership Training",
    DNA: "DnA Gathering",
  },

  // Registration
  registration: {
    title: "Course Registration",
    confirm: "Confirm Registration",
    cancel: "Cancel Registration",
    success: "Successfully Registered!",
    cancelled: "Registration Cancelled",
    error: "Registration failed. Please try again.",
    alreadyRegistered: "You are already registered for this course",
    loginRequired: "Please sign in to register for courses",
  },

  // My Courses
  myCourses: {
    title: "My Courses",
    subtitle: "Manage your registrations",
    upcoming: "Upcoming",
    past: "Past Courses",
    empty: "You haven't registered for any courses yet",
    status: {
      registered: "Registered",
      cancelled: "Cancelled",
      attended: "Attended",
      noShow: "No Show",
    },
  },

  // Admin
  admin: {
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome Back",
      overview: "Overview",
      recentRegistrations: "Recent Registrations",
      courseStats: "Course Statistics",
    },
    courses: {
      title: "Course Management",
      add: "Add Course",
      edit: "Edit Course",
      delete: "Delete Course",
      registrations: "Registrations",
    },
    members: {
      title: "Member Management",
      add: "Add Member",
      edit: "Edit Member",
      list: "Member List",
    },
    chapters: {
      title: "Chapter Management",
      list: "Chapter List",
    },
    stats: {
      title: "Statistics",
      participation: "Participation Rate",
      export: "Export Report",
    },
  },

  // Auth
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your account to continue",
      email: "Email",
      password: "Password",
      submit: "Sign In",
      withLine: "Sign in with LINE",
      noAccount: "Don't have an account?",
      register: "Register Now",
    },
    logout: {
      title: "Sign Out",
      confirm: "Are you sure you want to sign out?",
    },
  },

  // Common
  common: {
    loading: "Loading...",
    error: "An error occurred",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    all: "All",
    none: "None",
    yes: "Yes",
    no: "No",
    date: "Date",
    time: "Time",
    location: "Location",
    status: "Status",
    actions: "Actions",
  },

  // Footer
  footer: {
    about: "About Us",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "© 2026 BNI Xinbei West B. All rights reserved.",
  },
}

// ============================================================
// 日本語 (Japanese)
// ============================================================
const ja = {
  // Brand
  brand: {
    name: "BNI 新北市西Bエリア",
    tagline: "つながりから卓越へ",
    region: "新北市西Bエリア",
  },

  // Navigation
  nav: {
    home: "ホーム",
    courses: "コース一覧",
    myCourses: "マイコース",
    admin: "管理画面",
    login: "ログイン",
    logout: "ログアウト",
    profile: "プロフィール",
  },

  // Home Page
  home: {
    hero: {
      title: "プロフェッショナルトレーニング、卓越した成長",
      subtitle: "BNI新北市西Bエリアの厳選されたトレーニングコースで、トップビジネスパートナーと共に成長しましょう",
      cta: "コースを見る",
      secondaryCta: "詳しく見る",
    },
    stats: {
      courses: "トレーニングセッション",
      members: "アクティブメンバー",
      chapters: "チャプター",
      referrals: "年間リファーラル数",
    },
    featured: {
      title: "おすすめコース",
      subtitle: "あなたにぴったりのトレーニングプログラム",
      viewAll: "すべて見る",
    },
  },

  // Courses
  courses: {
    title: "コース一覧",
    subtitle: "すべてのトレーニングコースを探索し、ビジネススキルを向上させましょう",
    search: "コースを検索...",
    filter: {
      all: "すべてのコース",
      type: "コースタイプ",
      date: "日付",
      status: "ステータス",
    },
    card: {
      register: "今すぐ登録",
      registered: "登録済み",
      full: "満席",
      closed: "締切",
      online: "オンライン",
      offline: "対面",
      seats: "残席",
      unlimited: "制限なし",
    },
    detail: {
      about: "コース概要",
      schedule: "スケジュール",
      location: "場所",
      instructor: "講師",
      requirements: "参加条件",
    },
    empty: "条件に一致するコースがありません",
    loading: "読み込み中...",
  },

  // Course Types
  courseTypes: {
    MSP: "メンバーサクセスプログラム",
    "1ON1": "1対1ワークショップ",
    REFERRAL: "リファーラルワークショップ",
    PT: "パワーチームワークショップ",
    PRESENTATION: "プレゼンテーションワークショップ",
    CHAPTER: "チャプタートレーニング",
    LTNA: "LTnAミーティング",
    LEADERSHIP: "リーダーシップトレーニング",
    DNA: "DnAミーティング",
  },

  // Registration
  registration: {
    title: "コース登録",
    confirm: "登録を確認",
    cancel: "登録をキャンセル",
    success: "登録完了しました！",
    cancelled: "登録がキャンセルされました",
    error: "登録に失敗しました。もう一度お試しください。",
    alreadyRegistered: "このコースには既に登録されています",
    loginRequired: "コースに登録するにはログインしてください",
  },

  // My Courses
  myCourses: {
    title: "マイコース",
    subtitle: "登録を管理する",
    upcoming: "今後のコース",
    past: "過去のコース",
    empty: "まだコースに登録していません",
    status: {
      registered: "登録済み",
      cancelled: "キャンセル",
      attended: "出席",
      noShow: "欠席",
    },
  },

  // Admin
  admin: {
    dashboard: {
      title: "ダッシュボード",
      welcome: "おかえりなさい",
      overview: "概要",
      recentRegistrations: "最近の登録",
      courseStats: "コース統計",
    },
    courses: {
      title: "コース管理",
      add: "コースを追加",
      edit: "コースを編集",
      delete: "コースを削除",
      registrations: "登録者一覧",
    },
    members: {
      title: "メンバー管理",
      add: "メンバーを追加",
      edit: "メンバーを編集",
      list: "メンバー一覧",
    },
    chapters: {
      title: "チャプター管理",
      list: "チャプター一覧",
    },
    stats: {
      title: "統計",
      participation: "参加率",
      export: "レポートをエクスポート",
    },
  },

  // Auth
  auth: {
    login: {
      title: "おかえりなさい",
      subtitle: "アカウントにログインして続行",
      email: "メールアドレス",
      password: "パスワード",
      submit: "ログイン",
      withLine: "LINEでログイン",
      noAccount: "アカウントをお持ちでないですか？",
      register: "今すぐ登録",
    },
    logout: {
      title: "ログアウト",
      confirm: "ログアウトしてもよろしいですか？",
    },
  },

  // Common
  common: {
    loading: "読み込み中...",
    error: "エラーが発生しました",
    retry: "再試行",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    view: "表示",
    back: "戻る",
    next: "次へ",
    previous: "前へ",
    submit: "送信",
    search: "検索",
    filter: "フィルター",
    sort: "並び替え",
    all: "すべて",
    none: "なし",
    yes: "はい",
    no: "いいえ",
    date: "日付",
    time: "時間",
    location: "場所",
    status: "ステータス",
    actions: "アクション",
  },

  // Footer
  footer: {
    about: "私たちについて",
    contact: "お問い合わせ",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    copyright: "© 2026 BNI 新北市西Bエリア. All rights reserved.",
  },
}

// ============================================================
// 한국어 (Korean)
// ============================================================
const ko = {
  // Brand
  brand: {
    name: "BNI 신베이 서B구",
    tagline: "연결에서 탁월함으로",
    region: "신베이시 서B구",
  },

  // Navigation
  nav: {
    home: "홈",
    courses: "코스",
    myCourses: "내 코스",
    admin: "관리자",
    login: "로그인",
    logout: "로그아웃",
    profile: "프로필",
  },

  // Home Page
  home: {
    hero: {
      title: "전문 교육, 탁월한 성장",
      subtitle: "BNI 신베이 서B구의 프리미엄 교육 과정을 발견하고 최고의 비즈니스 파트너와 함께 성장하세요",
      cta: "코스 보기",
      secondaryCta: "더 알아보기",
    },
    stats: {
      courses: "교육 세션",
      members: "활성 회원",
      chapters: "챕터",
      referrals: "연간 추천 수",
    },
    featured: {
      title: "추천 코스",
      subtitle: "당신을 위한 추천 교육 프로그램",
      viewAll: "전체 보기",
    },
  },

  // Courses
  courses: {
    title: "모든 코스",
    subtitle: "모든 교육 과정을 탐색하고 비즈니스 스킬을 향상시키세요",
    search: "코스 검색...",
    filter: {
      all: "모든 코스",
      type: "코스 유형",
      date: "날짜",
      status: "상태",
    },
    card: {
      register: "지금 등록",
      registered: "등록됨",
      full: "마감",
      closed: "종료",
      online: "온라인",
      offline: "오프라인",
      seats: "남은 자리",
      unlimited: "무제한",
    },
    detail: {
      about: "코스 소개",
      schedule: "일정",
      location: "장소",
      instructor: "강사",
      requirements: "요구 사항",
    },
    empty: "조건에 맞는 코스가 없습니다",
    loading: "로딩 중...",
  },

  // Course Types
  courseTypes: {
    MSP: "회원 성공 프로그램",
    "1ON1": "1:1 워크샵",
    REFERRAL: "추천 워크샵",
    PT: "파워 팀 워크샵",
    PRESENTATION: "프레젠테이션 워크샵",
    CHAPTER: "챕터 교육",
    LTNA: "LTnA 미팅",
    LEADERSHIP: "리더십 교육",
    DNA: "DnA 모임",
  },

  // Registration
  registration: {
    title: "코스 등록",
    confirm: "등록 확인",
    cancel: "등록 취소",
    success: "등록이 완료되었습니다!",
    cancelled: "등록이 취소되었습니다",
    error: "등록에 실패했습니다. 다시 시도해 주세요.",
    alreadyRegistered: "이미 이 코스에 등록되어 있습니다",
    loginRequired: "코스에 등록하려면 로그인하세요",
  },

  // My Courses
  myCourses: {
    title: "내 코스",
    subtitle: "등록 관리",
    upcoming: "예정된 코스",
    past: "지난 코스",
    empty: "아직 등록한 코스가 없습니다",
    status: {
      registered: "등록됨",
      cancelled: "취소됨",
      attended: "참석함",
      noShow: "불참",
    },
  },

  // Admin
  admin: {
    dashboard: {
      title: "대시보드",
      welcome: "다시 오신 것을 환영합니다",
      overview: "개요",
      recentRegistrations: "최근 등록",
      courseStats: "코스 통계",
    },
    courses: {
      title: "코스 관리",
      add: "코스 추가",
      edit: "코스 편집",
      delete: "코스 삭제",
      registrations: "등록자 목록",
    },
    members: {
      title: "회원 관리",
      add: "회원 추가",
      edit: "회원 편집",
      list: "회원 목록",
    },
    chapters: {
      title: "챕터 관리",
      list: "챕터 목록",
    },
    stats: {
      title: "통계",
      participation: "참여율",
      export: "보고서 내보내기",
    },
  },

  // Auth
  auth: {
    login: {
      title: "다시 오신 것을 환영합니다",
      subtitle: "계속하려면 계정에 로그인하세요",
      email: "이메일",
      password: "비밀번호",
      submit: "로그인",
      withLine: "LINE으로 로그인",
      noAccount: "계정이 없으신가요?",
      register: "지금 가입",
    },
    logout: {
      title: "로그아웃",
      confirm: "정말 로그아웃하시겠습니까?",
    },
  },

  // Common
  common: {
    loading: "로딩 중...",
    error: "오류가 발생했습니다",
    retry: "다시 시도",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "편집",
    view: "보기",
    back: "뒤로",
    next: "다음",
    previous: "이전",
    submit: "제출",
    search: "검색",
    filter: "필터",
    sort: "정렬",
    all: "전체",
    none: "없음",
    yes: "예",
    no: "아니오",
    date: "날짜",
    time: "시간",
    location: "장소",
    status: "상태",
    actions: "작업",
  },

  // Footer
  footer: {
    about: "회사 소개",
    contact: "문의하기",
    privacy: "개인정보 처리방침",
    terms: "이용약관",
    copyright: "© 2026 BNI 신베이 서B구. All rights reserved.",
  },
}

// ============================================================
// Latina (Latin)
// ============================================================
const la = {
  // Brand
  brand: {
    name: "BNI Novum Taipeum Occidentale B",
    tagline: "Per Nexum ad Excellentiam",
    region: "Regio Occidentalis B",
  },

  // Navigation
  nav: {
    home: "Domus",
    courses: "Cursus",
    myCourses: "Mei Cursus",
    admin: "Administratio",
    login: "Intrare",
    logout: "Exire",
    profile: "Profilus",
  },

  // Home Page
  home: {
    hero: {
      title: "Disciplina Professionalis, Incrementum Excellens",
      subtitle: "Inveni cursus eximios apud BNI et cresce cum optimis sociis negotiorum",
      cta: "Inspice Cursus",
      secondaryCta: "Disce Amplius",
    },
    stats: {
      courses: "Sessiones Disciplinae",
      members: "Membra Activa",
      chapters: "Capitula",
      referrals: "Commendationes Annuae",
    },
    featured: {
      title: "Cursus Selecti",
      subtitle: "Programmata disciplinae tibi commendata",
      viewAll: "Vide Omnes",
    },
  },

  // Courses
  courses: {
    title: "Omnes Cursus",
    subtitle: "Explora omnes cursus disciplinae et augmenta artes negotiorum tuarum",
    search: "Quaere cursus...",
    filter: {
      all: "Omnes Cursus",
      type: "Genus Cursus",
      date: "Dies",
      status: "Status",
    },
    card: {
      register: "Inscribe Nunc",
      registered: "Inscriptus",
      full: "Plenus",
      closed: "Clausus",
      online: "In Linea",
      offline: "Praesens",
      seats: "Sedes Reliquae",
      unlimited: "Infinitus",
    },
    detail: {
      about: "De Hoc Cursu",
      schedule: "Horarium",
      location: "Locus",
      instructor: "Magister",
      requirements: "Requisita",
    },
    empty: "Nulli cursus criteriis tuis respondent",
    loading: "Onerans...",
  },

  // Course Types
  courseTypes: {
    MSP: "Programma Successus Membri",
    "1ON1": "Officina Unus ad Unum",
    REFERRAL: "Officina Commendationis",
    PT: "Officina Potentis Turmae",
    PRESENTATION: "Officina Praesentationis",
    CHAPTER: "Disciplina Capituli",
    LTNA: "Conventus LTnA",
    LEADERSHIP: "Disciplina Ducatus",
    DNA: "Conventus DnA",
  },

  // Registration
  registration: {
    title: "Inscriptio Cursus",
    confirm: "Confirma Inscriptionem",
    cancel: "Annulla Inscriptionem",
    success: "Feliciter Inscriptus!",
    cancelled: "Inscriptio Annullata",
    error: "Inscriptio defecit. Quaeso iterum conare.",
    alreadyRegistered: "Iam inscriptus es huic cursui",
    loginRequired: "Quaeso intra ut cursibus inscribas",
  },

  // My Courses
  myCourses: {
    title: "Mei Cursus",
    subtitle: "Administra inscriptiones tuas",
    upcoming: "Venturi",
    past: "Praeteriti Cursus",
    empty: "Nondum ullis cursibus inscriptus es",
    status: {
      registered: "Inscriptus",
      cancelled: "Annullatus",
      attended: "Adfuit",
      noShow: "Non Adfuit",
    },
  },

  // Admin
  admin: {
    dashboard: {
      title: "Tabula Instrumentorum",
      welcome: "Salve Iterum",
      overview: "Conspectus",
      recentRegistrations: "Recentes Inscriptiones",
      courseStats: "Statisticae Cursuum",
    },
    courses: {
      title: "Administratio Cursuum",
      add: "Adde Cursum",
      edit: "Muta Cursum",
      delete: "Dele Cursum",
      registrations: "Inscriptiones",
    },
    members: {
      title: "Administratio Membrorum",
      add: "Adde Membrum",
      edit: "Muta Membrum",
      list: "Index Membrorum",
    },
    chapters: {
      title: "Administratio Capitulorum",
      list: "Index Capitulorum",
    },
    stats: {
      title: "Statisticae",
      participation: "Ratio Participationis",
      export: "Exporta Relationem",
    },
  },

  // Auth
  auth: {
    login: {
      title: "Salve Iterum",
      subtitle: "Intra in rationem tuam ut procedas",
      email: "Inscriptio Electronica",
      password: "Tessera",
      submit: "Intra",
      withLine: "Intra per LINE",
      noAccount: "Rationem non habes?",
      register: "Inscribe Nunc",
    },
    logout: {
      title: "Exire",
      confirm: "Certusne es te exire velle?",
    },
  },

  // Common
  common: {
    loading: "Onerans...",
    error: "Error accidit",
    retry: "Iterum Conare",
    save: "Serva",
    cancel: "Annulla",
    delete: "Dele",
    edit: "Muta",
    view: "Vide",
    back: "Retro",
    next: "Proximus",
    previous: "Prior",
    submit: "Submitte",
    search: "Quaere",
    filter: "Filtra",
    sort: "Ordina",
    all: "Omnes",
    none: "Nullus",
    yes: "Ita",
    no: "Non",
    date: "Dies",
    time: "Tempus",
    location: "Locus",
    status: "Status",
    actions: "Actiones",
  },

  // Footer
  footer: {
    about: "De Nobis",
    contact: "Contactus",
    privacy: "Politica Secreti",
    terms: "Termini Servitii",
    copyright: "© MMXXVI BNI Novum Taipeum Occidentale B. Omnia iura reservata.",
  },
}

export const localeNames: Record<Locale, string> = {
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  la: "Latina",
}

export const translations: Record<Locale, typeof zhTW> = {
  "zh-TW": zhTW,
  en: en,
  ja: ja,
  ko: ko,
  la: la,
}

export default translations
