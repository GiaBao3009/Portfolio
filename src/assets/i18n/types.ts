export type TranslationDictionary = {
  common: {
    selectedWork: string
    letsTalk: string
    chapters: string
    menuToggle: string
    close: string
    liveDemo: string
    sourceCode: string
    nowFeaturing: string
    previousProject: string
    nextProject: string
    storyContinues: string
    headerNote: string
    switchLanguage: string
  }
  chaptersList: string[]
  hero: {
    toplineEdition: string
    toplineLabel: string
    kicker: string
    greeting: string
    name: string
    role: string
    buildingLead: string
    oneInteraction: string
    sideNote: string
    planeNote: string
    scrollCue: string
    madeNote: string
    pageIndicator: string
  }
  about: {
    chapterNum: string
    chapterTitle: string
    headingMain: string
    headingAccent: string
    intro: string
    polaroidCaption: string
    polaroidCredit: string
    yellowNoteTitle: string
    yellowNoteBody1: string
    yellowNoteBody2: string
    yellowNoteBody3: string
    scribbleLead: string
    scribbleHighlight: string
    linedNoteTitle: string
    linedNotePoint1: string
    linedNotePoint2: string
    linedNotePoint3: string
    linedNoteBottom: string
  }
  selectedWorks: {
    chapterNum: string
    chapterTitle: string
    headingMain: string
    headingAccent: string
    headingSub: string
    featuredOverline: string
    featuredIntroHand: string
    featuredDemonstration: string
    annotationsHeading: string
    annotationsOverline: string
    footnote: string
    playbackPlay: string
    playbackPause: string
    awaitingEvidence: string
    timelineCueHint: string
    jumpToTimestamp: string
    provenanceHeading: string
    bridgeOverline: string
    bridgeTitle: string
    bridgeHand: string
    archiveViewDemo: string
    frontendHighlightsTitle: string
    projects: {
      [id: string]: {
        name: string
        title: string
        role: string
        handNote: string
        summary: string
        highlight: string
        provenance?: {
          badge: string
          period: string
          caption: string
          pillars: {
            label: string
            title: string
            detail: string
          }[]
        }
        annotations: {
          id: string
          cueLabel: string
          title: string
          description: string
        }[]
        storyboard: {
          badge: string
          headline: string
          subline: string
          keypoints: {
            title: string
            desc: string
          }[]
        }
      }
    }
    supporting: {
      [id: string]: {
        name: string
        title: string
        category: string
        role: string
        summary: string
        frontendHighlights: string[]
        badgeText: string
      }
    }
  }
  growth: {
    chapterNum: string
    chapterTitle: string
    reminderHand: string
    headingMain: string
    headingAccent: string
    subtext: string
    note1Title: string
    note1Body: string
    note2Title: string
    note2Body: string
    note3Title: string
    note3Body: string
    windowNote: string
  }
  contact: {
    chapterNum: string
    chapterTitle: string
    kicker: string
    headingMain: string
    headingAccent: string
    subtext: string
    mainCta: string
    emailLabel: string
    githubLabel: string
    linkedinLabel: string
    tagline: string
    thanksNote: string
    backToTop: string
  }
  modal: {
    handNote: string
    githubTitle: string
    linkedinTitle: string
    githubDesc: string
    linkedinDesc: string
    githubAction: string
    linkedinAction: string
  }
}
