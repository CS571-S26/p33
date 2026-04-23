import { HashRouter, Route, Routes } from 'react-router-dom'
import AppNavBar from './components/NavBar'
import { ApplicationsProvider } from './context/ApplicationsProvider'
import { AuthProvider } from './context/AuthProvider'
import DashboardPage from './pages/DashboardPage'
import TrackerPage from './pages/TrackerPage'
import ResourcesPage from './pages/ResourcesPage'
import './App.css'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ApplicationsProvider>
          <div className="app-shell">
            <AppNavBar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/applications" element={<TrackerPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
              </Routes>
            </main>
          </div>
        </ApplicationsProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
