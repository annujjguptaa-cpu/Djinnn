import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MapPin, MessageSquare, Sparkles, Link2, Copy, Check, ChevronRight } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import axios from 'axios'

import { API_BASE } from '../config'

const InputField = ({ id, label, placeholder, icon: Icon, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-djinn-text mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-djinn-subtext">
        <Icon size={16} />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-djinn w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm"
      />
    </div>
  </div>
)

const PreviewCard = ({ role, location, message }) => (
  <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#1b1b2e]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.6)' }}>
    {/* Header */}
    <div className="p-5 border-b border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-djinn-purple to-djinn-purple-dark flex items-center justify-center text-white font-bold text-lg shadow-purple-glow flex-shrink-0">
          D
        </div>
        <div>
          <div className="text-djinn-text font-semibold text-sm">Djinn User</div>
          <div className="text-djinn-subtext text-xs">AI Action Agent</div>
        </div>
        <button className="ml-auto px-3 py-1.5 rounded-lg bg-[#0a66c2] text-white text-xs font-semibold hover:bg-[#0958a8] transition-colors">
          Connect
        </button>
      </div>
    </div>

    {/* Message preview */}
    <div className="p-5">
      <div className="text-xs text-djinn-subtext mb-3 font-medium uppercase tracking-wider">Connection Request</div>
      <div className="bg-djinn-surface rounded-xl p-4 border border-djinn-border">
        {message ? (
          <p className="text-djinn-text text-sm leading-relaxed">{message}</p>
        ) : (
          <div className="space-y-2">
            <div className="shimmer h-4 rounded w-full" />
            <div className="shimmer h-4 rounded w-4/5" />
            <div className="shimmer h-4 rounded w-3/5" />
          </div>
        )}
      </div>

      {/* Campaign details */}
      {(role || location) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {role && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs">
              <Users size={10} /> {role}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs">
              <MapPin size={10} /> {location}
            </span>
          )}
        </div>
      )}
    </div>

    {/* Stats */}
    <div className="px-5 pb-5 grid grid-cols-3 gap-3">
      {[['~500', 'Target Profiles'], ['85%', 'Accept Rate'], ['2-3x', 'Growth Speed']].map(([val, label]) => (
        <div key={label} className="text-center p-3 rounded-xl bg-djinn-surface border border-djinn-border">
          <div className="text-djinn-purple-light font-bold text-base">{val}</div>
          <div className="text-djinn-subtext text-xs mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  </div>
)

export default function AutoConnect() {
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [wishLink, setWishLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleSummon = async () => {
    if (!role) return
    setIsCreating(true)
    try {
      const res = await axios.post(`${API_BASE}/connect/create`, { role, location, message })
      setWishLink(`${window.location.origin}/wish/${res.data.wish_id}`)
    } catch {
      const id = `connect_${Math.random().toString(36).slice(2, 10)}`
      setWishLink(`${window.location.origin}/wish/${id}`)
    } finally {
      setIsCreating(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(wishLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const progress = [!!role, !!location, !!message].filter(Boolean).length

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium mb-4">
            <Users size={12} />
            Network Automation
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">LinkedIn Auto Connect</h1>
          <p className="text-djinn-subtext">Define your target → Craft your message → Share your campaign link</p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= progress ? 'bg-djinn-purple shadow-purple-glow' : 'bg-djinn-border'}`} />
              ))}
            </div>
            <span className="text-xs text-djinn-subtext">{progress}/3 fields filled</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Form */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <InputField
                id="target-role"
                label="Target Role"
                placeholder="e.g. Software Engineer, Product Manager, Founder"
                icon={Users}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <InputField
                id="target-location"
                label="Location"
                placeholder="e.g. San Francisco, New York, Remote"
                icon={MapPin}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label htmlFor="connect-message" className="block text-sm font-medium text-djinn-text mb-2">
                Personalized Connection Message
              </label>
              <textarea
                id="connect-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi [Name],\n\nI came across your profile and was impressed by your work in [field]. I'd love to connect and explore potential synergies...\n\nBest,\nYour Name`}
                rows={7}
                className="input-djinn w-full rounded-2xl p-4 text-sm resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-djinn-subtext">Tip: Use [Name] and [Company] as dynamic placeholders</p>
                <span className={`text-xs ${message.length > 280 ? 'text-red-400' : 'text-djinn-subtext'}`}>{message.length}/300</span>
              </div>
            </motion.div>

            {/* Quick templates */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <p className="text-xs text-djinn-subtext mb-2 font-medium">Quick Templates</p>
              <div className="flex flex-wrap gap-2">
                {['Sales Outreach', 'Job Seeker', 'Partnership'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      const templates = {
                        'Sales Outreach': `Hi [Name],\n\nI noticed your work at [Company] and thought there might be a great fit. I'd love to share how we've helped similar teams achieve 3x results.\n\nWould you be open to a quick chat?\n\nBest regards`,
                        'Job Seeker': `Hi [Name],\n\nI'm a passionate developer exploring exciting opportunities in the tech space. Your work at [Company] really inspired me and I'd love to connect and learn from your journey.\n\nLooking forward to connecting!`,
                        'Partnership': `Hi [Name],\n\nYour company's mission aligns beautifully with what we're building. I believe there's a genuine opportunity for collaboration that could benefit both our networks.\n\nWould love to explore this with you!`,
                      }
                      setMessage(templates[t])
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-djinn-border text-djinn-subtext text-xs hover:border-djinn-purple/40 hover:text-djinn-purple-light hover:bg-djinn-purple/5 transition-all"
                  >
                    <ChevronRight size={10} />
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Summon button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <motion.button
                id="summon-connect-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSummon}
                disabled={!role || isCreating}
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isCreating ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="inline-block">✨</motion.span> Summoning...</>
                ) : (
                  <><Sparkles size={18} /> Summon Your Djinn</>
                )}
              </motion.button>
            </motion.div>

            {/* Generated Link */}
            <AnimatePresence>
              {wishLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl p-4 border border-djinn-purple/30 bg-djinn-purple/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 size={14} className="text-djinn-purple-light" />
                    <span className="text-sm font-medium text-djinn-purple-light">Your Wish Link is ready!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input readOnly value={wishLink} className="input-djinn flex-1 rounded-xl px-3 py-2 text-xs" />
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink} className="p-2 rounded-xl bg-djinn-purple/20 border border-djinn-purple/30 text-djinn-purple-light hover:bg-djinn-purple/30 transition-colors">
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-medium text-djinn-text mb-2">Campaign Preview</label>
            <PreviewCard role={role} location={location} message={message} />
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
