import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
import { Settings, FileCode, Users, ShieldCheck, Zap } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function WorkflowBuilder() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    readme_format: 'standard',
    folder_structure: ['src', 'tests', 'docs'],
    gitignore_rules: ['node_modules', '.env'],
    license_type: 'MIT',
    branch_protection: true,
    collaborators: [],
    portal_name: '',
    logo_url: ''
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/workflow/create`, formData)
      setResult(res.data)
      setStep(4)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { title: 'Identity', icon: <Settings className="w-5 h-5" /> },
    { title: 'Structure', icon: <FileCode className="w-5 h-5" /> },
    { title: 'Security', icon: <ShieldCheck className="w-5 h-5" /> },
    { title: 'Summoned', icon: <Zap className="w-5 h-5" /> }
  ]

  return (
    <PageWrapper title="Workflow Builder" subtitle="Engineer the blueprints for your organization's success.">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-12 px-10">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= idx + 1 ? 'bg-djinn-purple text-white shadow-purple-glow' : 'bg-djinn-border text-djinn-subtext'
              }`}>
                {s.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${step >= idx + 1 ? 'text-djinn-purple-light' : 'text-djinn-subtext'}`}>
                {s.title}
              </span>
            </div>
          ))}
          <div className="absolute top-[170px] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[2px] bg-djinn-border -z-0">
             <motion.div 
               className="h-full bg-djinn-purple"
               initial={{ width: '0%' }}
               animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
             />
          </div>
        </div>

        <div className="card-glow rounded-3xl p-10 min-h-[500px] flex flex-col justify-between" style={{ background: 'rgba(26,26,46,0.6)' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-6 italic text-gradient">Define Template Identity</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Workflow Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Standard React Microservice"
                      className="w-full bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-djinn-purple transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                     <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">README Engine Preference</label>
                     <select className="w-full bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:outline-none">
                        <option>Standard Corporate (Claude Optimized)</option>
                        <option>Geeks-only (Gemini Optimized)</option>
                        <option>Minimalist</option>
                     </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Portal Name (White-Label)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Acme Labs Portal"
                        className="w-full bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-djinn-purple"
                        value={formData.portal_name}
                        onChange={e => setFormData({...formData, portal_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Custom Logo URL</label>
                      <input 
                        type="text" 
                        placeholder="https://company.com/logo.png"
                        className="w-full bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-djinn-purple"
                        value={formData.logo_url}
                        onChange={e => setFormData({...formData, logo_url: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-6 italic text-gradient">Project Architecture</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Required Folders</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.folder_structure.map(f => (
                        <span key={f} className="px-3 py-1 bg-djinn-purple/20 text-djinn-purple-light border border-djinn-purple/30 rounded-lg text-sm">{f}</span>
                      ))}
                      <button className="px-3 py-1 bg-white/5 border border-dashed border-djinn-border rounded-lg text-sm hover:bg-white/10">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Global .gitignore Rules</label>
                    <div className="flex flex-wrap gap-2">
                       {formData.gitignore_rules.map(r => (
                        <span key={r} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl font-black mb-6 italic text-gradient">Governance & Security</h2>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-djinn-border">
                    <div>
                      <h4 className="font-bold">Branch Protection</h4>
                      <p className="text-xs text-djinn-subtext">Enforce code reviews and status checks on main branch.</p>
                    </div>
                    <div className="w-12 h-6 bg-djinn-purple rounded-full relative cursor-pointer">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2">Global Collaborators (Teams)</label>
                    <input 
                      type="text" 
                      placeholder="@engineering-security, @djinn-bots"
                      className="w-full bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-24 h-24 bg-djinn-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-purple-glow-lg">
                   <Zap className="w-12 h-12 text-white fill-white" />
                </div>
                <h2 className="text-4xl font-black mb-2 text-gradient italic">Blueprint Summoned!</h2>
                <p className="text-djinn-subtext mb-8">Your reusable workflow is active and ready for engineering deployments.</p>
                <div className="bg-black/30 p-4 rounded-xl border border-djinn-border flex items-center justify-between">
                   <span className="text-xs font-mono text-djinn-purple-light">{window.location.origin}/github/push/{result.workflow_id}</span>
                   <button className="text-xs font-bold hover:text-white transition-all">COPY LINK</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-4 mt-12 border-t border-djinn-border pt-8">
            {step < 4 && step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-8 py-3 rounded-xl border border-djinn-border font-bold hover:bg-white/5 transition-all text-djinn-subtext">
                Back
              </button>
            )}
            {step < 3 && (
              <button onClick={() => setStep(step + 1)} className="btn-glow px-10 py-3 rounded-xl font-bold text-white">
                Next Stage
              </button>
            )}
            {step === 3 && (
              <button onClick={handleSubmit} disabled={loading} className="btn-glow px-10 py-3 rounded-xl font-bold text-white">
                {loading ? 'Summoning...' : 'Complete Blueprint'}
              </button>
            )}
            {step === 4 && (
               <button onClick={() => window.location.href='/github-dashboard'} className="btn-glow px-10 py-3 rounded-xl font-bold text-white">
                 View Dashboard
               </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
