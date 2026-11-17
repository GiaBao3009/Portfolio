import type { TranslationDictionary } from '../assets/i18n/types'
import { vi } from '../assets/i18n/vi'

export type VideoAnnotation = {
  id: string
  start: number
  end: number
  title: string
  description: string
  target: { x: number; y: number }
  cueLabel?: string
}

export type ProjectProvenance = {
  badge: string
  period: string
  caption: string
  pillars: {
    label: string
    title: string
    detail: string
  }[]
}

export type FeaturedProject = {
  id: string
  number: string
  name: string
  title: string
  role: string
  handNote: string
  summary: string
  highlight: string
  provenance?: ProjectProvenance
  techStack: string[]
  videoSrc: string | null
  posterSrc: string | null
  annotations: VideoAnnotation[]
  storyboard: {
    badge: string
    headline: string
    subline: string
    keypoints: { title: string; desc: string; coord: { x: number; y: number } }[]
  }
}

export type SupportingProject = {
  id: string
  number: string
  name: string
  title: string
  category: string
  role: string
  techStack: string[]
  summary: string
  frontendHighlights: string[]
  badgeText: string
}

/**
 * Sinh danh sách 3 dự án trọng tâm theo ngôn ngữ hiện tại
 */
export function getFeaturedProjects(t: TranslationDictionary): FeaturedProject[] {
  const p = t.selectedWorks.projects

  return [
    {
      id: 'chips-bill',
      number: '01',
      name: p['chips-bill'].name,
      title: p['chips-bill'].title,
      role: p['chips-bill'].role,
      handNote: p['chips-bill'].handNote,
      summary: p['chips-bill'].summary,
      highlight: p['chips-bill'].highlight,
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Web Serial API', 'Real-time Calculations'],
      videoSrc: '/videos/chips-bill.mp4',
      posterSrc: null,
      annotations: [
        {
          id: 'scale-stream',
          start: 0,
          end: 6,
          cueLabel: p['chips-bill'].annotations[0].cueLabel,
          title: p['chips-bill'].annotations[0].title,
          description: p['chips-bill'].annotations[0].description,
          target: { x: 68, y: 36 },
        },
        {
          id: 'price-calc',
          start: 7,
          end: 11,
          cueLabel: p['chips-bill'].annotations[1].cueLabel,
          title: p['chips-bill'].annotations[1].title,
          description: p['chips-bill'].annotations[1].description,
          target: { x: 54, y: 65 },
        },
        {
          id: 'cart-workflow',
          start: 12,
          end: 21,
          cueLabel: p['chips-bill'].annotations[2].cueLabel,
          title: p['chips-bill'].annotations[2].title,
          description: p['chips-bill'].annotations[2].description,
          target: { x: 50, y: 48 },
        },
      ],
      storyboard: {
        badge: p['chips-bill'].storyboard.badge,
        headline: p['chips-bill'].storyboard.headline,
        subline: p['chips-bill'].storyboard.subline,
        keypoints: [
          {
            title: p['chips-bill'].storyboard.keypoints[0].title,
            desc: p['chips-bill'].storyboard.keypoints[0].desc,
            coord: { x: 26, y: 42 },
          },
          {
            title: p['chips-bill'].storyboard.keypoints[1].title,
            desc: p['chips-bill'].storyboard.keypoints[1].desc,
            coord: { x: 55, y: 45 },
          },
          {
            title: p['chips-bill'].storyboard.keypoints[2].title,
            desc: p['chips-bill'].storyboard.keypoints[2].desc,
            coord: { x: 82, y: 52 },
          },
        ],
      },
    },
    {
      id: 'chips-voting',
      number: '02',
      name: p['chips-voting'].name,
      title: p['chips-voting'].title,
      role: p['chips-voting'].role,
      handNote: p['chips-voting'].handNote,
      summary: p['chips-voting'].summary,
      highlight: p['chips-voting'].highlight,
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'High-Precision Math', 'Real-time Quorum'],
      videoSrc: '/videos/chips-voting.mp4',
      posterSrc: null,
      annotations: [
        {
          id: 'share-quorum',
          start: 0,
          end: 8,
          cueLabel: p['chips-voting'].annotations[0].cueLabel,
          title: p['chips-voting'].annotations[0].title,
          description: p['chips-voting'].annotations[0].description,
          target: { x: 28, y: 36 },
        },
        {
          id: 'proxy-auth',
          start: 9,
          end: 17,
          cueLabel: p['chips-voting'].annotations[1].cueLabel,
          title: p['chips-voting'].annotations[1].title,
          description: p['chips-voting'].annotations[1].description,
          target: { x: 54, y: 48 },
        },
        {
          id: 'live-tally',
          start: 18,
          end: 28,
          cueLabel: p['chips-voting'].annotations[2].cueLabel,
          title: p['chips-voting'].annotations[2].title,
          description: p['chips-voting'].annotations[2].description,
          target: { x: 76, y: 62 },
        },
      ],
      storyboard: {
        badge: p['chips-voting'].storyboard.badge,
        headline: p['chips-voting'].storyboard.headline,
        subline: p['chips-voting'].storyboard.subline,
        keypoints: [
          {
            title: p['chips-voting'].storyboard.keypoints[0].title,
            desc: p['chips-voting'].storyboard.keypoints[0].desc,
            coord: { x: 25, y: 38 },
          },
          {
            title: p['chips-voting'].storyboard.keypoints[1].title,
            desc: p['chips-voting'].storyboard.keypoints[1].desc,
            coord: { x: 53, y: 46 },
          },
          {
            title: p['chips-voting'].storyboard.keypoints[2].title,
            desc: p['chips-voting'].storyboard.keypoints[2].desc,
            coord: { x: 80, y: 58 },
          },
        ],
      },
    },
    {
      id: 'workflow-platform',
      number: '03',
      name: p['workflow-platform'].name,
      title: p['workflow-platform'].title,
      role: p['workflow-platform'].role,
      handNote: p['workflow-platform'].handNote,
      summary: p['workflow-platform'].summary,
      highlight: p['workflow-platform'].highlight,
      provenance: p['workflow-platform'].provenance,
      techStack: [
        'React Flow',
        'React',
        'TypeScript',
        'Zustand',
        'Tailwind CSS',
        'Webhooks & Gemini AI',
      ],
      videoSrc: '/videos/workflow-platform.mp4',
      posterSrc: null,
      annotations: [
        {
          id: 'node-canvas',
          start: 0,
          end: 11,
          cueLabel: p['workflow-platform'].annotations[0].cueLabel,
          title: p['workflow-platform'].annotations[0].title,
          description: p['workflow-platform'].annotations[0].description,
          target: { x: 42, y: 46 },
        },
        {
          id: 'temporal-cron',
          start: 12,
          end: 20,
          cueLabel: p['workflow-platform'].annotations[1].cueLabel,
          title: p['workflow-platform'].annotations[1].title,
          description: p['workflow-platform'].annotations[1].description,
          target: { x: 84, y: 42 },
        },
        {
          id: 'webhook-ai',
          start: 21,
          end: 27,
          cueLabel: p['workflow-platform'].annotations[2].cueLabel,
          title: p['workflow-platform'].annotations[2].title,
          description: p['workflow-platform'].annotations[2].description,
          target: { x: 84, y: 52 },
        },
        {
          id: 'telegram-live',
          start: 28,
          end: 37,
          cueLabel: p['workflow-platform'].annotations[3].cueLabel,
          title: p['workflow-platform'].annotations[3].title,
          description: p['workflow-platform'].annotations[3].description,
          target: { x: 64, y: 58 },
        },
      ],
      storyboard: {
        badge: p['workflow-platform'].storyboard.badge,
        headline: p['workflow-platform'].storyboard.headline,
        subline: p['workflow-platform'].storyboard.subline,
        keypoints: [
          {
            title: p['workflow-platform'].storyboard.keypoints[0].title,
            desc: p['workflow-platform'].storyboard.keypoints[0].desc,
            coord: { x: 27, y: 40 },
          },
          {
            title: p['workflow-platform'].storyboard.keypoints[1].title,
            desc: p['workflow-platform'].storyboard.keypoints[1].desc,
            coord: { x: 53, y: 46 },
          },
          {
            title: p['workflow-platform'].storyboard.keypoints[2].title,
            desc: p['workflow-platform'].storyboard.keypoints[2].desc,
            coord: { x: 78, y: 64 },
          },
        ],
      },
    },
  ]
}

/**
 * Sinh danh sách 4 dự án bổ trợ theo ngôn ngữ hiện tại
 */
export function getSupportingProjects(t: TranslationDictionary): SupportingProject[] {
  const s = t.selectedWorks.supporting

  return [
    {
      id: 'erp-ecosystem',
      number: '04',
      name: s['erp-ecosystem'].name,
      title: s['erp-ecosystem'].title,
      category: s['erp-ecosystem'].category,
      role: s['erp-ecosystem'].role,
      techStack: ['Angular', 'TypeScript', 'SCSS', 'Enterprise Architecture'],
      summary: s['erp-ecosystem'].summary,
      frontendHighlights: s['erp-ecosystem'].frontendHighlights,
      badgeText: s['erp-ecosystem'].badgeText,
    },
    {
      id: 'chips-task',
      number: '05',
      name: s['chips-task'].name,
      title: s['chips-task'].title,
      category: s['chips-task'].category,
      role: s['chips-task'].role,
      techStack: ['React', 'TypeScript', 'Drag-and-Drop', 'Sprint Workflow'],
      summary: s['chips-task'].summary,
      frontendHighlights: s['chips-task'].frontendHighlights,
      badgeText: s['chips-task'].badgeText,
    },
    {
      id: 'freshstore',
      number: '06',
      name: s['freshstore'].name,
      title: s['freshstore'].title,
      category: s['freshstore'].category,
      role: s['freshstore'].role,
      techStack: ['React', 'JavaScript', 'QR Code Generator', 'Responsive CSS'],
      summary: s['freshstore'].summary,
      frontendHighlights: s['freshstore'].frontendHighlights,
      badgeText: s['freshstore'].badgeText,
    },
    {
      id: 'nsi',
      number: '07',
      name: s['nsi'].name,
      title: s['nsi'].title,
      category: s['nsi'].category,
      role: s['nsi'].role,
      techStack: ['React', 'TypeScript', 'CMS Admin UI', 'Tailwind CSS'],
      summary: s['nsi'].summary,
      frontendHighlights: s['nsi'].frontendHighlights,
      badgeText: s['nsi'].badgeText,
    },
  ]
}

// Giá trị mặc định ban đầu dùng từ điển tiếng Việt
export const featuredProjects = getFeaturedProjects(vi)
export const supportingProjects = getSupportingProjects(vi)
