import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FolderUp, Sparkles, ShieldCheck, Rocket, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

const GitHub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const API_BASE = 'http://localhost:8000/api/auth/github'

const PersonalPushView = () => {
    const [step, setStep] = useState(1) // 1: Detect, 2: Review/Gen, 3: Success
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [findings, setFindings] = useState([])

    useEffect(() => {
        detectProjects()
    }, [])

    const detectProjects = async () => {
        try {
            const res = await axios.get(`${API_BASE}/detect-projects`)
            setProjects(res.data.projects || [])
        } catch (e) { console.error("Detection failed", e) }
    }

    const summonDjinn = async (path) => {
        setLoading(true)
        setFindings([])
        try {
            const res = await axios.post(`${API_BASE}/push/personal`, { path })
            if (res.data.status === 'blocked') {
                setFindings(res.data.findings)
                setStep(2)
            } else {
                setResult(res.data)
                setStep(3)
            }
        } catch (e) { console.error("Summoning failed", e) }
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-12 px-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-djinn-border -translate-y-1/2 -z-10" />
                {[1, 2, 3].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= i ? 'bg-djinn-purple border-djinn-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-djinn-bg border-djinn-border text-gray-500'}`}>
                        {i === 1 && <FolderUp size={18} />}
                        {i === 2 && <Sparkles size={18} />}
                        {i === 3 && <Rocket size={18} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid gap-6">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold mb-2">Select Your Project</h2>
                            <p className="text-gray-400">Djinn detected your recent IDE workspaces automatically.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.map(p => (
                                <button key={p.path} onClick={() => { setSelectedProject(p); summonDjinn(p.path); }} 
                                    className="p-6 bg-white/5 border border-djinn-border rounded-3xl text-left hover:border-djinn-purple hover:bg-djinn-purple/5 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="text-djinn-purple-light animate-pulse" />
                                    </div>
                                    <div className="font-bold text-lg mb-1">{p.name}</div>
                                    <div className="text-xs text-gray-500 truncate mb-4">{p.path}</div>
                                    <div className="flex items-center gap-2 text-djinn-purple-light text-sm font-semibold italic">
                                        Summon this project →
                                    </div>
                                </button>
                            ))}
                            <button className="p-6 bg-white/5 border border-dashed border-djinn-border rounded-3xl text-center hover:border-djinn-purple transition-all flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-white">
                                <FolderUp size={32} />
                                <span className="text-sm font-semibold uppercase tracking-widest">Manual Folder Fallback</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && findings.length > 0 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl text-center">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Guardian Blocked the Push!</h2>
                        <p className="text-gray-400 mb-8">Sensitive secrets or API keys were detected in your code. Purge them to continue.</p>
                        <div className="grid gap-3 text-left mb-8">
                            {findings.map((f, i) => (
                                <div key={i} className="p-4 bg-black/40 rounded-xl border border-red-500/20 flex gap-4 items-center">
                                    <ShieldCheck className="text-red-500" size={20} />
                                    <div>
                                        <div className="text-sm font-bold">{f.file} (Line {f.line})</div>
                                        <div className="text-xs text-red-300 italic">{f.type}: {f.snippet}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep(1)} className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-all">Back to Safety</button>
                    </motion.div>
                )}

                {step === 3 && result && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <CheckCircle className="text-green-500" size={48} />
                        </div>
                        <h2 className="text-4xl font-bold mb-2">Mission Accomplished</h2>
                        <p className="text-gray-400 mb-8">The Djinn has summoned your project to its new home on GitHub.</p>
                        
                        <div className="bg-white/5 border border-djinn-border p-8 rounded-3xl mb-8 text-left max-h-[400px] overflow-y-auto custom-scrollbar">
                            <h3 className="text-djinn-purple-light font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={16} /> AI-Generated README.md
                            </h3>
                            <div className="prose prose-invert max-w-none text-sm text-gray-300">
                                {result.readme_preview.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <a href={result.repo_url} target="_blank" className="px-12 py-4 bg-djinn-purple hover:bg-djinn-purple-dark rounded-2xl font-bold shadow-lg shadow-djinn-purple/20 transition-all flex items-center gap-2">
                                <GitHub className="w-5 h-5 text-white" /> View on GitHub
                            </a>
                            <button onClick={() => setStep(1)} className="px-12 py-4 bg-white/5 border border-djinn-border hover:bg-white/10 rounded-2xl font-bold transition-all">New Summon</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 className="text-djinn-purple" size={64} />
                    </motion.div>
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-6 text-xl font-bold italic tracking-widest text-djinn-purple-light animate-pulse">
                        IGNITING MAGIC...
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default PersonalPushView
