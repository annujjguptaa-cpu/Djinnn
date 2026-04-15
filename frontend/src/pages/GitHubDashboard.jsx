import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { Users, PieChart, Activity, ExternalLink, Plus, Share2, Filter, MoreVertical, ShieldAlert, CheckCircle2, UserPlus, Link as LinkIcon, Zap } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area 
} from 'recharts'

const GitHub = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const data = [
  { name: 'Mon', repos: 12, compliance: 100 },
  { name: 'Tue', repos: 18, compliance: 94 },
  { name: 'Wed', repos: 15, compliance: 88 },
  { name: 'Thu', repos: 22, compliance: 100 },
  { name: 'Fri', repos: 30, compliance: 96 },
  { name: 'Sat', repos: 8, compliance: 100 },
  { name: 'Sun', repos: 5, compliance: 100 },
]

export default function GitHubDashboard() {
  const [activeTab, setActiveTab] = useState('analytics') // 'analytics', 'team', 'links'
  const [isConnected, setIsConnected] = useState(true)

  const stats = [
    { label: 'Repos Created', value: '112', icon: <GitHub className="w-5 h-5 text-blue-400" />, change: '+12%' },
    { label: 'Compliance Rate', value: '98.2%', icon: <Activity className="w-5 h-5 text-green-400" />, change: '+2.4%' },
    { label: 'Time Saved', value: '450h', icon: <ZapIcon />, change: '+82h' },
  ]

  return (
    <PageWrapper title="Engineering Dashboard" subtitle="Govern your B2B repository workflows with AI-powered precision.">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Sub-navigation Tabs */}
        <div className="flex gap-4 border-b border-djinn-border pb-4">
           {['analytics', 'team', 'links'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-djinn-purple text-white shadow-purple-glow' : 'text-gray-500 hover:text-white'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-glow rounded-3xl p-6 flex flex-col justify-between"
              style={{ background: 'rgba(26,26,46,0.6)' }}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-2xl border border-djinn-border">
                   {s.icon}
                </div>
                <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg">{s.change}</span>
              </div>
              <div className="mt-6">
                <div className="text-djinn-subtext text-xs font-bold uppercase tracking-widest">{s.label}</div>
                <div className="text-4xl font-black mt-1">{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-8">
             <div className="card-glow rounded-3xl p-8" style={{ background: 'rgba(26,26,46,0.6)' }}>
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Activity className="w-5 h-5 text-djinn-purple-light" />
                     Deployment Velocity
                   </h3>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold cursor-pointer">W</span>
                      <span className="px-3 py-1 bg-djinn-purple text-white rounded-lg text-xs font-bold cursor-pointer shadow-purple-glow">M</span>
                   </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2d" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ background: '#0a0a0f', border: '1px solid #1e1e2d', borderRadius: '12px' }}
                            itemStyle={{ color: '#8b5cf6' }}
                        />
                        <Area type="monotone" dataKey="repos" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRepos)" />
                     </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Recent Executions */}
             <div className="card-glow rounded-3xl p-8" style={{ background: 'rgba(26,26,46,0.6)' }}>
                <h3 className="text-xl font-bold mb-6">Recent Workflows</h3>
                <div className="space-y-4">
                   {[
                     { name: 'Core API Template', user: 'Alex G.', status: '100% Compliant', time: '2m ago' },
                     { name: 'React UI Library', user: 'Jamie L.', status: 'Review Required', time: '1h ago' },
                     { name: 'Data Pipeline V2', user: 'Sam K.', status: '100% Compliant', time: '3h ago' },
                   ].map((t, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-djinn-border hover:border-djinn-purple transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-djinn-purple/20 rounded-xl flex items-center justify-center border border-djinn-purple/30">
                              <GitHub className="w-5 h-5 text-djinn-purple-light" />
                           </div>
                           <div>
                              <div className="font-bold text-sm group-hover:text-djinn-purple-light transition-all">{t.name}</div>
                              <div className="text-[10px] text-djinn-subtext">Launched by {t.user} • {t.time}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${t.status.includes('100%') ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{t.status}</span>
                           <ExternalLink className="w-4 h-4 text-djinn-subtext group-hover:text-white transition-all" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar / Org Management */}
          <div className="space-y-8">
             <div className="card-glow rounded-3xl p-8" style={{ background: 'rgba(26,26,46,0.6)' }}>
                <h3 className="text-lg font-bold mb-6 italic text-gradient">Connected Agency</h3>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-djinn-border mb-6">
                   <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                      <img src="https://github.com/github.png" alt="Org" />
                   </div>
                   <div>
                      <div className="font-black text-sm">GitHub Enterprise</div>
                      <div className="text-[10px] text-djinn-subtext">Verified Organization</div>
                   </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-djinn-border text-xs font-bold hover:bg-white/5 transition-all text-djinn-subtext">
                  Switch Organization
                </button>
             </div>

             <div className="card-glow rounded-3xl p-8 border-dashed border-djinn-purple/50" style={{ background: 'rgba(139,92,246,0.05)' }}>
                <h3 className="text-lg font-bold mb-2">New Workflow</h3>
                <p className="text-xs text-djinn-subtext mb-6">Create a new reusable blueprint for your engineering team.</p>
                <button 
                  onClick={() => window.location.href='/workflow-builder'}
                  className="w-full py-4 rounded-xl bg-djinn-purple text-white text-sm font-bold shadow-purple-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Start Building
                </button>
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
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-djinn-purple text-white rounded-xl font-bold text-sm shadow-purple-glow hover:scale-[1.02] transition-all">
                   <UserPlus size={18} /> Add Member
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   { name: 'Sam K.', usage: 8, limit: 10, role: 'Lead Developer', avatar: 'https://i.pravatar.cc/150?u=sam' },
                   { name: 'Alex G.', usage: 12, limit: 20, role: 'Senior Architect', avatar: 'https://i.pravatar.cc/150?u=alex' },
                   { name: 'Jamie L.', usage: 2, limit: 5, role: 'Intern', avatar: 'https://i.pravatar.cc/150?u=jamie' }
                 ].map((m, i) => (
                   <div key={i} className="card-glow p-6 rounded-3xl border border-djinn-border" style={{ background: 'rgba(26,26,46,0.6)' }}>
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-4">
                            <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full border-2 border-djinn-purple" />
                            <div>
                               <div className="font-bold text-lg">{m.name}</div>
                               <div className="text-[10px] text-djinn-subtext font-black uppercase tracking-widest">{m.role}</div>
                            </div>
                         </div>
                         <MoreVertical size={16} className="text-djinn-subtext cursor-pointer hover:text-white transition-colors" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-djinn-subtext">Summons Count</span>
                            <span className="text-djinn-purple-light">{m.usage} / {m.limit}</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(m.usage / m.limit) * 100}%` }}
                              className={`h-full ${m.usage/m.limit > 0.8 ? 'bg-red-500' : 'bg-djinn-purple'}`}
                            />
                         </div>
                      </div>
                   </div>
                 ))}
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
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold italic tracking-tight text-gradient">Magic Link Generator</h3>
                 <div className="text-[10px] text-djinn-subtext font-bold uppercase tracking-widest bg-white/5 border border-djinn-border px-4 py-2 rounded-xl">
                    3 Active Streams
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { type: 'Workflow', icon: <Zap size={24} />, label: 'Standard Push Link', color: '#8b5cf6' },
                   { type: 'Repository', icon: <GitHub className="w-6 h-6" />, label: 'Auto-Fork Link', color: '#3b82f6' },
                   { type: 'Organization', icon: <Users size={24} />, label: 'Team Join Link', color: '#10b981' }
                 ].map((l, i) => (
                   <button key={i} className="card-glow p-8 rounded-[2.5rem] text-center border border-djinn-border hover:border-djinn-purple transition-all group flex flex-col items-center" style={{ background: 'rgba(26,26,46,0.6)' }}>
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500" style={{ backgroundColor: `${l.color}10`, borderColor: `${l.color}20`, color: l.color }}>
                         {l.icon}
                      </div>
                      <div className="font-black text-[10px] uppercase tracking-[0.2em] text-djinn-subtext mb-2">{l.type}</div>
                      <div className="font-bold text-xl mb-8">{l.label}</div>
                      <div className="w-full py-4 bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-djinn-purple group-hover:text-white transition-all shadow-purple-glow">
                         <LinkIcon size={14} /> Generate Magic Link
                      </div>
                   </button>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}

function ZapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}
