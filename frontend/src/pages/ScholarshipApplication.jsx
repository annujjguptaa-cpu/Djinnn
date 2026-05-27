import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, FileText, CheckCircle, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import WishGrantedSkeleton from '../components/skeletons/WishGrantedSkeleton'
import axios from 'axios'
import { API_BASE } from '../config'

export default function ScholarshipApplication() {
  const navigate = useNavigate()

  // Form State
  const [studentProfile, setStudentProfile] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [educationLevel, setEducationLevel] = useState("Master's")
  const [countryPreference, setCountryPreference] = useState('')
  const [nationality, setNationality] = useState('')
  const [financialNeed, setFinancialNeed] = useState(false)
  const [meritBased, setMeritBased] = useState(true)
  const [maxApplications, setMaxApplications] = useState(3)

  // Execution State
  const [wishId, setWishId] = useState(null)
  const [executionState, setExecutionState] = useState('idle') // idle, running, completed, error
  const [currentEntity, setCurrentEntity] = useState('')
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedSchol, setSelectedSchol] = useState(null)
  const [grantedLoading, setGrantedLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!studentProfile.trim()) {
      setErrorMsg('Please describe your student profile.')
      return
    }

    setExecutionState('running')
    setErrorMsg('')
    setSelectedSchol(null)

    try {
      const res = await axios.post(`${API_BASE}/opportunity/apply-scholarships`, {
        student_profile: studentProfile,
        field_of_study: fieldOfStudy,
        education_level: educationLevel,
        country_preference: countryPreference,
        nationality: nationality,
        financial_need: financialNeed,
        merit_based: meritBased,
        max_applications: maxApplications
      })
      if (res.data.status === 'success') {
        setWishId(res.data.wish_id)
      } else {
        throw new Error('Failed to start scholarship automation.')
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

    return () => clearInterval(interval)
  }, [wishId, executionState])

  // Show WishGrantedSkeleton briefly (400ms) when results first appear
  useEffect(() => {
    if (executionState === 'completed') {
      setGrantedLoading(true)
      const t = setTimeout(() => setGrantedLoading(false), 400)
      return () => clearTimeout(t)
    }
  }, [executionState])


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
            <GraduationCap size={12} />
            Scholarship Finder & Auto-Apply
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">Scholarship Application Automation</h1>
          <p className="text-djinn-subtext">Summon a Djinn to scan world databases, evaluate matching fit scores, and write tailored essays.</p>
        </div>

        {executionState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl card-glow bg-[#1a1a2e] border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-djinn-text mb-2">Student Profile / Achievements</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="e.g. GPA 3.9, Bachelor's in CS, published 1 research paper, 2 years volunteer experience, passionate about AI ethics..." 
                  value={studentProfile} 
                  onChange={e => setStudentProfile(e.target.value)} 
                  className="input-djinn w-full rounded-2xl p-4 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Field of Study</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Environmental Science" 
                    value={fieldOfStudy} 
                    onChange={e => setFieldOfStudy(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Target Country Preference</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. United Kingdom" 
                    value={countryPreference} 
                    onChange={e => setCountryPreference(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Education Level</label>
                  <select 
                    value={educationLevel} 
                    onChange={e => setEducationLevel(e.target.value)}
                    className="input-djinn w-full rounded-2xl p-4 text-sm bg-[#121224]"
                  >
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="PhD">PhD / Doctorate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Nationality</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Indian" 
                    value={nationality} 
                    onChange={e => setNationality(e.target.value)} 
                    className="input-djinn w-full rounded-2xl p-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-djinn-text mb-2">Max Applications ({maxApplications})</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    value={maxApplications} 
                    onChange={e => setMaxApplications(Number(e.target.value))} 
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-djinn-purple mt-4"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="financialNeed" 
                    checked={financialNeed} 
                    onChange={e => setFinancialNeed(e.target.checked)} 
                    className="w-5 h-5 rounded border-white/10 bg-transparent text-djinn-purple focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="financialNeed" className="text-sm text-djinn-text cursor-pointer select-none">
                    Financial Need Based
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="meritBased" 
                    checked={meritBased} 
                    onChange={e => setMeritBased(e.target.checked)} 
                    className="w-5 h-5 rounded border-white/10 bg-transparent text-djinn-purple focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="meritBased" className="text-sm text-djinn-text cursor-pointer select-none">
                    Merit Based Academic
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Summon Scholarship Djinn
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
              <h2 className="text-2xl font-black text-djinn-text mb-2">Evaluating & Applying to Scholarships</h2>
              <p className="text-djinn-subtext text-sm">Djinn is analyzing criteria, matching profiles, and writing customized essays.</p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 max-w-md mx-auto border border-white/5">
              <span className="text-xs uppercase tracking-widest text-djinn-purple-light font-bold">Current Action</span>
              <p className="text-djinn-text font-semibold mt-1">{currentEntity || 'Connecting to scholarship databases...'}</p>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden max-w-md mx-auto">
              <motion.div 
                className="bg-djinn-purple h-full rounded-full" 
                style={{ width: `${(count / (total || 1)) * 100}%` }}
                layout
              />
            </div>
            <p className="text-djinn-subtext text-xs">Evaluated {count} of {total} scholarships</p>
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
                  <p className="text-djinn-subtext text-sm">Target scholarships matched, and applications with customized essays have been prepared.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">{results.length}</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Scholarships</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-djinn-text">Global</span>
                  <span className="text-[10px] text-djinn-subtext uppercase tracking-widest font-bold">Portals</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left side list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-djinn-text">Matching Scholarships</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {results.map((schol, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedSchol(schol)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedSchol?.position_name === schol.position_name
                          ? 'bg-djinn-purple/20 border-djinn-purple/40' 
                          : 'bg-[#1a1a2e] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-djinn-text text-sm leading-snug">{schol.position_name}</h4>
                      </div>
                      <p className="text-xs text-djinn-subtext mb-2">{schol.entity_name}</p>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-djinn-purple/20 text-djinn-purple-light border border-djinn-purple/30 uppercase font-black tracking-wider">
                        {schol.notes.split("fit score of ")[1] ? `Fit Score: ${schol.notes.split("fit score of ")[1]}` : 'High Fit'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side detail view */}
              <div className="lg:col-span-2">
                <div className="bg-[#1a1a2e] border border-white/5 rounded-3xl p-6 min-h-[450px] flex flex-col justify-between">
                  {selectedSchol ? (
                    <div className="space-y-6">
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-2xl font-black text-djinn-text">{selectedSchol.position_name}</h3>
                        <p className="text-djinn-purple-light text-sm font-semibold">{selectedSchol.entity_name}</p>
                        <p className="text-xs text-djinn-subtext mt-1">{selectedSchol.notes}</p>
                      </div>

                      {selectedSchol.cover_letter_used && (
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-black text-djinn-purple-light mb-3">AI Crafted Admission Essay</h4>
                          <div className="bg-[#121224] rounded-2xl p-5 border border-white/5 text-sm text-djinn-text leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto font-serif italic">
                            "{selectedSchol.cover_letter_used}"
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full my-auto">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <FileText className="text-djinn-subtext" size={28} />
                      </div>
                      <p className="text-djinn-subtext text-sm">Select a scholarship from the list to view eligibility details and the generated essay.</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/5 mt-auto flex justify-between">
                    <button onClick={() => setExecutionState('idle')} className="text-xs text-djinn-purple-light hover:underline font-bold">
                      Run New Evaluation
                    </button>
                    <button onClick={() => navigate('/history')} className="text-xs text-djinn-subtext hover:text-white transition-colors">
                      View Wish History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DiscoverMoreWishes currentWish="scholarships" />
          </motion.div>
          )
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
