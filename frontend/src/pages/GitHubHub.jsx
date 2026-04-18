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
  const [step, setStep] = useState(1) // 1: Connect, 2: Upload, 3: Success (for B2C)

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Mode Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-12 h-12 bg-djinn-purple/20 rounded-2xl flex items-center justify-center border border-djinn-purple/30">
                  <GitHub className="w-7 h-7 text-djinn-purple-light" />
               </div>
               <h1 className="text-5xl font-black text-gradient">GitHub Hub</h1>
            </div>
            <p className="text-djinn-subtext text-lg">One-click ascension for your source code.</p>
          </div>

          <div className="bg-black/40 p-1.5 rounded-2xl border border-djinn-border flex gap-1 relative overflow-hidden backdrop-blur-xl">
             <div 
               className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-djinn-purple rounded-xl transition-all duration-500 ease-out z-0"
               style={{ 
                 width: 'calc(50% - 6px)',
                 transform: `translateX(${mode === 'personal' ? '0%' : '100%'})` 
               }}
             />
             <button 
               onClick={() => setMode('personal')}
               className={`px-8 py-3 rounded-xl font-bold text-sm transition-all relative z-10 w-[140px] ${mode === 'personal' ? 'text-white' : 'text-djinn-subtext hover:text-white'}`}
             >
               Individual
             </button>
             <button 
               onClick={() => setMode('team')}
               className={`px-8 py-3 rounded-xl font-bold text-sm transition-all relative z-10 w-[140px] ${mode === 'team' ? 'text-white' : 'text-djinn-subtext hover:text-white'}`}
             >
               Team HQ
             </button>
          </div>
        </div>

        {/* Dynamic Viewport */}
        <AnimatePresence mode="wait">
          {mode === 'personal' ? (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <PersonalPushView onStepChange={setStep} />
            </motion.div>
          ) : (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GitHubDashboard />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  )
}

export default GitHubHub
