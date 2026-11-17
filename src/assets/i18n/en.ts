import type { TranslationDictionary } from './types'

export const en: TranslationDictionary = {
  common: {
    selectedWork: 'Selected work',
    letsTalk: 'Let’s talk',
    chapters: 'CHAPTERS',
    menuToggle: 'Open chapter navigation',
    close: 'Close',
    liveDemo: 'Live demo ↗',
    sourceCode: 'Source code ↗',
    nowFeaturing: 'NOW FEATURING',
    previousProject: 'Previous project',
    nextProject: 'Next project',
    storyContinues: 'THE STORY CONTINUES',
    headerNote: 'A LITTLE PORTFOLIO. A BIG IMAGINATION.',
    switchLanguage: 'Switch to Vietnamese (Chuyển sang Tiếng Việt)',
  },
  chaptersList: [
    'The first mark',
    'A mind full of ideas',
    'Selected works',
    'Still in progress',
    'The next chapter',
  ],
  hero: {
    toplineEdition: 'VOL. 01 — AN ONGOING STORY',
    toplineLabel: 'THE IMPOSSIBLE CHALKBOARD',
    kicker: 'Every story starts somewhere.',
    greeting: 'Hi, I’m',
    name: 'Gia Bảo',
    role: 'Frontend Developer.',
    buildingLead: 'Building experiences,',
    oneInteraction: 'one interaction at a time.',
    sideNote: 'A curious mind,\na little code,\n& a lot of possibilities.',
    planeNote: 'let’s see where this goes.',
    scrollCue: 'SCROLL TO FOLLOW THE STORY',
    madeNote: 'Drawn with curiosity. Built with intention.',
    pageIndicator: '01 — 05',
  },
  about: {
    chapterNum: '02',
    chapterTitle: 'A MIND FULL OF IDEAS',
    headingMain: 'A little curious.',
    headingAccent: 'A lot of possibility.',
    intro:
      'I’m Gia Bảo, a frontend developer who likes to turn “what if?” into something you can actually click.',
    polaroidCaption: 'where the little ideas begin.',
    polaroidCredit: 'WORKSPACE INSPIRATION · DENISE JANS / UNSPLASH',
    yellowNoteTitle: 'Curious\nby default.',
    yellowNoteBody1: 'Taking things apart.',
    yellowNoteBody2: 'Figuring things out.',
    yellowNoteBody3: 'Making them my own.',
    scribbleLead: 'the best part?',
    scribbleHighlight: 'there’s always more to learn.',
    linedNoteTitle: 'A few things about me',
    linedNotePoint1: 'Obsessed with the details.',
    linedNotePoint2: 'Always building something.',
    linedNotePoint3: 'Still learning. Always experimenting.',
    linedNoteBottom: 'Ideas → experiments → little breakthroughs',
  },
  selectedWorks: {
    chapterNum: '03',
    chapterTitle: 'IDEAS BECOME REAL — SELECTED WORKS',
    headingMain: 'Here is how I think.',
    headingAccent: 'Here is what I build.',
    headingSub:
      'From a little “what if”\nto engineering you can put to work.',
    featuredOverline: 'FEATURED DEMONSTRATIONS · 03 CORE PROJECTS',
    featuredIntroHand: 'Depth of technical execution, captured in motion.',
    featuredDemonstration: 'AUTHENTIC DEMONSTRATION WORKFLOW',
    annotationsHeading: 'key engineering cues',
    annotationsOverline: 'SYNCHRONIZED ANNOTATION',
    footnote:
      'Video proves technical execution in real-time. Portfolios guide the viewer to that evidence. Synchronized annotations anchor directly to scale weighing, shareholder quorum validation, and visual node mapping.',
    playbackPlay: 'Play demonstration',
    playbackPause: 'Pause demonstration',
    awaitingEvidence: 'evidence of capability, made tangible.',
    timelineCueHint: 'Timestamped demo breakdown · Click any cue to jump straight to that moment',
    jumpToTimestamp: 'Jump to cue',
    provenanceHeading: 'SOLO PERSONAL PROJECT · STARTED EARLY 2025',
    bridgeOverline: 'BREADTH OF EXPERIENCE · 04 SUPPORTING PROJECTS',
    bridgeTitle: 'From focused hardware POS, voting logic & workflow graphs...',
    bridgeHand: '↳ ...to enterprise ERPs, agile tools, order tracking & financial hubs.',
    archiveViewDemo: 'VIEW ARCHITECTURE & FRONTEND CONTRIBUTIONS ↗',
    frontendHighlightsTitle: 'Frontend Contributions & Responsibilities:',
    projects: {
      'chips-bill': {
        name: 'Chips Bill',
        title: 'Chips-Bill.',
        role: 'Retail POS System · Solo Frontend Developer',
        handNote: 'Operating live at Pastie store (Phu Quoc); clean demo footage in dev environment.',
        summary:
          'Engineered the complete Frontend for the retail POS application from scratch, currently operating live at the checkout counters of Pastie store in Phu Quoc. Features direct Web Serial API integration streaming live electronic scale weight readings to recompute pricing instantaneously. Due to client data privacy and NDA, demonstration footage is recorded in a development sandbox environment.',
        highlight: 'Live in Production at Phu Quoc (Pastie) · Digital scale via Web Serial API',
        annotations: [
          {
            id: 'scale-stream',
            cueLabel: '0:02 — POS CASHIER STREAM',
            title: 'Retail POS cashier & weight-based pricing',
            description:
              'Frontend interface actively captures scale weight streams, combines weighted products with barcode goods, and dynamically recalculates live cart totals.',
          },
          {
            id: 'price-calc',
            cueLabel: '0:07 — INSTANT CHECKOUT',
            title: 'Unified checkout stream & invoice completion',
            description:
              'Confirms cart items, opens multi-method payment modal (Cash / VNPay QR), and issues real-time retail receipts.',
          },
          {
            id: 'cart-workflow',
            cueLabel: '0:14 — TABLE MAP & QR ORDERS',
            title: 'Table layout management & dynamic QR ordering',
            description:
              'Live monitoring of table occupancy status and dynamic table-specific QR code generation for self-ordering.',
          },
        ],
        storyboard: {
          badge: 'POS HARDWARE INTEGRATION WORKFLOW',
          headline: 'Connecting physical scales to the web view.',
          subline: 'Scale stream → weight parser → dynamic price matrix → cart state',
          keypoints: [
            {
              title: 'Direct Scale Listener',
              desc: 'Continuous serial stream decoding weight data packets.',
            },
            {
              title: 'Live Price Computation',
              desc: 'Calculates unit rate x gross weight with zero UI lag.',
            },
            {
              title: 'Checkout Queue',
              desc: 'Instant invoice synchronization for fast retail lines.',
            },
          ],
        },
      },
      'chips-voting': {
        name: 'Chips Voting',
        title: 'Chips-Voting.',
        role: 'Shareholder Voting System · Frontend UI Architect',
        handNote: 'Re-architecting UI from scratch; 903-shareholder Excel import, 4-step proxy & live tally (In active development).',
        summary:
          'Currently in active development in a sandbox environment. Re-architecting the entire frontend UI from scratch: Excel import preview for 903 shareholders, QR check-in delegate badges, a 4-step proxy wizard with anti-chain validation, F1–F3 shortcut ballot classification, and Light/Dark theme configuration.',
        highlight: 'In Active Development · Re-architected UI, 4-Step Proxy & Live Quorum Tally',
        annotations: [
          {
            id: 'share-quorum',
            cueLabel: '0:00 — EXCEL IMPORT, QUORUM & QR BADGE',
            title: '903-Shareholder Excel Import, Quorum Ratio & Delegate QR Card',
            description:
              'Validates Excel rows before ingestion (903 valid entries), tracks total voting shares (296,372,000 shares) and check-in quorum percentages, and generates printable QR check-in badges.',
          },
          {
            id: 'proxy-auth',
            cueLabel: '0:09 — 4-STEP PROXY & REVOCATION AUDIT',
            title: '4-Step Proxy Delegation Wizard & Anti-Chain Validation',
            description:
              'Visualizes share balance transfers across 4 steps, enforces limit checks, document verification, and anti-chain delegation rules, with audited ballot revocation.',
          },
          {
            id: 'live-tally',
            cueLabel: '0:18 — LIVE BALLOT BUCKETS & DARK MODE',
            title: 'F1–F3 Ballot Classification, Quorum Lock & Theme Switching',
            description:
              'Sorts Affirmative, Dissenting, and Abstain ballots via barcode scanner or keyboard shortcuts [F1–F3], locks final resolution tallies, and switches smoothly into Dark Mode.',
          },
        ],
        storyboard: {
          badge: 'SHAREHOLDER GOVERNANCE WORKFLOW',
          headline: 'Strict precision for critical decisions.',
          subline: 'Share ratio calculation → delegate authorization → confidential ballot → live tally',
          keypoints: [
            {
              title: 'Quorum Ratio Engine',
              desc: 'High-precision voting power percentage tracking.',
            },
            {
              title: 'Proxy Delegation Flow',
              desc: 'Audited proxy assignment with split-power support.',
            },
            {
              title: 'Ballot Aggregator',
              desc: 'Real-time result distribution across shareholder tiers.',
            },
          ],
        },
      },
      'workflow-platform': {
        name: 'Workflow-Platform',
        title: 'Workflow-Platform.',
        role: 'Personal Project (Early 2025) · Solo Builder',
        handNote:
          'Personal R&D project I initiated and built from scratch in early 2025 — turning node graphs into live bots & automations.',
        summary:
          'A personal project built starting in early 2025: designed and engineered a low-code visual workflow automation platform on React Flow. Users can drag and drop nodes (HTTP Request, Email, Gemini AI, Google Sheets, Telegram), configure dynamic parameters, schedule Temporal Cron runs, issue rate-limited Webhooks, and run live Telegram AI bots end to end.',
        highlight: 'Personal Project · Built since Early 2025 · Live Demo with React Flow, Temporal & Gemini AI',
        provenance: {
          badge: 'PERSONAL PROJECT · EARLY 2025',
          period: 'Started Early 2025',
          caption: 'Self-initiated, architected, and built solo from concept to working execution.',
          pillars: [
            {
              label: '01 — ORIGIN & TIMELINE',
              title: 'Solo Personal Build (Early 2025)',
              detail:
                'Started in early 2025 as an independent engineering challenge to craft a lightweight visual automation builder with real execution feedback rather than static mockups.',
            },
            {
              label: '02 — CANVAS & ORCHESTRATION',
              title: 'React Flow · Temporal · Webhooks',
              detail:
                'Supports 10 drag-and-drop node blocks, dynamic edge piping, starter templates, Temporal run inspection logs, Cron scheduling, and rate-limited Webhook endpoints.',
            },
            {
              label: '03 — LIVE END-TO-END PROOF',
              title: 'Gmail · Gemini AI · Telegram Bot',
              detail:
                'The recorded run dispatches real automated emails to Gmail via Cron and powers an interactive Telegram bot (@baol3009_bot) using Gemini AI and Google Sheets logging.',
            },
          ],
        },
        annotations: [
          {
            id: 'node-canvas',
            cueLabel: '0:00 — REACT FLOW CANVAS & NODE CONFIG',
            title: 'Drag-and-drop Node Graph, Parameter Modals & Templates',
            description:
              'Interactive workflow canvas featuring HTTP Request, Email, Database, Gemini AI, Google Sheets, and Telegram blocks. Supports node wiring, dynamic configuration modals, and quick-start workflow templates.',
          },
          {
            id: 'temporal-cron',
            cueLabel: '0:12 — TEMPORAL TRACE, CRON & LIVE GMAIL',
            title: 'Step-by-step Run Logs, Cron Scheduler & Real Email Delivery',
            description:
              'Inspects per-node execution history and JSON output inside Run Details, configures recurring Cron schedules (* * * * * · Asia/Ho_Chi_Minh), and delivers live automated emails straight to Gmail.',
          },
          {
            id: 'webhook-ai',
            cueLabel: '0:21 — WEBHOOK TRIGGER & 6-NODE GEMINI AI FLOW',
            title: 'Rate-Limited Webhook Creation & Multi-Step AI Pipeline',
            description:
              'Creates active Webhooks with configurable rate limits (60 req/min) to trigger a 6-node AI graph: message intake → Gemini AI response → Content Filter → Google Sheets append & Telegram reply.',
          },
          {
            id: 'telegram-live',
            cueLabel: '0:28 — LIVE TELEGRAM BOT & GOOGLE SHEETS SYNC',
            title: 'Real-Time AI Bot Conversation & Feedback Persistence',
            description:
              'Messaging the live Telegram bot triggers the workflow immediately: the bot remembers conversational context, answers product queries with Gemini AI, and logs user feedback to Google Sheets.',
          },
        ],
        storyboard: {
          badge: 'VISUAL WORKFLOW AUTOMATION ENGINE',
          headline: 'An idea, connected into reality.',
          subline: 'Trigger node → data mapper → AI processor → scheduled Telegram/email dispatch',
          keypoints: [
            {
              title: 'Configurable Nodes',
              desc: 'Custom React Flow nodes with bespoke port binding.',
            },
            {
              title: 'Dynamic Data Mapping',
              desc: 'Output-to-input schema translation between nodes.',
            },
            {
              title: 'Multi-Channel Bots',
              desc: 'Scheduled cron execution, AI prompt, & Telegram alerts.',
            },
          ],
        },
      },
    },
    supporting: {
      'erp-ecosystem': {
        name: 'ERP Ecosystem',
        title: 'ERP-Ecosystem.',
        category: 'Enterprise Resource Planning',
        role: 'Frontend Developer · Ticket-Driven Development',
        summary:
          'Enterprise resource planning ecosystem encompassing Ohno ERP, Nakano ERP, and Chips ERP. Operating on a ticket-driven development model, delivering multi-level business approval flows, complex forms, and optimized high-volume data grids in Angular. Client instances are confidential; footage is sourced from internal Chips ERP.',
        frontendHighlights: [
          'Received engineering tickets and delivered precise feature specs per client requirements.',
          'Engineered multi-tier enterprise approval workflows (procurement, warehouse, HR).',
          'Optimized high-volume data grids and multi-field data entry forms for daily operation in Angular.',
        ],
        badgeText: 'CHIPS ERP (DEV FOOTAGE) · TICKET-DRIVEN',
      },
      'chips-task': {
        name: 'Chips Task',
        title: 'Chips-Task.',
        category: 'Task & Project Management',
        role: 'Frontend Co-developer · Co-Development',
        summary:
          'Comprehensive agile task and project management suite inspired by Jira. Took over and co-developed the platform alongside another engineer; demonstration footage captured in internal dev environment, focusing on fluid drag-and-drop Kanban boards and sprint lifecycles.',
        frontendHighlights: [
          'Developed fluid drag-and-drop Kanban board columns with optimistic UI position caching.',
          'Built sprint lifecycle tracking (Backlog, In Progress, Review, Done) and agile filters.',
          'Crafted collaborative issue detail modals with subtask checklists and activity history.',
        ],
        badgeText: 'CHIPS TASK (DEV FOOTAGE) · AGILE KANBAN',
      },
      'freshstore': {
        name: 'FreshStore',
        title: 'FreshStore.',
        category: 'Retail & Order Fulfillment',
        role: 'Frontend Developer · Module Expansion',
        summary:
          'Retail order management and dispatch platform running in a Node.js ecosystem. In the Frontend Developer role, developed dedicated feature modules: dynamic QR code generation per PO and order lookup details page (demonstrated in dev environment).',
        frontendHighlights: [
          'Engineered dynamic QR code generation tied uniquely to each Purchase Order (PO) identifier.',
          'Implemented dedicated PO detail lookup pages displayed upon scanning client order codes.',
          'Sanitized and presented customer contact credentials, telephone numbers, and order items.',
        ],
        badgeText: 'PO QR GENERATOR & DETAIL (DEV DEMO)',
      },
      'nsi': {
        name: 'NSI',
        title: 'NSI.',
        category: 'Securities & Stock Knowledge Hub',
        role: 'Frontend Developer · Module Expansion',
        summary:
          'Financial securities knowledge and education portal running on a Node.js stack. In the Frontend Developer role, built the public Knowledge Center, learning modules, and the internal CMS editor (demonstrated in dev environment).',
        frontendHighlights: [
          'Created public-facing Knowledge Center portal views and financial topic taxonomy navigation.',
          'Designed stock market education lesson pages with high-readability typographic layout.',
          'Developed internal Admin CMS forms for financial editors to draft, format, and publish articles.',
        ],
        badgeText: 'KNOWLEDGE CENTER & CMS (DEV DEMO)',
      },
    },
  },
  growth: {
    chapterNum: '04',
    chapterTitle: 'STILL IN PROGRESS',
    reminderHand: 'a little reminder to myself',
    headingMain: 'Not finished.',
    headingAccent: 'Just getting started.',
    subtext:
      'There’s always another thing to learn. Another idea to try.\nAnother small step toward the developer I want to become.',
    note1Title: '01 — KEEP EXPLORING',
    note1Body: 'Follow the questions.\nEven the strange ones.',
    note2Title: '02 — KEEP MAKING',
    note2Body: 'Build small things.\nLearn something big.',
    note3Title: '03 — WHAT’S NEXT?',
    note3Body: 'A blank page.\nA new possibility.',
    windowNote: 'there’s a whole world out there.',
  },
  contact: {
    chapterNum: '05',
    chapterTitle: 'THE NEXT CHAPTER',
    kicker: 'Well, here we are.',
    headingMain: 'Every good story',
    headingAccent: 'leads to another.',
    subtext:
      'Have an idea worth building?\nLet’s make something memorable.',
    mainCta: 'Let’s start a conversation',
    emailLabel: 'Email ↗',
    githubLabel: 'GitHub ↗',
    linkedinLabel: 'LinkedIn ↗',
    tagline: 'GIA BẢO · FRONTEND DEVELOPER · PORTFOLIO',
    thanksNote: 'Thanks for following my little adventure.',
    backToTop: 'BACK TO THE FIRST MARK ↑',
  },
  modal: {
    handNote: 'The next little detail.',
    githubTitle: 'Find me on GitHub.',
    linkedinTitle: 'Let’s connect on LinkedIn.',
    githubDesc:
      'Explore my repositories and source code contributions on GitHub.',
    linkedinDesc:
      'Connect directly via LinkedIn to discuss frontend engineering opportunities.',
    githubAction: 'Visit https://github.com/GiaBao3009 ↗',
    linkedinAction: 'Connect on LinkedIn ↗',
  },
}
