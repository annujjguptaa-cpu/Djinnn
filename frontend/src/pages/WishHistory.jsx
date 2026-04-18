import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import PageWrapper from '../components/PageWrapper'
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
  Filter
} from 'lucide-react'

const API_BASE = "http://localhost:8000/api"

const WishHistory = () => {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const [postRes, connRes] = await Promise.all([
        axios.get(`${API_BASE}/post`),
        axios.get(`${API_BASE}/connect`)
      ])
      setPosts(postRes.data)
      setConnections(connRes.data)
    } catch (err) {
      console.error("Failed to fetch history", err)
    }
    setLoading(false)
  }

  const filteredPosts = posts.filter(p => 
    p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.platform?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConns = connections.filter(c => 
    c.role?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageWrapper>
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
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
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
                    <PostWishCard key={post.wish_id} post={post} />
                  ))
                ) : (
                  <EmptyState type="posts" />
                )
              ) : (
                filteredConns.length > 0 ? (
                  filteredConns.map(conn => (
                    <ConnectionWishCard key={conn.wish_id} conn={conn} />
                  ))
                ) : (
                  <EmptyState type="connections" />
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
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
