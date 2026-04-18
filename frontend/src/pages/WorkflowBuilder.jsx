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
    readme_format: 'Standard Corporate (Claude 3.5)',
    folder_structure: ['src', 'tests', 'docs'],
    gitignore_rules: ['node_modules', '.env', '__pycache__'],
    license_type: 'MIT',
    branch_protection: true,
    collaborators: ['@engineering-security'],
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
                <div className="space-y-8">
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-4 tracking-widest">Required Folder Tree</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.folder_structure.map(f => (
                        <div key={f} className="px-4 py-2 bg-djinn-purple/10 text-djinn-purple-light border border-djinn-purple/30 rounded-xl text-sm font-bold flex items-center gap-2">
                           {f}
                           <button onClick={() => setFormData({...formData, folder_structure: formData.folder_structure.filter(item => item !== f)})} className="hover:text-white">×</button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const f = prompt("Enter folder name:");
                          if (f) setFormData({...formData, folder_structure: [...formData.folder_structure, f]})
                        }}
                        className="px-4 py-2 bg-white/5 border border-dashed border-djinn-border rounded-xl text-sm text-djinn-subtext hover:border-djinn-purple hover:text-white transition-all"
                      >
                        + Add Folder
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-4 tracking-widest">Forbidden / .gitignore Rules</label>
                    <div className="flex flex-wrap gap-3">
                       {formData.gitignore_rules.map(r => (
                        <div key={r} className="px-4 py-2 bg-red-400/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold flex items-center gap-2">
                          {r}
                          <button onClick={() => setFormData({...formData, gitignore_rules: formData.gitignore_rules.filter(item => item !== r)})} className="hover:text-white">×</button>
                        </div>
                      ))}
                      <button 
                         onClick={() => {
                           const r = prompt("Enter rule:");
                           if (r) setFormData({...formData, gitignore_rules: [...formData.gitignore_rules, r]})
                         }}
                         className="px-4 py-2 bg-white/5 border border-dashed border-djinn-border rounded-xl text-sm text-djinn-subtext hover:border-red-500 hover:text-white transition-all"
                      >
                        + Add Rule
                      </button>
                    </div>
                  </div>

                  <div>
                     <label className="block text-djinn-subtext text-xs font-bold uppercase mb-2 tracking-widest">Default License</label>
                     <div className="flex gap-4">
                        {['MIT', 'Apache 2.0', 'GPL v3'].map(l => (
                          <button 
                            key={l}
                            onClick={() => setFormData({...formData, license_type: l})}
                            className={`px-6 py-2 rounded-xl border font-bold transition-all text-sm ${formData.license_type === l ? 'bg-djinn-purple border-djinn-purple shadow-purple-glow' : 'border-djinn-border text-djinn-subtext hover:text-white'}`}
                          >
                            {l}
                          </button>
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
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-[24px] border border-djinn-border group hover:border-djinn-purple/50 transition-all">
                    <div>
                      <h4 className="font-black text-lg group-hover:text-djinn-purple-light transition-colors">Branch Protection</h4>
                      <p className="text-sm text-djinn-subtext">Automatically enforce code reviews and status checks on the main branch.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, branch_protection: !formData.branch_protection})}
                      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.branch_protection ? 'bg-djinn-purple shadow-purple-glow' : 'bg-djinn-border'}`}
                    >
                       <motion.div 
                         className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
                         animate={{ x: formData.branch_protection ? 24 : 0 }}
                       />
                    </button>
                  </div>

                  <div>
                    <label className="block text-djinn-subtext text-xs font-bold uppercase mb-4 tracking-widest">Global Collaborators (Auto-Invite)</label>
                    <div className="flex flex-wrap gap-2 mb-4 text-xs font-mono text-djinn-purple-light italic">
                        {formData.collaborators.join(', ')}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            id="new-collab"
                            placeholder="username or team-slug"
                            className="flex-1 bg-black/40 border border-djinn-border rounded-xl px-4 py-3 text-white focus:border-djinn-purple outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setFormData({...formData, collaborators: [...formData.collaborators, e.target.value]});
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button 
                            onClick={() => {
                                const input = document.getElementById('new-collab');
                                if (input.value) {
                                    setFormData({...formData, collaborators: [...formData.collaborators, input.value]});
                                    input.value = '';
                                }
                            }}
                            className="px-6 py-3 bg-white/5 border border-djinn-border rounded-xl font-bold hover:bg-djinn-purple transition-all"
                        >
                            Invite
                        </button>
                    </div>
                  </div>

                  <div className="p-4 bg-djinn-purple/10 border border-djinn-purple/20 rounded-2xl flex items-start gap-4">
                     <ShieldCheck className="text-djinn-purple-light shrink-0" size={24} />
                     <p className="text-xs text-djinn-subtext leading-relaxed">
                        <span className="text-djinn-purple-light font-bold">Hard Security Layer:</span> Every push summoned with this blueprint will be scanned by the Guardian for secrets before hitting GitHub.
                     </p>
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
