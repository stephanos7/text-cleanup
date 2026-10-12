import { Navigate, NavLink, Route, Routes, useMatch } from 'react-router'
import ReducerTextCleaner from './ReducerTextCleaner'
import StateTextCleaner from './StateTextCleaner'
import './App.css'


function App() {
  const isStateRoute = useMatch('/state') !== null

  return (
    <div className="page-shell" data-theme={isStateRoute ? 'purple' : undefined}>
      <nav aria-label="Implementation">
        <NavLink to="/reducer">useReducer version</NavLink>
        {" | "}
        <NavLink to="/state">useState version</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/reducer" replace />} />
          <Route path="/reducer" element={<ReducerTextCleaner />} />
          <Route path="/state" element={<StateTextCleaner />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App
