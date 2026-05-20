import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import DiscoverMoreWishes from '../components/DiscoverMoreWishes'
import axios from 'axios'
import { API_BASE } from '../config'

export default function ColdEmailCampaign() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Form State
  const [valueProposition, setValueProposition] = useState('')
  const [campaignGoal, setCampaignGoal] = useState('')
  const [followUpSequence, setFollowUpSequence] = useState(false)
  const [numFollowups, setNumFollowups] = useState(1)
  const [platforms, setPlatforms] = useState(['Gmail'])
  const [prospectFile, setProspectFile] = useState(null)
  const [prospectFileName, setProspectFileName] = useState('')

  // Execution State
  const [wishId, setWishId] = useState(null)
  const [executionState, setExecutionState] = useState('idle') // idle, running, completed, error
  const [currentEntity, setCurrentEntity] = useState('')
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedProspect, setSelectedProspect] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProspectFile(e.target.files[0])
      setProspectFileName(e.target.files[0].name)
    }
  }

  const togglePlatform = (p) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter(item => item !== p))
    } else {
      setPlatforms([...platforms, p])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prospectFile) {
      setErrorMsg('Please upload a prospect list CSV.')
      return
    }
    if (platforms.length === 0) {
      setErrorMsg('Please select at least one channel (Gmail or LinkedIn).')
      return
    }

    setExecutionState('running')
    setErrorMsg('')
    setSelectedProspect(null)

    const formData = new FormData()
    formData.append('value_proposition', valueProposition)
    formData.append('campaign_goal', campaignGoal)
    formData.append('follow_up_sequence', followUpSequence)
    formData.append('num_followups', numFollowups)
    formData.append('platforms', JSON.stringify(platforms))
    formData.append('prospect_list', prospectFile)

    try {
      const res = await axios.post(`${API_BASE}/growth/cold-email`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.status === 'success') {
        setWishId(res.data.wish_id)
      } else {
        throw new Error('Failed to start cold outreach campaign.')
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
        const res = await axios.get(`${API_BASE}/growth/status/${wishId}`)
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
          setErrorMsg('The Cold Outreach script encountered a block.')
          clearInterval(interval)
        }
      } catch (err) {
        console.error('Error polling status:', err)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [wishId, executionState])

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/topic/growth')}
          className="flex items-center gap-2 text-djinn-subtext hover:text-white mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Growth Wish
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium mb-4">
            <Mail size={12} />
            Outbound Cold Emailing
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">Cold Email Campaign</h1>
          <p className="text-djinn-subtext">Summon a Djinn to ingest a prospect list, research their background, write personalized copy, and deploy email sequences.</p>
        </div>

        {executionState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl card-glow bg-[#1a1a2e] border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-djinn-text mb-2">Value Proposition (What are you selling/proposing?)</label>
                <textarea 
                  required 
                  rows={3}
                  placeholder="e.g. We provide fractional CMO services for Web3 companies helping them grow monthly active users by 300%..." 
                  value={valueProposition} 
                  onChange={e => setValueProposition(e.target.value)} 
                  className="input-djinn w-full rounded-2xl p-4 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Campaign Goal / Call-to-Action</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Schedule a 15-minute quick discovery call" 
                    value={campaignGoal} 
                    onChange={e => setCampaignGoal(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Target Channels</label>
                  <div className="flex gap-4 mt-2">
                    {['Gmail', 'LinkedIn'].map((chan) => (
                      <button
                        type="button"
                        key={chan}
                        onClick={() => togglePlatform(chan)}
                        className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                          platforms.includes(chan)
                            ? 'bg-djinn-purple/20 border-djinn-purple/40 text-white shadow-purple-glow'
                            : 'bg-white/5 border-white/10 text-djinn-subtext hover:bg-white/10'
                        }`}
                      >
                        {chan}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 mt-4">
                  <input 
                    type="checkbox" 
                    id="followUp" 
                    checked={followUpSequence} 
                    onChange={e => setFollowUpSequence(e.target.checked)} 
                    className="w-5 h-5 rounded border-white/10 bg-transparent text-djinn-purple focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="followUp" className="text-sm text-djinn-text cursor-pointer select-none">
                    Enable automated follow-up sequence
                  </label>
                </div>
                {followUpSequence && (
                  <div>
                    <label className="block text-sm font-medium text-djinn-text mb-2">Number of Follow Ups ({numFollowups})</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      value={numFollowups} 
                      onChange={e => setNumFollowups(Number(e.target.value))} 
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-djinn-purple mt-4"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-djinn-text mb-2">Upload Prospect List (CSV with Name, Role, Company, Website)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-djinn-purple/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all"
                >
                  <Upload className="text-djinn-subtext mb-2" size={24} />
                  <span className="text-sm text-djinn-text font-medium">
                    {prospectFileName ? prospectFileName : "Drag and drop or click to choose CSV list"}
                  </span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv" 
                  className="hidden" 
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Summon Cold Email Djinn
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
              <h2 className="text-2xl font-black text-djinn-text mb-2">Djinn is Researching and Emailing Prospects</h2>
              <p className="text-djinn-subtext text-sm">Performing profile lookup, extracting content, and scheduling delivery pipelines.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 max-w-md mx-auto border border-white/5">
              <span className="text-xs uppercase tracking-widest text-djinn-purple-light font-bold">Execution Step</span>
              <p className="text-djinn-text font-semibold mt-1">{currentEntity || 'Importing contacts...'}</p>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden max-w-md mx-auto">
              <motion.div 
                className="bg-djinn-purple h-full rounded-full" 
                style={{ width: `${(count / (total || 1)) * 100}%` }}
                layout
              />
            </div>
            <p className="text-djinn-subtext text-xs">Contacted {count} of {total} prospects</p>
          </motion.div>
        )}

        {executionState === 'completed' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="card-glow bg-green-500/5 border border-green-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-djinn-text">Wish Granted!</h2>
                  <p className="text-djinn-subtext text-sm">Cold email campaign has been successfully launched.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">{results.length}</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Prospects Contacted</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">{platforms.join('/')}</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Channels</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-djinn-text">Prospects List</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {results.map((p, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedProspect(p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedProspect?.prospect_name === p.prospect_name
                          ? 'bg-djinn-purple/20 border-djinn-purple/40' 
                          : 'bg-[#1a1a2e] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-djinn-text text-sm">{p.prospect_name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase font-black tracking-wider">
                          Contacted
                        </span>
                      </div>
                      <p className="text-xs text-djinn-subtext mb-1">{p.prospect_role} at {p.prospect_company}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side detail view */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1a2e] border border-white/5 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between">
                  {selectedProspect ? (
                    <div className="space-y-6">
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-2xl font-black text-djinn-text">{selectedProspect.prospect_name}</h3>
                        <p className="text-djinn-purple-light text-sm font-semibold">{selectedProspect.prospect_role} at {selectedProspect.prospect_company}</p>
                        <p className="text-xs text-djinn-subtext mt-1">Delivered via: {selectedProspect.platform}</p>
                      </div>

                      {selectedProspect.message_sent && (
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-black text-djinn-purple-light mb-3">Delivered Copy</h4>
                          <div className="bg-[#121224] rounded-2xl p-5 border border-white/5 text-sm text-djinn-text leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto font-mono italic">
                            "{selectedProspect.message_sent}"
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full my-auto">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <Mail className="text-djinn-subtext" size={28} />
                      </div>
                      <p className="text-djinn-subtext text-sm">Select a prospect from the list to view the customized outreach email content.</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 mt-auto flex justify-between">
                    <button onClick={() => setExecutionState('idle')} className="text-xs text-djinn-purple-light hover:underline font-bold">
                      Run New Campaign
                    </button>
                    <button onClick={() => navigate('/history')} className="text-xs text-djinn-subtext hover:text-white transition-colors">
                      View Wish History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DiscoverMoreWishes currentWish="cold-email" />
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
