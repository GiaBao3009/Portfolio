export type VideoAnnotation = {
  id: string
  start: number
  end: number
  title: string
  description: string
  target: { x: number; y: number }
}

// Add the real recording here. Cue times and target coordinates are provisional
// storyboard values; align them to the recording before publishing.
export const workflowProject = {
  title: 'Workflow-Platform',
  summary: 'A low-code workflow automation platform. Connect configurable nodes, map data between steps, and turn a visual workflow into an automated process.',
  videoSrc: null as string | null,
  posterSrc: null as string | null,
  annotations: [
    {
      id: 'configure',
      start: 2,
      end: 9,
      title: 'Small nodes. Real possibilities.',
      description: 'Configure each node as a step in the workflow. Connect those steps to describe what happens next.',
      target: { x: 29, y: 45 },
    },
    {
      id: 'mapping',
      start: 10,
      end: 17,
      title: 'A little connection goes a long way.',
      description: 'Map data from one node into the next. The output of one step becomes the input for another.',
      target: { x: 52, y: 45 },
    },
    {
      id: 'schedule',
      start: 18,
      end: 25,
      title: 'Set it in motion.',
      description: 'Schedule workflows and automate email. Give a repeatable process a time and a next step.',
      target: { x: 73, y: 45 },
    },
    {
      id: 'integrations',
      start: 26,
      end: 34,
      title: 'Let the idea travel further.',
      description: 'Bring AI integration and Telegram bot workflows into the same connected process.',
      target: { x: 73, y: 72 },
    },
  ] satisfies VideoAnnotation[],
}

export const additionalProjects = [
  { id: 'selected-work-02', number: '02', title: 'Your next project', description: 'Project name, short description, responsibilities, and technologies to be added.', mediaNote: 'SHORT DEMONSTRATION OR SCREENSHOT' },
  { id: 'selected-work-03', number: '03', title: 'Another idea, made real', description: 'A space for another genuine project. Add its story and what you built.', mediaNote: 'SHORT DEMONSTRATION OR SCREENSHOT' },
]
