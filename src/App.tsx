import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AlgorithmsHub from './pages/AlgorithmsHub'
import ProjectsHub from './pages/ProjectsHub'
import InterviewHub from './pages/InterviewHub'
import Roadmap from './pages/Roadmap'
import Practice from './pages/Practice'

const AlgorithmDetail = lazy(() => import('./pages/AlgorithmDetail'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const InterviewTopicPage = lazy(() => import('./pages/InterviewTopicPage'))

function PageFallback() {
  return <div className="py-20 text-center text-sm text-[var(--color-text-dim)]">Loading…</div>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="algorithms" element={<AlgorithmsHub />} />
        <Route
          path="algorithms/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <AlgorithmDetail />
            </Suspense>
          }
        />
        <Route path="projects" element={<ProjectsHub />} />
        <Route
          path="projects/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route path="interview-prep" element={<InterviewHub />} />
        <Route
          path="interview-prep/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <InterviewTopicPage />
            </Suspense>
          }
        />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="practice" element={<Practice />} />
      </Route>
    </Routes>
  )
}

export default App
