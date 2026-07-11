import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Studio from './pages/Studio'
import LessonsHub from './pages/LessonsHub'
import LessonDetail from './pages/LessonDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="studio" element={<Studio />} />
        <Route path="lessons" element={<LessonsHub />} />
        <Route path="lessons/:slug" element={<LessonDetail />} />
      </Route>
    </Routes>
  )
}

export default App
