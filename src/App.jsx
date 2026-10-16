import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Downloads from './pages/Downloads'
import Notices from './pages/Notices'
import Results from './pages/Results'
import Gallery from './pages/Gallery'
import Events from './pages/Events'
import Admissions from './pages/Admissions'
import Contact from './pages/Contact'

const Admin = lazy(() => import('./pages/admin/Admin'))

function NotFound() {
  return (
    <section className="section container-x text-center">
      <div className="text-7xl">🙈</div>
      <h1 className="mt-4 text-4xl font-extrabold">Oops! Page not found</h1>
      <p className="mt-2">The page you're looking for has gone out to play.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="notices" element={<Notices />} />
        <Route path="results" element={<Results />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="events" element={<Events />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<Suspense fallback={<div className="grid min-h-dvh place-items-center">Loading…</div>}><Admin /></Suspense>} />
    </Routes>
  )
}
