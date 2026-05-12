import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
import { Upload, CheckCircle, FileText, Rocket, AlertCircle, Loader2 } from 'lucide-react'

import { API_BASE } from '../config'

export default function RepositoryPush() {
  const { workflowId } = useParams()
  const [workflow, setWorkflow] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [aiReadme, setAiReadme] = useState('')
  const [repoUrl, setRepoUrl] = useState('')

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const res = await axios.get(`${API_BASE}/workflow/${workflowId}`)
        setWorkflow(res.data)
      } catch (err) {
        console.error("Failed to fetch workflow", err)
      }
    }
    fetchWorkflow()
  }, [workflowId])

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files)
    setFiles(uploadedFiles)
    setStep(2)
  }

  const generateAIReadme = async () => {
    setLoading(true)
    // Simulation for demo
    await new Promise(r => setTimeout(r, 2000))
    setAiReadme(`# ${workflow?.name}\n\nThis project follows the strict B2B compliance standards of Djinn.\n\n## Structure\n- src/\n- tests/\n\nGenerated with Claude-3 Opus.`)
    setStep(3)
    setLoading(false)
  }

  const handlePush = async () => {
    setLoading(true)
    // Final cinematic push simulation
    await new Promise(r => setTimeout(r, 3000))
    setRepoUrl(`https://github.com/organization/${workflow?.name.replace(/\s+/g, '-').toLowerCase()}`)
    setStep(4)
    setLoading(false)
  }

  if (!workflow && step === 1) return <div className="min-h-screen flex items-center justify-center text-djinn-purple-light">Summoning Blueprint...</div>

  return (
    <PageWrapper title="Engineering Push" subtitle={`Applying workflow: ${workflow?.name || 'Loading...'}`}>
      <div className="max-w-3xl mx-auto">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="card-glow rounded-[40px] p-20 border-dashed border-2 border-djinn-purple/40 hover:border-djinn-purple transition-all cursor-pointer group" onClick={() => document.getElementById('file-upload').click()}>
                <input type="file" id="file-upload" className="hidden" multiple webkitdirectory="" onChange={handleFileUpload} />
                <div className="w-24 h-24 bg-djinn-purple/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all">
                  <Upload className="w-10 h-10 text-djinn-purple-light" />
                </div>
                <h2 className="text-3xl font-black mb-4">Select Project Folder</h2>
                <p className="text-djinn-subtext text-sm">Upload your project. Djinn will validate against the organization's governance blueprint.</p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="card-glow rounded-3xl p-8 bg-black/40 border border-djinn-border">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <CheckCircle className="w-5 h-5 text-green-400" />
                   Compliance Check
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-djinn-subtext">Folder Structure ('src', 'tests')</span>
                       <span className="text-green-400 font-bold uppercase text-[10px]">Valid</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-djinn-subtext">No Secrets Detected</span>
                       <span className="text-green-400 font-bold uppercase text-[10px]">Valid</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-djinn-subtext">License (MIT)</span>
                       <span className="text-yellow-400 font-bold uppercase text-[10px]">Injecting...</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={generateAIReadme}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-djinn-purple text-white font-black text-lg shadow-purple-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                Process with AI Engine
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="card-glow rounded-3xl p-8 bg-black/40 border border-djinn-border">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-djinn-purple-light" />
                      Generated README.md
                    </h3>
                    <span className="text-[10px] font-bold bg-djinn-purple/20 text-djinn-purple-light px-2 py-1 rounded">Claude-3 Opus</span>
                  </div>
                  <pre className="text-xs text-djinn-subtext bg-black/50 p-6 rounded-xl border border-white/5 font-mono overflow-auto max-h-[300px]">
                    {aiReadme}
                  </pre>
               </div>

               <button 
                onClick={handlePush}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-600 to-green-400 text-white font-black text-lg shadow-green-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Final Push to GitHub'}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
               <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-16 h-16 text-white" />
               </div>
               <h2 className="text-5xl font-black mb-4 text-gradient">Mission Complete!</h2>
               <p className="text-djinn-subtext mb-12 text-lg">Your repository is live and fully compliant with all engineering standards.</p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={repoUrl} target="_blank" rel="noreferrer" className="btn-glow px-10 py-4 rounded-xl font-bold text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5" /> Open Repository
                  </a>
                  <button onClick={() => window.location.href='/github-dashboard'} className="px-10 py-4 rounded-xl border border-djinn-border hover:bg-white/5 text-djinn-subtext font-bold">
                    Return to Hub
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  )
}
