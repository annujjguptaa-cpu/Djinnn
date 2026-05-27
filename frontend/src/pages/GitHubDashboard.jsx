import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { API_BASE } from '../config'
import PageWrapper from '../components/PageWrapper'

import { 
  Users, Activity, ExternalLink, Plus, CheckCircle, Clock, 
  ShieldAlert, UserPlus, MoreVertical, Link as LinkIcon, Zap,
  BarChart2, ShieldCheck, TrendingUp, History
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

const GitHub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export default function GitHubDashboard() {
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState({
    total_repos: 0,
    time_saved: '0h 0m',
    compliance_rate: 100,
    recent_activity: []
  })
  const [team, setTeam] = useState([])
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [adminId] = useState('83f2a864') // Demo Admin ID from context

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/github/stats`)
        setStats(res.data)
      } catch (err) {
        console.error('Failed to load stats:', err)
      }
    }

    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/github/team?admin_id=${adminId}`)
        setTeam(res.data.members || [])
      } catch (err) {
        console.error('Failed to load team:', err)
      }
    }

    const fetchLinks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/github/links?admin_id=${adminId}`)
        setLinks(res.data.links || [])
      } catch (err) {
        console.error('Failed to load links:', err)
      }
    }

    fetchStats()
    fetchTeam()
    fetchLinks()
  }, [adminId])

  const handleAddMember = async () => {
    const name = prompt("Enter Member Name:")
    const role = prompt("Enter Role (e.g. Developer, Architect):")
    if (!name || !role) return

    setLoading(true)
    try {
      await axios.post(`${API_BASE}/auth/github/team?admin_id=${adminId}`, {
        name, role, limit: 10
      })
      // Refresh team list
      const res = await axios.get(`${API_BASE}/auth/github/team?admin_id=${adminId}`)
      setTeam(res.data.members || [])
    } catch (err) {
      console.error("Failed to add member:", err)
      alert("Magic failed to add member. Check connectivity.")
    }
    setLoading(false)
  }

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member from the network?")) return
    
    try {
      await axios.delete(`${API_BASE}/auth/github/team/${memberId}`)
      setTeam(prev => prev.filter(m => m.id !== memberId))
    } catch (err) {
      console.error("Failed to delete member:", err)
    }
  }

  const handleActivateStream = async (type, label, color) => {
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/auth/github/links?admin_id=${adminId}`, {
        type, label, color
      })
      alert(`Stream Activated! Magic Link: ${res.data.url}`)
      // Refresh links
      const lRes = await axios.get(`${API_BASE}/auth/github/links?admin_id=${adminId}`)
      setLinks(lRes.data.links || [])
    } catch (err) {
      console.error("Failed to activate stream:", err)
    }
    setLoading(false)
  }

  const chartData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 3 },
  ]

  return (
    <PageWrapper title="GitHub Governance HQ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
           <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black italic tracking-tighter text-white mb-2"
              >
                GOVERNANCE <span className="text-djinn-purple">HQ</span>
              </motion.h1>
              <p className="text-djinn-subtext font-bold text-xs uppercase tracking-[0.3em]">Operational Oversight & Compliance</p>
           </div>
           
           <div className="flex p-1 bg-white/5 rounded-2xl border border-djinn-border">
              {['stats', 'team', 'links'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-djinn-purple text-white shadow-purple-glow' : 'text-djinn-subtext hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Total Summoned Repos', value: stats.total_repos, icon: <BarChart2 />, color: '#8b5cf6' },
                   { label: 'Efficiency Gain', value: stats.time_saved, icon: <TrendingUp size={20} />, color: '#10b981' },
                   { label: 'Compliance Rate', value: `${stats.compliance_rate}%`, icon: <ShieldCheck size={20} />, color: '#3b82f6' }
                 ].map((s, i) => (
                   <div key={i} className="card-glow p-8 rounded-[2rem] border border-djinn-border" style={{ background: 'rgba(26,26,46,0.6)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                         {s.icon}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-djinn-subtext mb-1">{s.label}</div>
                      <div className="text-3xl font-black">{s.value}</div>
                   </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 card-glow p-8 rounded-[2.5rem] border border-djinn-border" style={{ background: 'rgba(26,26,46,0.6)' }}>
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-djinn-subtext flex items-center gap-2">
                          <Activity size={16} className="text-djinn-purple" /> Deployment Velocity
                       </h3>
                    </div>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                             <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                             <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d4d', borderRadius: '12px' }} />
                             <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="card-glow p-8 rounded-[2.5rem] border border-djinn-border" style={{ background: 'rgba(26,26,46,0.6)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-djinn-subtext flex items-center gap-2 mb-8">
                       <History size={16} className="text-djinn-purple" /> Recent Executions
                    </h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {stats.recent_activity.length > 0 ? stats.recent_activity.map((t, idx) => (
                         <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-djinn-border hover:border-djinn-purple transition-all group">
                            <div className="flex items-center gap-4">
                               <div className="w-8 h-8 bg-djinn-purple/20 rounded-lg flex items-center justify-center border border-djinn-purple/30">
                                  <GitHub className="w-4 h-4 text-djinn-purple-light" />
                               </div>
                               <div>
                                  <div className="font-bold text-xs group-hover:text-djinn-purple-light transition-all truncate max-w-[120px]">{t.repo_name || 'Summoning...'}</div>
                                  <div className="text-[10px] text-djinn-subtext">{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Just now'}</div>
                               </div>
                            </div>
                            <CheckCircle className="w-3 h-3 text-green-400" />
                         </div>
                       )) : (
                         <div className="text-center py-12 text-djinn-subtext text-xs italic font-bold">Waiting for your first Summon...</div>
                       )}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div 
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold italic tracking-tight text-gradient">Team Network</h3>
                 <button 
                  onClick={handleAddMember}
                  className="flex items-center gap-2 px-6 py-2.5 bg-djinn-purple text-white rounded-xl font-bold text-sm shadow-purple-glow hover:scale-[1.02] transition-all"
                 >
                   <UserPlus size={18} /> Add Member
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {team.length > 0 ? team.map((m, i) => (
                   <div key={m.id || i} className="card-glow p-6 rounded-3xl border border-djinn-border group relative" style={{ background: 'rgba(26,26,46,0.6)' }}>
                      <button 
                        onClick={() => handleDeleteMember(m.id)}
                        className="absolute top-4 right-4 text-djinn-subtext hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ShieldAlert size={16} />
                      </button>
                      <div className="flex items-center gap-4 mb-6">
                         <img src={m.avatar || 'https://github.com/github.png'} alt={m.name} className="w-12 h-12 rounded-full border-2 border-djinn-purple" />
                         <div>
                            <div className="font-bold text-white mb-1">{m.name}</div>
                            <div className="text-[10px] text-djinn-subtext font-black uppercase tracking-widest">{m.role}</div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-djinn-subtext">Summons</span>
                            <span className="text-djinn-purple-light">{m.usage} / {m.limit}</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(m.usage / m.limit) * 100}%` }}
                              className="h-full bg-djinn-purple"
                           />
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="col-span-3 text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-djinn-border">
                      <Users size={48} className="mx-auto text-djinn-border mb-4 opacity-20" />
                      <div className="text-djinn-subtext font-bold uppercase tracking-widest text-xs">No Team Members Summoned Yet</div>
                   </div>
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div 
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { type: 'workflow', icon: <Zap size={24} />, label: 'Standard Push', color: '#8b5cf6' },
                   { type: 'fork', icon: <GitHub className="w-6 h-6" />, label: 'Auto-Fork', color: '#3b82f6' },
                   { type: 'org', icon: <Users size={24} />, label: 'Org Join', color: '#10b981' }
                 ].map((l, i) => {
                   const activeLinkObj = links.find(link => link.type === l.type)
                   const isActive = !!activeLinkObj
                   return (
                    <div 
                      key={i} 
                      className={`card-glow p-10 rounded-[2.5rem] flex flex-col items-center border border-djinn-border transition-all group ${isActive ? 'border-djinn-purple shadow-purple-glow/20' : 'hover:border-djinn-purple'}`} 
                      style={{ background: 'rgba(26,26,46,0.6)' }}
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${l.color}10`, color: l.color }}>
                          {l.icon}
                        </div>
                        <div className="font-bold text-xl mb-4 text-white">{l.label}</div>
                        <div className="text-[10px] text-djinn-subtext font-bold uppercase tracking-widest mb-8">{isActive ? 'Stream Active' : 'Generate Portal Link'}</div>
                        
                        {isActive ? (
                            <div className="w-full flex items-center justify-between bg-white/5 border border-djinn-purple/30 rounded-xl p-3">
                                <span className="text-xs truncate text-djinn-purple-light mr-2">
                                    {window.location.origin}/share/{activeLinkObj.id}
                                </span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/share/${activeLinkObj.id}`)
                                        alert('Magic Link Copied to Clipboard!')
                                    }}
                                    className="text-[10px] bg-djinn-purple text-white px-3 py-1 rounded hover:scale-[1.05] transition-all uppercase tracking-wider font-bold"
                                >
                                    Copy
                                </button>
                            </div>
                        ) : (
                          <button
                            onClick={() => handleActivateStream(l.type, l.label, l.color)}
                            className="w-full py-4 bg-djinn-purple text-white shadow-purple-glow hover:scale-[1.05] rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                          >
                            Activate Stream
                          </button>
                        )}
                    </div>
                   )
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  )
}
