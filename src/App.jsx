import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useMatch } from 'react-router'
import ReducerTextCleaner from './ReducerTextCleaner'
import StateTextCleaner from './StateTextCleaner'
import ImplementationDrawer from './ImplementationDrawer'
import './App.css'

function scrollToTop(event) {
  if (
    event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
  ) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
  })
}

function App() {
  const isStateRoute = useMatch('/state') !== null
  const isHomeRoute = useMatch('/') !== null

  useEffect(() => {
    const existingRobots = document.head.querySelector('meta[data-route-robots]')
    if (isHomeRoute) {
      existingRobots?.remove()
      return
    }

    const robots = existingRobots ?? document.createElement('meta')
    robots.setAttribute('data-route-robots', '')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)

    return () => robots.remove()
  }, [isHomeRoute])

  return (
    <div className="page-shell" data-theme={isStateRoute ? 'purple' : undefined}>
      <main>
        <Routes>
          <Route path="/" element={<ReducerTextCleaner />} />
          <Route path="/state" element={<StateTextCleaner />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
        {(isHomeRoute || isStateRoute) && (
          <ImplementationDrawer
            key={isStateRoute ? 'state' : 'reducer'}
            implementation={isStateRoute ? 'state' : 'reducer'}
          />
        )}
      </main>
      <footer className="site-footer">
        <div data-nosnippet>
          <p>
            Clean up extra spaces and blank lines, join lines, or convert text to
            lowercase. Undo and redo changes, with everything staying in your browser.
          </p>
          <nav aria-label="Project links">
            <NavLink to="/" end onClick={scrollToTop}>Text cleaner</NavLink>
            <span aria-hidden="true">·</span>
            <Link
              to="/state"
              aria-current={isStateRoute ? 'page' : undefined}
              onClick={scrollToTop}
            >
              Implementation demo
            </Link>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/stephanos7/text-cleanup"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App
