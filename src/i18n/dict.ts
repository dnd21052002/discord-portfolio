// i18n dictionary — flat keys, simple lookups.
// Add new keys here when introducing new UI strings.

export type Locale = 'vi' | 'en'

type Dict = Record<string, string>

const vi: Dict = {
  // ── App / brand ──
  'app.title': 'Ngọc Điệp — @discord portfolio',
  'app.description': "Ngọc Điệp's portfolio. Senior full-stack engineer. Java Spring Boot, React, Three.js, Flutter. Built Discord-style.",

  // ── Profile ──
  'profile.name': 'Ngọc Điệp',
  'profile.handle': 'ngocdiep',
  'profile.tagline': 'Senior full-stack engineer · Java Spring Boot, React, 3D/AR',
  'profile.statusText': 'Đang ship thứ hay ho',
  'profile.about': 'Backend từ Java Spring Boot, frontend React/TypeScript. Làm AR-VR platform ở VNPT Media, giờ build mấy project cá nhân về 3D/AR và multi-agent AI. Thích code sạch, ship nhanh, UI không nhạt.',
  'profile.location': 'Việt Nam',
  'profile.languages': 'Tiếng Việt (bản xứ), Tiếng Anh',
  'profile.role.backend': '@backend',
  'profile.role.fullstack': '@fullstack',
  'profile.role.3dar': '@3d-ar',

  // ── Server rail ──
  'server.home': 'Ngọc Điệp',
  'server.work': 'Work',
  'server.play': 'Play',
  'server.add': 'Thêm server',
  'server.toggle': 'Danh sách server',
  'server.dm': 'Tin nhắn trực tiếp',

  // ── Sidebar ──
  'sidebar.title': "Ngọc Điệp's Portfolio",
  'sidebar.intro': 'GIỚI THIỆU',
  'sidebar.work': 'CÔNG VIỆC',
  'sidebar.connect': 'LIÊN HỆ',

  // ── Channels ──
  'channel.welcome': 'welcome',
  'channel.about-me': 'about-me',
  'channel.projects': 'projects',
  'channel.tech-stack': 'tech-stack',
  'channel.experience': 'experience',
  'channel.contact-me': 'contact-me',

  // ── Topbar descriptions ──
  'topbar.desc.welcome': 'Bấm channel bên trái để explore.',
  'topbar.desc.about': 'Một chút về mình.',
  'topbar.desc.projects': 'Mấy project gần đây — click để xem code.',
  'topbar.desc.tech': 'Tech stack & mức độ thành thạo.',
  'topbar.desc.experience': 'Quá trình làm việc.',
  'topbar.desc.contact': 'Cách liên hệ với mình.',

  // ── User bar ──
  'user.mute': 'Tắt mic',
  'user.deafen': 'Tắt âm thanh',
  'user.settings': 'Cài đặt',

  // ── Status / presence ──
  'status.online': 'Trực tuyến',
  'status.idle': 'Chờ',
  'status.dnd': 'Đừng làm phiền',
  'status.offline': 'Ngoại tuyến',
  'status.typing': 'đang gõ',

  // ── Member list groups ──
  'members.onlineExpert': 'ONLINE — EXPERT',
  'members.idleProficient': 'CHỜ — THÀNH THẠO',
  'members.offlineLearning': 'NGOẠI TUYẾN — ĐANG HỌC',
  'members.nowPlaying': 'ĐANG HIỂN THỊ',

  // ── Theme switcher ──
  'theme.title': 'Giao diện',
  'theme.dark': 'Discord Dark',
  'theme.light': 'Discord Light',
  'theme.dracula': 'Dracula',
  'theme.nord': 'Nord',

  // ── Language switcher ──
  'lang.title': 'Ngôn ngữ',
  'lang.vi': 'Tiếng Việt',
  'lang.en': 'English',

  // ── Common UI ──
  'common.search': 'Tìm kiếm',
  'common.pinned': 'Tin đã ghim',
  'common.members': 'Danh sách thành viên',
  'common.inbox': 'Hộp thư',
  'common.notifications': 'Thông báo',
  'common.changeTheme': 'Đổi giao diện',
  'common.changeLang': 'Đổi ngôn ngữ',
  'common.bot': 'BOT',
  'common.send': 'Gửi',
  'common.pinnedShort': 'Ghim',
  'common.newThread': 'Tin nhắn mới',
  'common.markdown': 'Hỗ trợ Markdown',

  // ── Time / timestamps ──
  'time.todayAt': 'Hôm nay lúc',
  'time.now': 'nay',

  // ── Game hub ──
  'gamehub.aria': 'Play zone',
  'gamehub.title': 'Mini Games',
  'gamehub.subtitle': 'Click chọn game để chơi. Tất cả đều chơi được trên mobile.',
  'gamehub.tapToPlay': 'Bấm để chơi',
  'gamehub.tip': '↑↓←→ / WASD / vuốt mobile',
  'gamehub.snake.title': 'Snake',
  'gamehub.snake.desc': 'Rắn ăn mồi, tránh tường và đuôi. Cổ điển.',
  'gamehub.tictactoe.title': 'Tic-Tac-Toe',
  'gamehub.tictactoe.desc': 'Đấu với AI. Hard mode không thể thắng.',
  'gamehub.memory.title': 'Memory Match',
  'gamehub.memory.desc': 'Lật cặp emoji. Ít move + nhanh = điểm cao.',
  'gamehub.2048.title': '2048',
  'gamehub.2048.desc': 'Trượt số, gộp giống nhau, đạt 2048.',

  // ── Snake ──
  'snake.title': 'Snake',
  'snake.subtitle': '↑↓←→ hoặc WASD · Space tạm dừng',
  'snake.start': 'Bắt đầu',
  'snake.score': 'Điểm',
  'snake.best': 'Kỷ lục',
  'snake.controlsHint': '↑↓←→ · WASD · Space tạm dừng',

  // ── Tic-Tac-Toe ──
  'ttt.easy': 'Dễ',
  'ttt.hard': 'Khó',
  'ttt.reset': 'Chơi lại',
  'ttt.wins': 'Thắng',
  'ttt.draws': 'Hòa',
  'ttt.losses': 'Thua',
  'ttt.youWin': 'Bạn thắng!',
  'ttt.youLose': 'AI thắng!',
  'ttt.draw': 'Hòa!',
  'ttt.playAgain': 'Chơi lại',

  // ── Memory ──
  'memory.title': 'Memory Match',
  'memory.subtitle': 'Lật 2 thẻ. Khớp → giữ. Tìm hết 8 cặp.',
  'memory.start': 'Bắt đầu',
  'memory.moves': 'Lượt',
  'memory.time': 'Thời gian',
  'memory.best': 'Kỷ lục',
  'memory.won': 'Hoàn thành!',
  'memory.playAgain': 'Chơi lại',

  // ── 2048 ──
  'g2048.score': 'Điểm',
  'g2048.best': 'Kỷ lục',
  'g2048.new': 'Mới',
  'g2048.over': 'Hết nước đi!',
  'g2048.tryAgain': 'Thử lại',
  'g2048.youWin': 'Bạn đạt 2048!',
  'g2048.continue': 'Tiếp tục',
  'g2048.winScore': 'Điểm:',

  // ── Game (shared) ──
  'game.controls': 'Dùng phím mũi tên hoặc WASD để di chuyển',
  'game.start': 'Bắt đầu',
  'game.paused': 'Tạm dừng',
  'game.resume': 'Tiếp tục',
  'game.over': 'Game Over!',
  'game.score': 'Điểm',
  'game.newRecord': 'Kỷ lục mới!',
  'game.restart': 'Chơi lại',
  'game.or': 'hoặc',
  'game.pauseHint': 'tạm dừng',
  'game.swipe': 'vuốt trên mobile',

  // ── Section: #welcome ──
  'welcome.greeting': 'Hey 👋 chào mừng tới',
  'welcome.channelLabel': '— đây là',
  'welcome.channelTag': 'channel.',
  'welcome.intro': 'Đây không phải portfolio bình thường — nó là 1 cái Discord server giả. Click các channel bên trái để khám phá:',
  'welcome.tip': 'Tip',
  'welcome.tipBody': 'Bấm icon 🎨 (paint brush) ở góc phải top bar để đổi 4 theme, hoặc 🌐 để chuyển Việt ↔ English.',
  'welcome.botMessage': 'vừa drop 1 pin mới trong',
  'welcome.botCheckIt': '. Check it out 👀',
  'welcome.dividerDate': 'Hôm nay',
  'welcome.dividerLabel': 'BÂY GIỜ',
  'welcome.refactorIntro': 'Mình vừa refactor',
  'welcome.refactorStack': '— đang dùng Vite + React 19 + TS + Tailwind v4 + Motion. Stack consistent với',
  'welcome.refactorAnd': 'và',

  // ── Section: #about-me ──
  'about.welcome': 'Chào 👋',
  'about.location': 'Location:',
  'about.languages': 'Ngôn ngữ:',
  'about.roles': 'Roles:',

  // ── Section: #projects ──
  'projects.pinned': 'Ghim',
  'projects.pinnedDesc': '6 featured projects từ',
  'projects.eachThread': 'Mỗi project = 1 channel thread.',
  'projects.highlight': '✨',
  'projects.path': '~/Developer/',

  // ── Section: #tech-stack ──
  'tech.guide': 'Mỗi skill = 1 role color (giống Discord). Bên phải ● online = expert, ● idle = proficient, ● offline = learning.',
  'tech.expert': 'EXPERT',
  'tech.proficient': 'THÀNH THẠO',
  'tech.learning': 'ĐANG HỌC',
  'tech.legendOnline': 'online',
  'tech.legendExpert': '= expert',
  'tech.legendIdle': 'idle =',
  'tech.legendProficient': 'proficient',
  'tech.legendOffline': 'offline =',
  'tech.legendLearning': 'learning',

  // ── Section: #experience ──
  'experience.guide': 'Quá trình làm việc — dạng chat log theo thời gian.',
  'experience.currentlyHere': 'Đang làm ở đây',
  'experience.systemMsg': 'Muốn xem full picture? Check',
  'experience.systemCount': 'có',
  'experience.systemStack': 'spanning Java Spring Boot, React, Flutter, Three.js, Python.',

  // ── Section: #contact-me ──
  'contact.greeting': 'Mở channel DM bất kỳ lúc nào. Mình thường reply trong vài giờ nếu không ngủ 😄',
  'contact.noteTitle': 'Lưu ý',
  'contact.noteBody': 'Portfolio này static, không có backend nên DM chỉ là visual. Để liên hệ thật, dùng',
  'contact.noteEnd': 'hoặc GitHub.',

  // ── Project descriptions ──
  'project.v-xr-backend.desc': 'Java Spring Boot backend cho AR-VR platform. Modular kiến trúc: Libraries / Processes / Standalone. Tích hợp VNPT Media pipeline (CMS, Console, Web, Mobile).',
  'project.v-xr-backend.highlight': 'Production tại VNPT Media',
  'project.vxr-shopping.desc': 'Nền tảng e-commerce nội thất với 3D/AR. Next.js 15 + Three.js + react-three-fiber, đổi màu realtime trên GLB model, AR Quick Look (iOS) / Scene Viewer (Android), Socket.io chat giữa khách–shop, pricing tính phía server.',
  'project.vxr-shopping.highlight': '3D model swap realtime',
  'project.digital-twin.desc': 'Realtime 3D digital twin dashboard. WebSocket telemetry, anomaly detection, simulation view, telemetry view, 3D model render bằng Three.js. Multi-view: Overview / Telemetry / Anomaly / Simulation / Digital Model / Settings.',
  'project.digital-twin.highlight': '6 views · realtime telemetry',
  'project.autonomus-crypto.desc': 'Multi-agent crypto trading system. Python, multiple agents phối hợp (analysis / execution / risk), autonomous loop.',
  'project.vietnam-food-landing.desc': 'Landing page giới thiệu ẩm thực Việt Nam. Next.js, custom layout, typography discipline.',
  'project.vxr-mobile.desc': 'Mobile app Flutter cho VXR ecosystem. Android + iOS, integration với panorama + digital twin backend.',

  // ── Experience descriptions ──
  'exp.vnpt.role': 'Backend / Full-stack Engineer',
  'exp.vnpt.desc': 'AR-VR platform team. Build Spring Boot backend (v-xr-backend), modular Libraries/Processes/Standalone. Coordinate với CMS, Console, Web, Mobile. Maintain API gateway và deploy pipeline cho toàn bộ platform (10.144.13.140).',
  'exp.personal.role': 'Builder',
  'exp.personal.desc': 'Immervex (3D/AR e-commerce), digital-twin dashboard, multi-agent crypto trading, và tụi landing page nhỏ. Tập trung 3D/AR + AI agents.',
}

const en: Dict = {
  // ── App / brand ──
  'app.title': 'Ngọc Điệp — @discord portfolio',
  'app.description': "Ngọc Điệp's portfolio. Senior full-stack engineer. Java Spring Boot, React, Three.js, Flutter. Built Discord-style.",

  // ── Profile ──
  'profile.name': 'Ngọc Điệp',
  'profile.handle': 'ngocdiep',
  'profile.tagline': 'Senior full-stack engineer · Java Spring Boot, React, 3D/AR',
  'profile.statusText': 'Shipping something cool',
  'profile.about': 'Backend in Java Spring Boot, frontend in React/TypeScript. Built AR-VR platform at VNPT Media, now working on personal 3D/AR + multi-agent AI projects. Likes clean code, ships fast, hates bland UI.',
  'profile.location': 'Vietnam',
  'profile.languages': 'Vietnamese (native), English',
  'profile.role.backend': '@backend',
  'profile.role.fullstack': '@fullstack',
  'profile.role.3dar': '@3d-ar',

  // ── Server rail ──
  'server.home': 'Ngọc Điệp',
  'server.work': 'Work',
  'server.play': 'Play',
  'server.add': 'Add a Server',
  'server.toggle': 'Server list',
  'server.dm': 'Direct Messages',

  // ── Sidebar ──
  'sidebar.title': "Ngọc Điệp's Portfolio",
  'sidebar.intro': 'INTRO',
  'sidebar.work': 'WORK',
  'sidebar.connect': 'CONNECT',

  // ── Channels ──
  'channel.welcome': 'welcome',
  'channel.about-me': 'about-me',
  'channel.projects': 'projects',
  'channel.tech-stack': 'tech-stack',
  'channel.experience': 'experience',
  'channel.contact-me': 'contact-me',

  // ── Topbar descriptions ──
  'topbar.desc.welcome': 'Click a channel on the left to explore.',
  'topbar.desc.about': 'A bit about me.',
  'topbar.desc.projects': 'Recent projects — click to see code.',
  'topbar.desc.tech': 'Tech stack & proficiency.',
  'topbar.desc.experience': 'Work history.',
  'topbar.desc.contact': 'How to reach me.',

  // ── User bar ──
  'user.mute': 'Mute mic',
  'user.deafen': 'Deafen',
  'user.settings': 'User settings',

  // ── Status / presence ──
  'status.online': 'Online',
  'status.idle': 'Idle',
  'status.dnd': 'Do Not Disturb',
  'status.offline': 'Offline',
  'status.typing': 'is typing',

  // ── Member list groups ──
  'members.onlineExpert': 'ONLINE — EXPERT',
  'members.idleProficient': 'IDLE — PROFICIENT',
  'members.offlineLearning': 'OFFLINE — LEARNING',
  'members.nowPlaying': 'NOW PLAYING',

  // ── Theme switcher ──
  'theme.title': 'Theme',
  'theme.dark': 'Discord Dark',
  'theme.light': 'Discord Light',
  'theme.dracula': 'Dracula',
  'theme.nord': 'Nord',

  // ── Language switcher ──
  'lang.title': 'Language',
  'lang.vi': 'Tiếng Việt',
  'lang.en': 'English',

  // ── Common UI ──
  'common.search': 'Search',
  'common.pinned': 'Pinned messages',
  'common.members': 'Member list',
  'common.inbox': 'Inbox',
  'common.notifications': 'Notifications',
  'common.changeTheme': 'Change theme',
  'common.changeLang': 'Change language',
  'common.bot': 'BOT',
  'common.send': 'Send',
  'common.pinnedShort': 'Pinned',
  'common.newThread': 'New thread',
  'common.markdown': 'Markdown supported',

  // ── Time / timestamps ──
  'time.todayAt': 'Today at',
  'time.now': 'present',

  // ── Game hub ──
  'gamehub.aria': 'Play zone',
  'gamehub.title': 'Mini Games',
  'gamehub.subtitle': 'Pick a game to play. All work on mobile too.',
  'gamehub.tapToPlay': 'Tap to play',
  'gamehub.tip': '↑↓←→ / WASD / swipe on mobile',
  'gamehub.snake.title': 'Snake',
  'gamehub.snake.desc': 'Eat food, avoid walls and yourself. Classic arcade.',
  'gamehub.tictactoe.title': 'Tic-Tac-Toe',
  'gamehub.tictactoe.desc': 'Challenge the AI. Hard mode is unbeatable.',
  'gamehub.memory.title': 'Memory Match',
  'gamehub.memory.desc': 'Flip emoji pairs. Fewer moves + faster = best score.',
  'gamehub.2048.title': '2048',
  'gamehub.2048.desc': 'Slide tiles, merge same numbers, reach 2048.',

  // ── Snake ──
  'snake.title': 'Snake',
  'snake.subtitle': '↑↓←→ or WASD · Space to pause',
  'snake.start': 'Start',
  'snake.score': 'Score',
  'snake.best': 'Best',
  'snake.controlsHint': '↑↓←→ · WASD · Space to pause',

  // ── Tic-Tac-Toe ──
  'ttt.easy': 'Easy',
  'ttt.hard': 'Hard',
  'ttt.reset': 'Reset',
  'ttt.wins': 'Wins',
  'ttt.draws': 'Draws',
  'ttt.losses': 'Losses',
  'ttt.youWin': 'You win!',
  'ttt.youLose': 'AI wins!',
  'ttt.draw': 'Draw!',
  'ttt.playAgain': 'Play again',

  // ── Memory ──
  'memory.title': 'Memory Match',
  'memory.subtitle': 'Flip 2 cards. Match → keep. Find all 8 pairs.',
  'memory.start': 'Start',
  'memory.moves': 'Moves',
  'memory.time': 'Time',
  'memory.best': 'Best',
  'memory.won': 'You win!',
  'memory.playAgain': 'Play again',

  // ── 2048 ──
  'g2048.score': 'Score',
  'g2048.best': 'Best',
  'g2048.new': 'New',
  'g2048.over': 'Game over!',
  'g2048.tryAgain': 'Try again',
  'g2048.youWin': 'You reached 2048!',
  'g2048.continue': 'Continue',
  'g2048.winScore': 'Score:',

  // ── Game (shared) ──
  'game.controls': 'Use arrow keys or WASD to move',
  'game.start': 'Start',
  'game.paused': 'Paused',
  'game.resume': 'Resume',
  'game.over': 'Game Over!',
  'game.score': 'Score',
  'game.newRecord': 'New record!',
  'game.restart': 'Play again',
  'game.or': 'or',
  'game.pauseHint': 'pause',
  'game.swipe': 'swipe on mobile',

  // ── Section: #welcome ──
  'welcome.greeting': 'Hey 👋 welcome to',
  'welcome.channelLabel': '— this is the',
  'welcome.channelTag': 'channel.',
  'welcome.intro': "This isn't a normal portfolio — it's a fake Discord server. Click the channels on the left to explore:",
  'welcome.tip': 'Tip',
  'welcome.tipBody': 'Click the 🎨 paint brush in the top right to swap 4 themes, or 🌐 to toggle Vietnamese ↔ English.',
  'welcome.botMessage': 'just dropped a new pin in',
  'welcome.botCheckIt': '. Check it out 👀',
  'welcome.dividerDate': 'Today',
  'welcome.dividerLabel': 'TODAY',
  'welcome.refactorIntro': 'Just refactored',
  'welcome.refactorStack': '— using Vite + React 19 + TS + Tailwind v4 + Motion. Stack consistent with',
  'welcome.refactorAnd': 'and',

  // ── Section: #about-me ──
  'about.welcome': 'Hi 👋',
  'about.location': 'Location:',
  'about.languages': 'Languages:',
  'about.roles': 'Roles:',

  // ── Section: #projects ──
  'projects.pinned': 'Pinned',
  'projects.pinnedDesc': '6 featured projects from',
  'projects.eachThread': 'Each project = 1 channel thread.',
  'projects.highlight': '✨',
  'projects.path': '~/Developer/',

  // ── Section: #tech-stack ──
  'tech.guide': 'Each skill = 1 role color (like Discord). Right ● online = expert, ● idle = proficient, ● offline = learning.',
  'tech.expert': 'EXPERT',
  'tech.proficient': 'PROFICIENT',
  'tech.learning': 'LEARNING',
  'tech.legendOnline': 'online',
  'tech.legendExpert': '= expert',
  'tech.legendIdle': 'idle =',
  'tech.legendProficient': 'proficient',
  'tech.legendOffline': 'offline =',
  'tech.legendLearning': 'learning',

  // ── Section: #experience ──
  'experience.guide': 'Work history — chat-log style, chronologically.',
  'experience.currentlyHere': 'Currently here',
  'experience.systemMsg': 'Want the full picture? Check',
  'experience.systemCount': 'there are',
  'experience.systemStack': 'spanning Java Spring Boot, React, Flutter, Three.js, Python.',

  // ── Section: #contact-me ──
  'contact.greeting': 'Open a DM channel anytime. I usually reply within a few hours if I\'m not asleep 😄',
  'contact.noteTitle': 'Note',
  'contact.noteBody': 'This portfolio is static — no backend, so DMs are visual only. For real contact, use',
  'contact.noteEnd': 'or GitHub.',

  // ── Project descriptions ──
  'project.v-xr-backend.desc': 'Java Spring Boot backend for an AR-VR platform. Modular architecture: Libraries / Processes / Standalone. Integrates with the VNPT Media pipeline (CMS, Console, Web, Mobile).',
  'project.v-xr-backend.highlight': 'Production at VNPT Media',
  'project.vxr-shopping.desc': 'Furniture e-commerce platform with 3D/AR. Next.js 15 + Three.js + react-three-fiber, realtime material/color swap on GLB models, AR Quick Look (iOS) / Scene Viewer (Android), Socket.io chat between customer & shop, server-side pricing.',
  'project.vxr-shopping.highlight': 'Realtime 3D model swap',
  'project.digital-twin.desc': 'Realtime 3D digital twin dashboard. WebSocket telemetry, anomaly detection, simulation, telemetry views, 3D model rendered with Three.js. Multi-view: Overview / Telemetry / Anomaly / Simulation / Digital Model / Settings.',
  'project.digital-twin.highlight': '6 views · realtime telemetry',
  'project.autonomus-crypto.desc': 'Multi-agent crypto trading system in Python. Multiple agents collaborate (analysis / execution / risk), runs an autonomous loop.',
  'project.vietnam-food-landing.desc': 'Landing page showcasing Vietnamese food. Next.js, custom layout, typography discipline.',
  'project.vxr-mobile.desc': 'Flutter mobile app for the VXR ecosystem. Android + iOS, integrates with panorama and digital twin backend.',

  // ── Experience descriptions ──
  'exp.vnpt.role': 'Backend / Full-stack Engineer',
  'exp.vnpt.desc': 'AR-VR platform team. Built the Spring Boot backend (v-xr-backend), modular Libraries/Processes/Standalone. Coordinated with CMS, Console, Web, Mobile teams. Maintained the API gateway and deployment pipeline for the entire platform (10.144.13.140).',
  'exp.personal.role': 'Builder',
  'exp.personal.desc': 'Immervex (3D/AR e-commerce), digital-twin dashboard, multi-agent crypto trading, plus smaller landing pages. Focus on 3D/AR + AI agents.',
}

export const dict: Record<Locale, Dict> = { vi, en }

export const defaultLocale: Locale = 'vi'
