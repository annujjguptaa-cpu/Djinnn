import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
import { FolderUp, Sparkles, ShieldCheck, Rocket, Loader2, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, FileText, Layout } from 'lucide-react'

const GitHub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

import { API_BASE as BASE_URL } from '../config'

const API_BASE = `${BASE_URL}/auth/github`

const PersonalPushView = ({ onStepChange }) => {
    const [step, setStep] = useState(1) // 1: Connect, 2: Upload, 3: Success
    const [isConnected, setIsConnected] = useState(false)
    const [path, setPath] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [findings, setFindings] = useState([])
    const [activeSlide, setActiveSlide] = useState(0)

    useEffect(() => {
        // Mock check connection
        const user = new URLSearchParams(window.location.search).get('user')
        if (user) setIsConnected(true)
        if (onStepChange) onStepChange(step)
    }, [step])

    const handlePush = async () => {
        if (!path) return
        setLoading(true)
        setFindings([])
        try {
            const res = await axios.post(`${API_BASE}/push/personal`, { 
                path,
                user_id: '83f2a864' // Demo simplified ID
            })
            if (res.data.status === 'blocked') {
                setFindings(res.data.findings)
            } else {
                setResult(res.data)
                setStep(3)
            }
        } catch (e) { 
            console.error("Summoning failed", e) 
        }
        setLoading(false)
    }

    const handleConnect = () => {
        window.location.href = `${API_BASE}/login?state=83f2a864`
    }

    return (
        <PageWrapper title="Personal Deployment">
            <div className="max-w-4xl mx-auto pt-12">
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
                    <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0, y: -10}} className="text-center py-12">
                        <div className="w-32 h-32 bg-djinn-purple/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-djinn-purple/20">
                            <GitHub className="w-16 h-16 text-djinn-purple-light" />
                        </div>
                        <h2 className="text-4xl font-black mb-4">Step 1: Connect</h2>
                        <p className="text-djinn-subtext mb-12 text-lg">Grant Djinn permission to summon repositories to your account.</p>
                        
                        {isConnected ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="px-8 py-4 bg-green-500/20 text-green-400 rounded-2xl font-bold border border-green-500/30 flex items-center gap-3">
                                    <CheckCircle size={20} /> Identity Verified
                                </div>
                                <button onClick={() => setStep(2)} className="text-djinn-purple-light underline font-bold mt-2">Proceed to Upload →</button>
                            </div>
                        ) : (
                            <button onClick={handleConnect} className="px-12 py-5 bg-djinn-purple hover:bg-djinn-purple-dark rounded-3xl font-black text-xl shadow-purple-glow transition-all active:scale-95 flex items-center gap-3 mx-auto">
                                <GitHub size={24} /> Connect GitHub
                            </button>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-4xl font-black mb-2 text-gradient">Step 2: Upload</h2>
                            <p className="text-djinn-subtext">Drop your project. Djinn figures everything else out.</p>
                        </div>

                        <div 
                           className="group border-2 border-dashed border-djinn-border rounded-[40px] p-24 text-center hover:border-djinn-purple hover:bg-djinn-purple/5 transition-all cursor-pointer relative"
                           onClick={() => document.getElementById('folder-upload').click()}
                        >
                            <input type="file" id="folder-upload" className="hidden" webkitdirectory="" onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    setPath(e.target.files[0].path || 'C:\\Users\\ASUS\\OneDrive\\Desktop\\Djinn') // Demo fallback
                                }
                            }} />
                            <div className="w-32 h-32 bg-djinn-purple/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                <FolderUp className="w-16 h-16 text-djinn-purple-light" />
                            </div>
                            <div className="text-2xl font-black mb-2">{path ? "Project Targeted" : "Select Project Folder"}</div>
                            <p className="text-djinn-subtext">{path || "Drag and drop your project here"}</p>
                            
                            {path && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-8 pt-8 border-t border-djinn-border/30 grid grid-cols-2 gap-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-bold text-djinn-subtext uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-green-500" /> Auto-Gitignore
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-djinn-subtext uppercase tracking-widest">
                                        <Sparkles size={14} className="text-djinn-purple-light" /> AI Readme
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {path && (
                            <button onClick={handlePush} className="w-full py-6 rounded-[24px] bg-djinn-purple hover:bg-djinn-purple-dark text-white font-black text-2xl shadow-purple-glow transition-all active:scale-[0.98] flex items-center justify-center gap-4">
                                <Rocket size={28} /> SUMMON YOUR DJINN
                            </button>
                        )}
                    </motion.div>
                )}

                {step === 3 && result && (
                    <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="text-center max-w-4xl mx-auto pt-8">
                        <div className="text-6xl font-black mb-12 text-green-400 italic">Your wish is granted ✓</div>
                        
                        {/* THE CAROUSEL OF WONDERS */}
                        <div className="relative group mb-12">
                            <div className="absolute -inset-4 bg-djinn-purple/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            
                            <div className="relative card-glow rounded-[40px] p-12 bg-black/60 border border-djinn-border/50 overflow-hidden min-h-[450px]">
                                <AnimatePresence mode="wait">
                                    {activeSlide === 0 ? (
                                        <motion.div 
                                          key="metrics"
                                          initial={{ x: 100, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          exit={{ x: -100, opacity: 0 }}
                                          className="space-y-8"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-djinn-purple/20 rounded-2xl flex items-center justify-center text-djinn-purple-light border border-djinn-purple/30">
                                                    <Layout size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-2xl font-black italic">SUMMON METRICS</h3>
                                                    <p className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Deployment Vital Signs</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 text-left">
                                                <div className="p-6 bg-white/5 rounded-3xl border border-djinn-border">
                                                    <div className="text-djinn-subtext text-[10px] font-bold uppercase mb-1">Repository Name</div>
                                                    <div className="text-xl font-bold truncate">{result.repo_url.split('/').pop()}</div>
                                                </div>
                                                <div className="p-6 bg-white/5 rounded-3xl border border-djinn-border">
                                                    <div className="text-djinn-subtext text-[10px] font-bold uppercase mb-1">Files Pushed</div>
                                                    <div className="text-3xl font-black text-djinn-purple-light">{result.file_count}</div>
                                                </div>
                                                <div className="p-6 bg-white/5 rounded-3xl border border-djinn-border col-span-2">
                                                    <div className="text-djinn-subtext text-[10px] font-bold uppercase mb-1">Access Protocol</div>
                                                    <div className="text-sm font-mono text-green-400">{result.repo_url}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                          key="readme"
                                          initial={{ x: 100, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          exit={{ x: -100, opacity: 0 }}
                                          className="text-left h-full"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-djinn-purple/20 rounded-2xl flex items-center justify-center text-djinn-purple-light border border-djinn-purple/30">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-2xl font-black italic">AI NARRATIVE</h3>
                                                    <p className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Generated README.md Preview</p>
                                                </div>
                                            </div>
                                            <div className="bg-black/50 p-8 rounded-3xl border border-djinn-border h-[250px] overflow-y-auto custom-scrollbar font-mono text-xs text-djinn-subtext whitespace-pre-wrap leading-relaxed">
                                                {result.readme_preview}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Carousel Controls */}
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                    {[0, 1].map(i => (
                                        <button 
                                            key={i} 
                                            onClick={() => setActiveSlide(i)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'bg-djinn-purple w-8' : 'bg-djinn-border'}`} 
                                        />
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => setActiveSlide(prev => prev === 0 ? 1 : 0)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 border border-djinn-border rounded-full flex items-center justify-center hover:bg-djinn-purple hover:border-djinn-purple transition-all"
                                >
                                    {activeSlide === 0 ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={result.repo_url} target="_blank" className="px-12 py-5 bg-white text-black rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                <GitHub className="w-5 h-5" /> View Repository
                            </a>
                            <button className="px-12 py-5 bg-black/40 border border-djinn-border rounded-2xl font-black text-white hover:bg-white/5 transition-all flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-djinn-purple-light" /> New Summon
                            </button>
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
        </PageWrapper>
    )
}

export default PersonalPushView
