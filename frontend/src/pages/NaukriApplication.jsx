import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import WishGrantedSkeleton from '../components/skeletons/WishGrantedSkeleton'
import axios from 'axios'
import { API_BASE } from '../config'

export default function NaukriApplication() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Form State
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('Mid')
  const [industry, setIndustry] = useState('')
  const [maxApplications, setMaxApplications] = useState(5)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeFileName, setResumeFileName] = useState('')

  // Execution State
  const [wishId, setWishId] = useState(null)
  const [executionState, setExecutionState] = useState('idle') // idle, running, completed, error
  const [currentEntity, setCurrentEntity] = useState('')
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [grantedLoading, setGrantedLoading] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
      setResumeFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile) {
      setErrorMsg('Please upload your resume.')
      return
    }

    setExecutionState('running')
    setErrorMsg('')
    setSelectedApp(null)

    const formData = new FormData()
    formData.append('job_title', jobTitle)
    formData.append('location', location)
    formData.append('experience_level', experienceLevel)
    formData.append('industry', industry)
    formData.append('max_applications', maxApplications)
    formData.append('resume', resumeFile)

    try {
      const res = await axios.post(`${API_BASE}/opportunity/apply-naukri`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.status === 'success') {
        setWishId(res.data.wish_id)
      } else {
        throw new Error('Failed to start application automation.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err.response?.data?.detail || 'Mystical API connection failure.')
      setExecutionState('error')
    }
  }

  useEffect(() => {
    if (!wishId || executionState !== 'running') return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/opportunity/status/${wishId}`)
        const data = res.data
        setCurrentEntity(data.current_entity)
        setCount(data.count)
        setTotal(data.total)
        setResults(data.results || [])

        if (data.status === 'completed') {
          setExecutionState('completed')
          clearInterval(interval)
        } else if (data.status === 'failed') {
          setExecutionState('error')
          setErrorMsg('The automation script encountered a block.')
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Error polling status:', err)
      }
    }, 1500)

    // Show WishGrantedSkeleton briefly (400ms) when results first appear
  useEffect(() => {
    if (executionState === 'completed') {
      setGrantedLoading(true)
      const t = setTimeout(() => setGrantedLoading(false), 400)
      return () => clearTimeout(t)
    }
  }, [executionState])

  return () => clearInterval(interval)
  }, [wishId, executionState])

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/topic/opportunity')}
          className="flex items-center gap-2 text-djinn-subtext hover:text-white mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Opportunity Wish
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium mb-4">
            <Sparkles size={12} />
            Naukri Job Automation
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">Auto Apply Naukri Jobs</h1>
          <p className="text-djinn-subtext">Summon a Djinn to scan, map, and mass-apply to relevant jobs listed on the Naukri platform.</p>
        </div>

        {executionState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl card-glow bg-[#1a1a2e] border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Job Title / Role</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Frontend Developer" 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Location</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Bangalore, India" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Experience Level</label>
                  <select 
                    value={experienceLevel} 
                    onChange={e => setExperienceLevel(e.target.value)}
                    className="input-djinn w-full rounded-2xl p-4 text-sm bg-[#121224]"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Lead">Lead / Principal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Industry Sector</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. IT Software, FinTech" 
                    value={industry} 
                    onChange={e => setIndustry(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Max Applications ({maxApplications})</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={maxApplications} 
                    onChange={e => setMaxApplications(Number(e.target.value))} 
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-djinn-purple mt-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-djinn-text mb-2">Upload Resume (PDF, DOCX, TXT)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-djinn-purple/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all"
                >
                  <Upload className="text-djinn-subtext mb-2" size={24} />
                  <span className="text-sm text-djinn-text font-medium">
                    {resumeFileName ? resumeFileName : "Drag and drop or click to choose resume"}
                  </span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Summon Naukri Djinn
              </motion.button>
            </form>
          </motion.div>
        )}

        {executionState === 'running' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl card-glow bg-[#1a1a2e] border border-white/5 rounded-3xl p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-t-djinn-purple border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-purple-glow"
                />
                <span className="text-3xl">🪔</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-djinn-text mb-2">Djinn is Mass Applying on Naukri</h2>
              <p className="text-djinn-subtext text-sm">Automating forms and submitting updated resumes.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 max-w-md mx-auto border border-white/5">
              <span className="text-xs uppercase tracking-widest text-djinn-purple-light font-bold">Automation Status</span>
              <p className="text-djinn-text font-semibold mt-1">{currentEntity || 'Connecting to FastForward...'}</p>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden max-w-md mx-auto">
              <motion.div 
                className="bg-djinn-purple h-full rounded-full" 
                style={{ width: `${(count / (total || 1)) * 100}%` }}
                layout
              />
            </div>
            <p className="text-djinn-subtext text-xs">Submitted {count} of {total} applications</p>
          </motion.div>
        )}

        {executionState === 'completed' && (
          grantedLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <WishGrantedSkeleton />
            </motion.div>
          ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="card-glow bg-green-500/5 border border-green-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-djinn-text">Wish Granted!</h2>
                  <p className="text-djinn-subtext text-sm">All Naukri applications have been successfully delivered.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">{results.length}</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Applications</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">Naukri</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Platform</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-djinn-text">Applied Companies</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {results.map((app, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedApp?.entity_name === app.entity_name
                          ? 'bg-djinn-purple/20 border-djinn-purple/40' 
                          : 'bg-[#1a1a2e] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-djinn-text text-sm">{app.entity_name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase font-black tracking-wider">
                          Applied
                        </span>
                      </div>
                      <p className="text-xs text-djinn-subtext mb-1">{app.position_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side detail view */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1a2e] border border-white/5 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between">
                  {selectedApp ? (
                    <div className="space-y-6">
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-2xl font-black text-djinn-text">{selectedApp.entity_name}</h3>
                        <p className="text-djinn-purple-light text-sm font-semibold">{selectedApp.position_name}</p>
                        <p className="text-xs text-djinn-subtext mt-2 font-medium bg-[#121224] p-4 rounded-2xl border border-white/5">
                          {selectedApp.notes}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-djinn-purple/5 border border-djinn-purple/10 rounded-2xl text-xs text-djinn-purple-light leading-relaxed">
                        ✨ Naukri profiles were updated with the uploaded resume, and applications were priority routed using fast-apply algorithms.
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full my-auto">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <FileText className="text-djinn-subtext" size={28} />
                      </div>
                      <p className="text-djinn-subtext text-sm">Select a company from the list to view the submission details and notes.</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 mt-auto flex justify-between">
                    <button onClick={() => setExecutionState('idle')} className="text-xs text-djinn-purple-light hover:underline font-bold">
                      Run Another Campaign
                    </button>
                    <button onClick={() => navigate('/history')} className="text-xs text-djinn-subtext hover:text-white transition-colors">
                      View Wish History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DiscoverMoreWishes currentWish="naukri-jobs" />
          </motion.div>
        )}

        {executionState === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl card-glow bg-red-500/5 border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-djinn-text mb-2">Mystical Block Occurred</h2>
              <p className="text-red-400 text-sm">{errorMsg}</p>
            </div>
            <button onClick={() => setExecutionState('idle')} className="btn-glow px-6 py-3 rounded-xl font-bold text-white text-sm">
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}
