import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageSquare, CheckCircle, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import DiscoverMoreWishes from '../components/DiscoverMoreWishes'
import axios from 'axios'
import { API_BASE } from '../config'

export default function VCOutreach() {
  const navigate = useNavigate()

  // Form State
  const [startupDescription, setStartupDescription] = useState('')
  const [fundingStage, setFundingStage] = useState('Seed')
  const [industry, setIndustry] = useState('')
  const [geography, setGeography] = useState('')
  const [chequeSize, setChequeSize] = useState('')
  const [numVcs, setNumVcs] = useState(3)
  const [messageTone, setMessageTone] = useState('Bold')

  // Execution State
  const [wishId, setWishId] = useState(null)
  const [executionState, setExecutionState] = useState('idle') // idle, running, completed, error
  const [currentEntity, setCurrentEntity] = useState('')
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedVc, setSelectedVc] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startupDescription.trim()) {
      setErrorMsg('Please describe your startup.')
      return
    }

    setExecutionState('running')
    setErrorMsg('')
    setSelectedVc(null)

    try {
      const res = await axios.post(`${API_BASE}/growth/vc-outreach`, {
        startup_description: startupDescription,
        funding_stage: fundingStage,
        industry: industry,
        geography: geography,
        target_cheque_size: chequeSize,
        num_vcs: numVcs,
        message_tone: messageTone
      })
      if (res.data.status === 'success') {
        setWishId(res.data.wish_id)
      } else {
        throw new Error('Failed to start VC outreach automation.')
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
          setErrorMsg('The VC outreach script encountered a block.')
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
            <TrendingUp size={12} />
            VC Research & Outreach
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">VC Research and Outreach</h1>
          <p className="text-djinn-subtext">Summon a Djinn to scan networks for relevant investors, identify active partners, and draft customized pitch letters.</p>
        </div>

        {executionState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl card-glow bg-[#1a1a2e] border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-djinn-text mb-2">Startup Elevator Pitch / Description</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="e.g. Building an AI-driven contract analysis platform for legal teams that reduces document review times by 80%..." 
                  value={startupDescription} 
                  onChange={e => setStartupDescription(e.target.value)} 
                  className="input-djinn w-full rounded-2xl p-4 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Industry Vertical</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. LegalTech, Generative AI" 
                    value={industry} 
                    onChange={e => setIndustry(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Geography Focus</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. North America & Europe" 
                    value={geography} 
                    onChange={e => setGeography(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Funding Stage</label>
                  <select 
                    value={fundingStage} 
                    onChange={e => setFundingStage(e.target.value)}
                    className="input-djinn w-full rounded-2xl p-4 text-sm bg-[#121224]"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Cheque Size</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. $500k - $1M" 
                    value={chequeSize} 
                    onChange={e => setChequeSize(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Message Tone</label>
                  <select 
                    value={messageTone} 
                    onChange={e => setMessageTone(e.target.value)}
                    className="input-djinn w-full rounded-2xl p-4 text-sm bg-[#121224]"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Bold">Bold / Direct</option>
                    <option value="Data-driven">Data-driven</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Target VCs ({numVcs})</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    value={numVcs} 
                    onChange={e => setNumVcs(Number(e.target.value))} 
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-djinn-purple mt-4"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Summon Investor Outreach Djinn
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
              <h2 className="text-2xl font-black text-djinn-text mb-2">Djinn is Pitching Investors</h2>
              <p className="text-djinn-subtext text-sm">Identifying partner targets and mapping portfolios for the best fit.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 max-w-md mx-auto border border-white/5">
              <span className="text-xs uppercase tracking-widest text-djinn-purple-light font-bold">Outreach Progress</span>
              <p className="text-djinn-text font-semibold mt-1">{currentEntity || 'Connecting to Crunchbase API...'}</p>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden max-w-md mx-auto">
              <motion.div 
                className="bg-djinn-purple h-full rounded-full" 
                style={{ width: `${(count / (total || 1)) * 100}%` }}
                layout
              />
            </div>
            <p className="text-djinn-subtext text-xs">Pitched {count} of {total} firms</p>
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
                  <p className="text-djinn-subtext text-sm">Pitches have been sent to target investors. Previews are ready below.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">{results.length}</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">VCs Researched</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">LinkedIn</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Channel</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-djinn-text">Target VCs</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {results.map((vc, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedVc(vc)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedVc?.prospect_company === vc.prospect_company
                          ? 'bg-djinn-purple/20 border-djinn-purple/40' 
                          : 'bg-[#1a1a2e] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-djinn-text text-sm">{vc.prospect_company}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase font-black tracking-wider">
                          Sent
                        </span>
                      </div>
                      <p className="text-xs text-djinn-subtext mb-1">{vc.prospect_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side detail view */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1a2e] border border-white/5 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between">
                  {selectedVc ? (
                    <div className="space-y-6">
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-2xl font-black text-djinn-text">{selectedVc.prospect_company}</h3>
                        <p className="text-djinn-purple-light text-sm font-semibold">Partner: {selectedVc.prospect_name}</p>
                        <p className="text-xs text-djinn-subtext mt-1">Platform: {selectedVc.platform}</p>
                      </div>

                      {selectedVc.message_sent && (
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-black text-djinn-purple-light mb-3">AI LinkedIn Pitch Message</h4>
                          <div className="bg-[#121224] rounded-2xl p-5 border border-white/5 text-sm text-djinn-text leading-relaxed whitespace-pre-wrap font-mono italic">
                            "{selectedVc.message_sent}"
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full my-auto">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <MessageSquare className="text-djinn-subtext" size={28} />
                      </div>
                      <p className="text-djinn-subtext text-sm">Select a VC firm from the list to view target partner information and the customized pitch.</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 mt-auto flex justify-between">
                    <button onClick={() => setExecutionState('idle')} className="text-xs text-djinn-purple-light hover:underline font-bold">
                      Run Another Pitch Campaign
                    </button>
                    <button onClick={() => navigate('/history')} className="text-xs text-djinn-subtext hover:text-white transition-colors">
                      View Wish History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DiscoverMoreWishes currentWish="vc-outreach" />
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
