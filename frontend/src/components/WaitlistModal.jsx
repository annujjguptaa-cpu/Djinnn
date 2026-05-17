import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function WaitlistModal({ isOpen, onClose, topicName, wishName }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, submitting, success, error, exists

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('submitting')
    try {
      const res = await axios.post(`${API_BASE}/waitlist`, {
        email,
        wish_name: wishName,
        topic_name: topicName
      })
      
      if (res.data.status === 'already registered') {
        setStatus('exists')
      } else {
        setStatus('success')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 card-glow rounded-2xl border border-djinn-purple/20 bg-djinn-bg shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-djinn-subtext hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto bg-djinn-purple/20 border border-djinn-purple/30 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-djinn-purple-light" size={24} />
              </div>
              <h3 className="text-xl font-bold text-djinn-text mb-2">This wish is being prepared</h3>
              <p className="text-sm text-djinn-subtext">
                "{wishName}" is currently being forged by Djinn. Enter your email to be notified when it launches.
              </p>
            </div>

            {status === 'success' ? (
              <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                Added to waitlist! We'll notify you when it's ready.
              </div>
            ) : status === 'exists' ? (
              <div className="text-center p-4 rounded-xl bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-sm font-medium">
                You're already on the waitlist for this wish!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full btn-glow py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Preparing...' : 'Notify Me'}
                </button>
                {status === 'error' && (
                  <p className="text-xs text-red-400 text-center mt-2">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
