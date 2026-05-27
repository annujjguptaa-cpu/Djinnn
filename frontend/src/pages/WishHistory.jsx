import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
import VaultSkeleton from '../components/skeletons/VaultSkeleton'
import { 
  History, 
  Share2, 
  Users, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Search,
  ArrowRight,
  Filter,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { API_BASE } from '../config'

const WishHistory = () => {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [connections, setConnections] = useState([])
  const [opps, setOpps] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const fetchStartTime = useRef<number>(0)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    fetchStartTime.current = Date.now()
    setLoading(true)
    setShowSkeleton(true)
    try {
      const results = await Promise.allSettled([
        axios.get(`${API_BASE}/post`),
        axios.get(`${API_BASE}/connect`),
        axios.get(`${API_BASE}/opportunity`),
        axios.get(`${API_BASE}/growth`)
      ])
      
      if (results[0].status === 'fulfilled') setPosts(results[0].value.data || [])
      if (results[1].status === 'fulfilled') setConnections(results[1].value.data || [])
      if (results[2].status === 'fulfilled') setOpps(results[2].value.data || [])
      if (results[3].status === 'fulfilled') setCampaigns(results[3].value.data || [])
    } catch (err) {
      console.error("Failed to fetch history", err)
    }
    // 300ms minimum display threshold — if data returns faster still show skeleton briefly
    const elapsed = Date.now() - fetchStartTime.current
    const remaining = Math.max(0, 300 - elapsed)
    setTimeout(() => {
      setLoading(false)
      setShowSkeleton(false)
    }, remaining)
  }

  const filteredPosts = posts.filter(p => 
    (p.caption || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.platform || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConns = connections.filter(c => 
    (c.role || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOpps = opps.filter(o => 
    (o.wish_type || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCamps = campaigns.filter(c => 
    (c.campaign_type || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 3-second max skeleton timeout guard
  useEffect(() => {
    const maxTimer = setTimeout(() => setShowSkeleton(false), 3000)
    return () => clearTimeout(maxTimer)
  }, [])

  return (
    <PageWrapper>
      {/* VaultSkeleton fades out, real content fades in */}
      {showSkeleton ? (
        <div style={{ opacity: 1, transition: 'opacity 300ms ease-out' }}>
          <VaultSkeleton />
        </div>
      ) : (
        <div style={{ opacity: 1, transition: 'opacity 300ms ease-out' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-djinn-purple-light mb-4"
            >
              <div className="p-2 rounded-lg bg-djinn-purple/10 border border-djinn-purple/20">
                <History size={20} />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase">Vault of Wishes</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-djinn-text"
            >
              Wish <span className="text-gradient">History</span>
            </motion.h1>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 w-full md:w-80">
            <Search className="text-djinn-subtext ml-2" size={18} />
            <input 
              type="text"
              placeholder="Search your wishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-djinn-text text-sm w-full py-2"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'posts' 
              ? 'bg-djinn-purple text-white shadow-lg shadow-djinn-purple/20' 
              : 'text-djinn-subtext hover:text-djinn-text hover:bg-white/5'
            }`}
          >
            <Share2 size={16} /> Posts
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'connections' 
              ? 'bg-djinn-purple text-white shadow-lg shadow-djinn-purple/20' 
              : 'text-djinn-subtext hover:text-djinn-text hover:bg-white/5'
            }`}
          >
            <Users size={16} /> Connections
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'opportunities' 
              ? 'bg-djinn-purple text-white shadow-lg shadow-djinn-purple/20' 
              : 'text-djinn-subtext hover:text-djinn-text hover:bg-white/5'
            }`}
          >
            <Briefcase size={16} /> Opportunities
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'campaigns' 
              ? 'bg-djinn-purple text-white shadow-lg shadow-djinn-purple/20' 
              : 'text-djinn-subtext hover:text-djinn-text hover:bg-white/5'
            }`}
          >
            <TrendingUp size={16} /> Campaigns
          </button>
        </div>

        {/* Content Area — no more basic pulse, VaultSkeleton shown above while loading */}
        <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activeTab === 'posts' ? (
                filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <PostWishCard key={post.wish_id || post.id} post={post} />
                  ))
                ) : (
                  <EmptyState type="posts" />
                )
              ) : activeTab === 'connections' ? (
                filteredConns.length > 0 ? (
                  filteredConns.map(conn => (
                    <ConnectionWishCard key={conn.wish_id || conn.id} conn={conn} />
                  ))
                ) : (
                  <EmptyState type="connections" />
                )
              ) : activeTab === 'opportunities' ? (
                filteredOpps.length > 0 ? (
                  filteredOpps.map(opp => (
                    <OpportunityWishCard key={opp.id} opp={opp} />
                  ))
                ) : (
                  <EmptyState type="opportunities" />
                )
              ) : (
                filteredCamps.length > 0 ? (
                  filteredCamps.map(camp => (
                    <CampaignWishCard key={camp.id} camp={camp} />
                  ))
                ) : (
                  <EmptyState type="campaigns" />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      )}
    </PageWrapper>
  )
}

const PostWishCard = ({ post }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative bg-[#1a1a2e] border border-white/10 p-6 rounded-3xl overflow-hidden hover:border-djinn-purple/50 transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2 rounded-xl border ${post.platform === 'x' ? 'bg-black border-white/20' : 'bg-blue-600/20 border-blue-400/30'}`}>
        {post.platform === 'x' ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 fill-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        )}
      </div>
      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        post.status === 'granted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-djinn-purple/10 text-djinn-purple-light border border-djinn-purple/20'
      }`}>
        {post.status}
      </div>
    </div>

    <p className="text-djinn-text text-sm line-clamp-3 mb-6 font-medium leading-relaxed italic">
      "{post.caption}"
    </p>

    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="flex items-center gap-2 text-djinn-subtext text-[10px]">
        <Clock size={12} />
        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ancient times'}
      </div>
      <a 
        href={`/wish/${post.wish_id}`}
        className="p-2 rounded-lg bg-white/5 hover:bg-djinn-purple/20 text-djinn-subtext hover:text-djinn-purple-light transition-all"
      >
        <ArrowRight size={16} />
      </a>
    </div>
  </motion.div>
)

const ConnectionWishCard = ({ conn }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative bg-[#1a1a2e] border border-white/10 p-6 rounded-3xl overflow-hidden hover:border-djinn-purple/50 transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-400/30">
        <Users className="text-blue-500" size={20} />
      </div>
      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        conn.status === 'executed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-djinn-purple/10 text-djinn-purple-light border border-djinn-purple/20'
      }`}>
        {conn.status}
      </div>
    </div>

    <div className="mb-6">
      <h4 className="text-djinn-text font-bold text-lg mb-1">{conn.role || 'Any Role'}</h4>
      <p className="text-djinn-subtext text-xs flex items-center gap-1">
        <Filter size={10} /> {conn.location || 'Anywhere'}
      </p>
    </div>

    <p className="text-djinn-subtext text-[11px] line-clamp-2 mb-6 opacity-70 italic">
      Invite: "{conn.message}"
    </p>

    <div className="flex items-center justify-between pt-6 border-t border-white/5">
      <div className="flex items-center gap-2 text-djinn-subtext text-[10px]">
        <Clock size={12} />
        {conn.created_at ? new Date(conn.created_at).toLocaleDateString() : 'Ancient times'}
      </div>
      <a 
        href={`/wish/${conn.wish_id}`}
        className="p-2 rounded-lg bg-white/5 hover:bg-djinn-purple/20 text-djinn-subtext hover:text-djinn-purple-light transition-all"
      >
        <ArrowRight size={16} />
      </a>
    </div>
  </motion.div>
)

const OpportunityWishCard = ({ opp }) => {
  const [expanded, setExpanded] = useState(false)
  const results = opp.results || []

  return (
    <motion.div 
      layout
      className="col-span-full bg-[#1a1a2e] border border-white/10 p-6 rounded-3xl hover:border-djinn-purple/50 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-400/30">
            <Briefcase className="text-purple-400" size={20} />
          </div>
          <div>
            <h4 className="text-djinn-text font-bold text-lg leading-snug">{opp.wish_type}</h4>
            <p className="text-djinn-subtext text-xs">
              Delivered: {opp.total_successful} successful of {opp.total_attempted} targeted
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-djinn-subtext text-xs">
            <Clock size={12} />
            {opp.created_at ? new Date(opp.created_at).toLocaleDateString() : 'Recent'}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              opp.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-djinn-purple/10 text-djinn-purple-light border border-djinn-purple/20'
            }`}>
              {opp.status}
            </span>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-djinn-text transition-all"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 mt-4 pt-4 space-y-4"
          >
            <h5 className="text-xs uppercase tracking-widest font-black text-djinn-purple-light">Application Log</h5>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                {results.map((res, i) => (
                  <div key={i} className="bg-[#121224] p-4 rounded-2xl border border-white/5 text-xs text-djinn-text space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{res.entity_name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-black uppercase tracking-wider">
                        {res.status || 'applied'}
                      </span>
                    </div>
                    <p className="text-djinn-subtext">{res.position_name} • {res.platform}</p>
                    {res.notes && <p className="text-[10px] italic text-djinn-purple-light opacity-80">"{res.notes}"</p>}
                    {res.cover_letter_used && (
                      <details className="mt-2 text-[10px] text-djinn-subtext border-t border-white/5 pt-2">
                        <summary className="cursor-pointer hover:text-white font-bold select-none">View Customized Pitch/Essay</summary>
                        <p className="mt-2 whitespace-pre-wrap leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5 italic">
                          "{res.cover_letter_used}"
                        </p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-djinn-subtext italic">No logged applications found for this execution.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const CampaignWishCard = ({ camp }) => {
  const [expanded, setExpanded] = useState(false)
  const results = camp.results || []

  return (
    <motion.div 
      layout
      className="col-span-full bg-[#1a1a2e] border border-white/10 p-6 rounded-3xl hover:border-djinn-purple/50 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-400/30">
            <TrendingUp className="text-blue-400" size={20} />
          </div>
          <div>
            <h4 className="text-djinn-text font-bold text-lg leading-snug">{camp.campaign_type}</h4>
            <p className="text-djinn-subtext text-xs">
              Outreach: {camp.total_contacted} contacted of {camp.total_prospects} prospects
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-djinn-subtext text-xs">
            <Clock size={12} />
            {camp.created_at ? new Date(camp.created_at).toLocaleDateString() : 'Recent'}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              camp.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-djinn-purple/10 text-djinn-purple-light border border-djinn-purple/20'
            }`}>
              {camp.status}
            </span>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-djinn-text transition-all"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 mt-4 pt-4 space-y-4"
          >
            <h5 className="text-xs uppercase tracking-widest font-black text-djinn-purple-light">Prospects Outreach Log</h5>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                {results.map((res, i) => (
                  <div key={i} className="bg-[#121224] p-4 rounded-2xl border border-white/5 text-xs text-djinn-text space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{res.prospect_name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-black uppercase tracking-wider">
                        Sent
                      </span>
                    </div>
                    <p className="text-djinn-subtext">{res.prospect_role} at {res.prospect_company} • {res.platform}</p>
                    {res.message_sent && (
                      <details className="mt-2 text-[10px] text-djinn-subtext border-t border-white/5 pt-2">
                        <summary className="cursor-pointer hover:text-white font-bold select-none">View Outbound Message</summary>
                        <p className="mt-2 whitespace-pre-wrap leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono italic">
                          "{res.message_sent}"
                        </p>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-djinn-subtext italic">No prospects contacted during this run.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const EmptyState = ({ type }) => (
  <div className="col-span-full py-20 text-center">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
      <Search size={32} className="text-djinn-subtext" />
    </div>
    <h3 className="text-xl font-bold text-djinn-text mb-2">No {type} found</h3>
    <p className="text-djinn-subtext text-sm">You haven't summoned any {type} yet. Time to make a wish!</p>
  </div>
)

export default WishHistory

