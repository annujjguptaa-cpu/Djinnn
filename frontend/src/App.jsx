import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import AutoPost from './pages/AutoPost'
import AutoConnect from './pages/AutoConnect'
import WishPage from './pages/WishPage'
import GitHubDashboard from './pages/GitHubDashboard'
import PersonalPushView from './pages/PersonalPushView'
import WorkflowBuilder from './pages/WorkflowBuilder'
import RepositoryPush from './pages/RepositoryPush'
import WhiteLabelPortal from './pages/WhiteLabelPortal'
import WishHistory from './pages/WishHistory'
import Navbar from './components/Navbar'

import { useState } from 'react'
import SplashScreen from './components/SplashScreen'

function App() {
  const location = useLocation()
  const isWishPage = location.pathname.startsWith('/wish/')
  
  // Restore splash screen
  const [showSplash, setShowSplash] = useState(!isWishPage)

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-djinn-bg bg-grid font-inter">
        {!isWishPage && !showSplash && <Navbar />}
        <AnimatePresence mode="wait">
          {!showSplash && (
            <div className="h-full">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/auto-post" element={<AutoPost />} />
                <Route path="/auto-connect" element={<AutoConnect />} />
                <Route path="/wish/:wishId" element={<WishPage />} />
                <Route path="/github-dashboard" element={<GitHubDashboard />} />
                <Route path="/github-personal" element={<PersonalPushView />} />
                <Route path="/workflow-builder" element={<WorkflowBuilder />} />
                <Route path="/github/push/:workflowId" element={<RepositoryPush />} />
                <Route path="/share/:linkId" element={<WhiteLabelPortal />} />
                <Route path="/history" element={<WishHistory />} />
              </Routes>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App
