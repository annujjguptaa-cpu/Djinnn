import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import PersonalPushView from './PersonalPushView'
import GitHubDashboard from './GitHubDashboard' // This is our B2B View
import { Users, Zap, Shield, Share2 } from 'lucide-react'

const GitHub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const GitHubHub = () => {
  const [mode, setMode] = useState('personal') // 'personal' (B2C) or 'team' (B2B)

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Unified Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-djinn-card-bg/50 backdrop-blur-xl border border-djinn-border p-1.5 rounded-2xl flex relative overflow-hidden">
            <motion.div 
              className="absolute h-[calc(100%-12px)] bg-djinn-purple rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              layoutId="bubble"
              initial={false}
              animate={{
                x: mode === 'personal' ? 0 : 160,
                width: 160
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button 
              onClick={() => setMode('personal')}
              className={`relative z-10 w-40 py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 ${mode === 'personal' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Zap size={18} />
              <span className="font-semibold text-sm uppercase tracking-wider">Personal</span>
            </button>
            <button 
              onClick={() => setMode('team')}
              className={`relative z-10 w-40 py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 ${mode === 'team' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Users size={18} />
              <span className="font-semibold text-sm uppercase tracking-wider">Business</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Engine */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {mode === 'personal' ? <PersonalPushView /> : <GitHubDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}

export default GitHubHub
