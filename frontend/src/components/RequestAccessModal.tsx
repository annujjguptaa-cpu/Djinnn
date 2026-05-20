import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import axios from 'axios'
import { API_BASE } from '../config'

interface RequestAccessModalProps {
  isOpen: boolean
  onClose: () => void
  wishName: string
  wishTopic: string
}

type PlanType = 'Personal' | 'Startup' | 'Agency' | 'Enterprise'

export default function RequestAccessModal({ isOpen, onClose, wishName, wishTopic }: RequestAccessModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [useCaseDescription, setUseCaseDescription] = useState('')
  const [planInterest, setPlanInterest] = useState<PlanType>('Personal')
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !organisation || !useCaseDescription || !planInterest) {
      setErrorMessage('All fields are required.')
      return
    }

    if (useCaseDescription.length < 50) {
      setErrorMessage('How will you use this wish must be at least 50 characters.')
      return
    }

    setErrorMessage('')
    setStatus('submitting')
    try {
      await axios.post(`${API_BASE}/access-request`, {
        full_name: fullName,
        email,
        organisation,
        use_case_description: useCaseDescription,
        plan_interest: planInterest,
        wish_name: wishName,
        wish_topic: wishTopic
      })
      setStatus('success')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response?.data?.detail || 'Failed to submit request. Please try again.')
      setStatus('error')
    }
  }

  const handleClose = () => {
    // Reset state on close
    setFullName('')
    setEmail('')
    setOrganisation('')
    setUseCaseDescription('')
    setPlanInterest('Personal')
    setStatus('idle')
    setErrorMessage('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6 card-glow rounded-2xl border border-djinn-purple/20 bg-djinn-bg shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-djinn-subtext hover:text-white transition-colors">
              <X size={20} />
            </button>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
                  <Lock className="text-green-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-djinn-text mb-4 text-gradient">Request Submitted</h3>
                <p className="text-djinn-subtext text-base leading-relaxed max-w-sm mx-auto mb-8">
                  We will review your request for <strong className="text-white">{wishName}</strong> and get back to you at <strong className="text-white">{email}</strong> within 48 hours.
                </p>
                <button
                  onClick={handleClose}
                  className="btn-glow px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto bg-djinn-purple/20 border border-djinn-purple/30 rounded-full flex items-center justify-center mb-4">
                    <Lock className="text-djinn-purple-light" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-djinn-text mb-2">Request Access to {wishName}</h3>
                  <p className="text-sm text-djinn-subtext">
                    Djinn is selective. Tell us about yourself and we will review your request.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-djinn-subtext mb-1 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-djinn-subtext mb-1 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-djinn-subtext mb-1 uppercase tracking-wider">Organisation / Project Name</label>
                    <input
                      type="text"
                      required
                      placeholder="My Organisation"
                      value={organisation}
                      onChange={e => setOrganisation(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-djinn-subtext mb-1 uppercase tracking-wider flex justify-between">
                      <span>How will you use this wish?</span>
                      <span className={useCaseDescription.length >= 50 ? "text-green-400" : "text-red-400"}>
                        {useCaseDescription.length}/50 min chars
                      </span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please describe your specific use case and goals for this automation (minimum 50 characters)..."
                      value={useCaseDescription}
                      onChange={e => setUseCaseDescription(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-djinn-subtext mb-1 uppercase tracking-wider">Plan Interest</label>
                    <select
                      value={planInterest}
                      onChange={e => setPlanInterest(e.target.value as PlanType)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-djinn-text focus:border-djinn-purple/40 outline-none transition-colors"
                    >
                      <option value="Personal" className="bg-djinn-bg text-djinn-text">Personal</option>
                      <option value="Startup" className="bg-djinn-bg text-djinn-text">Startup</option>
                      <option value="Agency" className="bg-djinn-bg text-djinn-text">Agency</option>
                      <option value="Enterprise" className="bg-djinn-bg text-djinn-text">Enterprise</option>
                    </select>
                  </div>

                  {errorMessage && (
                    <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-glow py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-all"
                  >
                    {status === 'submitting' ? 'Submitting Request...' : 'Submit Request'}
                  </button>

                  <p className="text-[10px] text-djinn-subtext text-center mt-2">
                    We review all requests within 48 hours. You will receive a confirmation at your email.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
