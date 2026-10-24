import { useEffect, useRef, useState, type RefObject } from 'react'
import { additionalProjects, workflowProject } from './data/selectedWorks'
import './selected-works.css'

function WorkflowStoryboard({ selected }: { selected: number }) {
  const nodes = ['Configure a node', 'Map the data', 'Schedule & email', 'AI & Telegram']
  return <div className="workflow-storyboard">
    <span className="storyboard-label">DEMONSTRATION PLACEHOLDER · NOT THE PRODUCT INTERFACE</span>
    <div className="storyboard-intro"><span className="hand">An idea, connected.</span><p>The real workflow recording belongs here.</p></div>
    <div className="storyboard-drawing" aria-label="Illustrative workflow: configure nodes, map data, schedule email, and connect AI and Telegram">
      <svg viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true">
        <path className={selected === 1 ? 'highlight' : ''} d="M240 120C315 105 325 135 400 120m-12-7 13 7-12 8"/>
        <path className={selected === 2 ? 'highlight' : ''} d="M585 120C645 135 670 102 735 120m-13-8 14 8-12 9"/>
        <path className={selected === 3 ? 'highlight' : ''} d="M830 167C855 210 795 230 830 273m-11-9 11 11 6-14"/>
        <path className="drawing-return" d="M730 320C480 385 230 310 120 180"/>
      </svg>
      {nodes.map((name, i) => <div key={name} className={`storyboard-node node-${i}${selected === i ? ' is-highlighted' : ''}`}><span>0{i + 1}</span><strong>{name}</strong><i aria-hidden="true"/></div>)}
    </div>
    <div className="storyboard-bottom"><span>AN ILLUSTRATION OF THE PROVIDED FEATURES</span><span>REAL FOOTAGE, NOT A MOCK INTERFACE ↗</span></div>
  </div>
}

export default function SelectedWorks({ sceneRef, flight }: { sceneRef: RefObject<HTMLDivElement | null>; flight: React.ReactNode }) {
  const video = useRef<HTMLVideoElement>(null)
  const stage = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState(workflowProject.videoSrc ? -1 : 0)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const hasVideo = Boolean(workflowProject.videoSrc) && !failed
  const annotation = selected >= 0 ? workflowProject.annotations[selected] : null

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setReduced(preference.matches); if (preference.matches) video.current?.pause() }
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!hasVideo || !stage.current || !video.current) return
    const media = video.current
    let attempted = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) media.pause()
      else if (!reduced && !attempted) {
        attempted = true
        media.play().catch(() => setPlaying(false))
      }
    }, { threshold: .35 })
    observer.observe(stage.current)
    return () => observer.disconnect()
  }, [hasVideo, reduced])

  const synchronize = () => {
    const time = video.current?.currentTime ?? 0
    setSelected(workflowProject.annotations.findIndex(cue => time >= cue.start && time < cue.end))
  }

  const changeNote = (direction: number) => {
    const next = (Math.max(0, selected) + direction + workflowProject.annotations.length) % workflowProject.annotations.length
    setSelected(next)
    if (video.current && hasVideo) {
      video.current.currentTime = workflowProject.annotations[next].start
      video.current.pause()
    }
  }

  return <section id="chapter-4" data-chapter className="projects chapter selected-works">
    <div className="chapter-label"><span>04</span><i/>IDEAS BECOME REAL — SELECTED WORKS</div>
    <div className="section-heading reveal"><h2>Here is how I think.<br/><em>Here is what I build.</em></h2><p>From a little “what if”<br/>to something you can put to work.</p></div>

    <div className="signature-scene workflow-feature" ref={sceneRef}>
      <article aria-labelledby="workflow-title">
        <div className="workflow-heading">
          <div><span className="work-overline">01 / FEATURED PROJECT</span><h3 id="workflow-title">Workflow<span>-</span><em>Platform.</em></h3></div>
          <div className="workflow-summary"><span className="hand">A little less repetition.<br/> A little more possibility.</span><p>{workflowProject.summary}</p></div>
        </div>

        <figure ref={stage} className="workflow-demonstration" aria-label="Workflow-Platform demonstration">
          <div className="workflow-media">
            {hasVideo ? <video ref={video} src={workflowProject.videoSrc!} poster={workflowProject.posterSrc ?? undefined} muted playsInline preload="metadata" disablePictureInPicture disableRemotePlayback aria-label="Workflow-Platform product demonstration" aria-describedby="workflow-note" onLoadedMetadata={synchronize} onTimeUpdate={synchronize} onSeeked={synchronize} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setSelected(-1) }} onError={() => { setFailed(true); setPlaying(false); setSelected(0) }}/> : <WorkflowStoryboard selected={selected}/>}
            {hasVideo && annotation && <svg className="workflow-pointer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M 48 99 Q ${annotation.target.x - 12} 88 ${annotation.target.x} ${annotation.target.y + 3}`}/><circle cx={annotation.target.x} cy={annotation.target.y} r="1.1"/></svg>}
          </div>
          {flight}
          <figcaption className="workflow-caption"><span>FIG. 01 — A WORKFLOW, ONE CONNECTION AT A TIME.</span><span>{hasVideo ? 'PRODUCT DEMONSTRATION' : 'VIDEO TO BE ADDED · 16:9'}</span></figcaption>
        </figure>

        <div className="workflow-notes">
          <div className="workflow-note-heading"><span className="hand">{hasVideo ? 'a few things to notice' : 'notes for the real demonstration'}</span><span className="work-overline">{hasVideo ? 'FOLLOWING THE RECORDING' : 'ANNOTATION STORYBOARD'}</span></div>
          <div className="workflow-note" id="workflow-note" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
            {annotation ? <div key={annotation.id} className="workflow-note-content"><span className="note-pencil" aria-hidden="true">↳</span><div><h4>{annotation.title}</h4><p>{annotation.description}</p></div></div> : <div className="workflow-note-content"><span className="note-pencil" aria-hidden="true">↳</span><div><h4>{video.current?.ended ? 'An idea, put to work.' : 'Let the workflow tell its story.'}</h4><p>{video.current?.ended ? 'Revisit a feature using the notes, or continue to the next project.' : 'A note will appear when the next feature comes into view.'}</p></div></div>}
          </div>
          <div className="workflow-note-navigation" aria-label="Demonstration annotations">
            <button onClick={() => changeNote(-1)} aria-label="Previous feature annotation">←</button>
            <span>{selected < 0 ? '—' : String(selected + 1).padStart(2, '0')} / {String(workflowProject.annotations.length).padStart(2, '0')}</span>
            <button onClick={() => changeNote(1)} aria-label="Next feature annotation">→</button>
          </div>
        </div>

        <div className="workflow-footnote">
          <p>{hasVideo ? 'The details follow the demonstration. Explore a note to revisit a feature.' : failed ? 'The recording could not be loaded. Explore the feature notes while the video is unavailable.' : 'The demonstration is still to be added. Explore the planned annotations above; positions and cue times will be aligned to the real footage.'}</p>
          {hasVideo ? <button className="workflow-playback" onClick={() => { if (!video.current) return; if (playing) video.current.pause(); else video.current.play().catch(() => setPlaying(false)) }}>{playing ? 'Pause demonstration' : video.current?.ended ? 'Replay demonstration' : 'Play demonstration'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button> : <span className="workflow-awaiting hand">the real thing belongs here.</span>}
        </div>
      </article>
    </div>

    <div className="more-work-intro"><span className="work-overline">A FEW MORE PAGES</span><span className="hand">Room for the next little breakthrough.</span></div>
    <div className="additional-works">
      {additionalProjects.map((project, i) => <article key={project.id} id={project.id} className={`additional-work additional-work-${i + 1}`}>
        <div className="additional-work-paper"><span className="tape" aria-hidden="true"/><div className="additional-media"><span>{project.number}</span><svg viewBox="0 0 160 90" aria-hidden="true"><path d="M5 7 155 4 153 85 8 86 5 7Zm2 0 146 78M155 4 8 86"/></svg><small>{project.mediaNote}</small></div><span className="additional-paper-caption">PROJECT PLACEHOLDER — YOUR REAL WORK GOES HERE</span></div>
        <div className="additional-work-copy"><span className="work-overline">{project.number} / PROJECT DETAILS TO BE ADDED</span><h3>{project.title}</h3><p>{project.description}</p><span className="additional-links-placeholder">Demo & source links to be added</span></div>
      </article>)}
    </div>
    <div className="selected-works-ending"><span className="hand">Always another idea on the board.</span><a href="#chapter-5">THE STORY CONTINUES <span aria-hidden="true">↓</span></a></div>
  </section>
}
