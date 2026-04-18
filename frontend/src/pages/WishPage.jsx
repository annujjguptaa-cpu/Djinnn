import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Trash2, Home, CheckCircle } from 'lucide-react'
import axios from 'axios'
import SocialPreview from '../components/SocialPreview'
import { Bird, Sparkles, Upload, X } from 'lucide-react'

// ─── Confetti ───────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#8b5cf6', '#a78bfa', '#6d28d9', '#c4b5fd', '#7c3aed', '#ddd6fe', '#fbbf24', '#34d399'][Math.floor(Math.random() * 8)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotation + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

// ─── Smoke Particles ─────────────────────────────────────────────────────────
function SmokeParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-1/3 left-1/2"
          initial={{ x: 0, y: 0, scale: 0.5, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 120,
            y: -150 - Math.random() * 100,
            scale: 1.5 + Math.random(),
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
          style={{
            width: 40 + Math.random() * 40,
            height: 40 + Math.random() * 40,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(139,92,246,${0.3 + Math.random() * 0.3}), transparent)`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Platform Auth Prompt ──────────────────────────────────────────────────
function PlatformAuthPrompt({ platform, onAuth }) {
  const isX = platform === 'x'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed top-6 right-6 z-50 w-[380px] rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: '#1e1e2e', border: `1px solid ${isX ? 'rgba(29,161,242,0.3)' : 'rgba(139,92,246,0.3)'}` }}
    >
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
           <div className="flex items-center gap-2">
            {isX ? (
              <Bird className="text-[#1DA1F2]" size={24} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            )}
            <span className="font-bold text-djinn-text">Connect {isX ? 'X (Twitter)' : 'LinkedIn'}</span>
           </div>
        </div>
        <p className="text-xs text-djinn-subtext mt-2">Djinn needs your permission to post on your behalf.</p>
      </div>

      <div className="p-4">
        <motion.button
          whileHover={{ backgroundColor: isX ? 'rgba(29,161,242,0.1)' : 'rgba(10,102,194,0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onAuth}
          className="w-full flex items-center justify-between p-3 rounded-xl border border-djinn-border transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${isX ? 'bg-black border border-white/20' : 'bg-[#0A66C2]'}`}>
              {isX ? <Bird size={18} /> : 'L'}
            </div>
            <div className="text-left">
              <div className="text-djinn-text text-sm font-medium">Log in with {isX ? 'X' : 'LinkedIn'}</div>
              <div className="text-djinn-subtext text-xs">{isX ? 'OAuth 2.0 PKCE' : 'Official OAuth Flow'}</div>
            </div>
          </div>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg className="text-djinn-subtext" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Loading Animation ────────────────────────────────────────────────────────
function DjinnWorking({ step, platform }) {
  const isX = platform === 'x'
  const steps = [
    `Authenticating with ${isX ? 'X (Twitter)' : 'LinkedIn'}...`,
    isX ? 'Verifying X-v2 token...' : 'Resolving member profile...',
    'Processing binary assets...',
    'Publishing your wish...',
  ]

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <SmokeParticles />

      <motion.div
        animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 rounded-full bg-djinn-purple opacity-30 blur-3xl scale-150 animate-pulse" />
        <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
          <ellipse cx="40" cy="52" rx="22" ry="10" fill="url(#lampGradW)" opacity="0.9"/>
          <path d="M18 52 Q22 38 40 36 Q58 38 62 52 Z" fill="url(#lampGradW)"/>
          <path d="M62 48 Q72 44 74 50 Q72 56 62 54 Z" fill="url(#lampGrad2W)" opacity="0.8"/>
          <path d="M22 46 Q12 40 14 32 Q16 26 22 28" stroke="url(#lampGrad2W)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <motion.ellipse fill="url(#smokeGradW)"
            initial={{ cx: 76, cy: 46, rx: 6, ry: 8, opacity: 0.8 }}
            animate={{ scaleY: [1, 1.6, 1], opacity: [0.8, 0.3, 0.8], cy: [46, 40, 46] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="lampGradW" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
            <linearGradient id="lampGrad2W" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#6d28d9"/>
            </linearGradient>
            <radialGradient id="smokeGradW">
              <stop stopColor="#c4b5fd"/><stop offset="1" stopColor="rgba(139,92,246,0)"/>
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-black text-gradient mb-2"
      >
        Djinn is working...
      </motion.h2>

      <div className="mt-6 space-y-3 w-full max-w-xs">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-500 ${
              i < step ? 'bg-djinn-purple text-white' : i === step ? 'border-2 border-djinn-purple' : 'border border-djinn-border'
            }`}>
              {i < step ? '✓' : i === step ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>◌</motion.span>
              ) : '·'}
            </div>
            <span className={`text-sm ${i <= step ? 'text-djinn-text' : 'text-djinn-subtext'}`}>{s}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 w-64 h-1.5 bg-djinn-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-djinn-purple-dark to-djinn-purple-light rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function WishGranted({ postUrl, platform, wishData }) {
  const isX = platform === 'x'
  const isConnect = wishData?.type === 'connect'
  
  // Generate LinkedIn Search URL for Connect wishes
  const searchUrl = isConnect 
    ? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(wishData.role)}&location=${encodeURIComponent(wishData.location)}`
    : postUrl

  return (
    <>
      <Confetti />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-djinn-purple opacity-30 blur-2xl scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-djinn-purple to-djinn-purple-dark flex items-center justify-center shadow-purple-glow-lg">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="text-5xl"
            >
              ✓
            </motion.span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-black mb-4"
        >
          <span className="text-gradient">{isConnect ? 'Connection Magic Activated' : 'Your wish is granted'}</span>
          <span className="ml-2">✨</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-djinn-subtext text-lg max-w-md mb-10 leading-relaxed"
        >
          {isConnect 
            ? `Djinn has prepared your personalized message for ${wishData.role}s in ${wishData.location}. One click to find them and start connecting!`
            : `Djinn has successfully published your post to ${isX ? 'X (Twitter)' : 'LinkedIn'}. Your network can now see the magic you've created.`
          }
        </motion.p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {isConnect ? [
            ['🤝', 'Action', 'Connect'],
            ['🌍', 'Market', wishData.location || 'Global'],
            ['🎯', 'Goal', 'Growth']
          ].map(([emoji, label, value]) => (
            <div key={label} className="card-glow rounded-2xl p-5 text-center" style={{ background: 'rgba(26,26,46,0.8)' }}>
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-djinn-subtext text-xs">{label}</div>
              <div className="text-djinn-purple-light font-bold text-sm mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{value}</div>
            </div>
          )) : [
            ['🚀', 'Status', 'Published'],
            ['⚡', 'API', isX ? 'X v2' : 'LinkedIn v2'],
            ['🎯', 'Impact', 'Live Now']
          ].map(([emoji, label, value]) => (
            <div key={label} className="card-glow rounded-2xl p-5 text-center" style={{ background: 'rgba(26,26,46,0.8)' }}>
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-djinn-subtext text-xs">{label}</div>
              <div className="text-djinn-purple-light font-bold text-sm mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.a
            href={searchUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`btn-glow px-10 py-4 rounded-2xl text-white font-bold text-base inline-flex items-center gap-2 ${isConnect ? 'bg-gradient-to-r from-blue-600 to-blue-400' : ''}`}
          >
            {isConnect ? (
               <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Find Peers on LinkedIn
               </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                View on LinkedIn
              </>
            )}
          </motion.a>

          <motion.a
            href="/"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl border border-djinn-border text-djinn-text font-bold text-base inline-flex items-center gap-2 hover:bg-white/5 transition-all"
          >
            ✨ Make Another Wish
          </motion.a>
        </div>
      </div>
    </>
  )
}

// ─── Main Wish Page ───────────────────────────────────────────────────────────
export default function WishPage() {
  const { wishId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [stage, setStage] = useState('auth') // auth → loading → granted → error
  const [currentStep, setCurrentStep] = useState(0)
  const [errorStatus, setErrorStatus] = useState(null)
  const [postUrl, setPostUrl] = useState(null)
  const [wishData, setWishData] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  
  // Editor State
  const [caption, setCaption] = useState('')
  const [postContext, setPostContext] = useState('')
  const [imagePaths, setImagePaths] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [optimizationStatus, setOptimizationStatus] = useState('')
  const [aiEngine, setAiEngine] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)
  
  const fileInputRef = useRef(null)
  const executingRef = useRef(false)

  const API_BASE = 'http://localhost:8000/api'

  // Image processing logic
  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const maxDim = 1024
        let w = img.width
        let h = img.height

        if (w > h && w > maxDim) { h *= maxDim / w; w = maxDim }
        else if (h > maxDim) { w *= maxDim / h; h = maxDim }

        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }))
        }, "image/jpeg", 0.8)
      }
    })
  }

  const processImages = async (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/')).slice(0, 6 - imagePreviews.length)
    if (validFiles.length === 0) return

    setOptimizationStatus("Optimizing images...")
    const optimizedFiles = await Promise.all(validFiles.map(file => optimizeImage(file)))

    // Generate previews
    const newPreviews = await Promise.all(validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ id: Math.random().toString(36).substr(2, 9), src: e.target.result })
        reader.readAsDataURL(file)
      })
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])

    try {
      const formData = new FormData()
      optimizedFiles.forEach(file => formData.append('files', file))
      const res = await axios.post(`${API_BASE}/post/upload`, formData)
      const newPaths = res.data.image_paths || []
      setImagePaths(prev => [...prev, ...newPaths])
    } catch (err) {
      console.error("Upload failed", err)
      setOptimizationStatus("")
    }
  }

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)

    const newPaths = [...imagePaths]
    newPaths.splice(index, 1)
    setImagePaths(newPaths)
  }

  const handleRefine = async () => {
    if (isGenerating) return
    setCaption('')
    setIsGenerating(true)
    setOptimizationStatus("Djinn is thinking...")
    
    try {
      const response = await fetch(`${API_BASE}/post/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_paths: imagePaths, context: postContext, platform: wishData?.platform || 'linkedin' })
      })

      if (!response.ok) throw new Error('Stream failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let fullText = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        let chunkValue = decoder.decode(value)
        
        if (chunkValue.includes("__ENGINE_")) {
          if (chunkValue.includes("GEMINI")) setAiEngine("GEMINI")
          else if (chunkValue.includes("OPENAI")) setAiEngine("OPENAI")
          else if (chunkValue.includes("TEMPLATE")) setAiEngine("TEMPLATE")
          chunkValue = chunkValue.replace(/__ENGINE_[A-Z]+__/g, '')
        }
        fullText += chunkValue
        setCaption(fullText)
      }
    } catch (err) {
      console.error("Streaming failed", err)
      setCaption("✨ Djinn encountered a mystical error. You can still manually edit this text.")
    } finally {
      setIsGenerating(false)
      setOptimizationStatus("")
    }
  }

  // Step 0: Fetch Wish Data
  useEffect(() => {
    const fetchWish = async () => {
      try {
        const path = wishId.startsWith('connect_') ? 'connect' : 'post'
        const res = await axios.get(`${API_BASE}/${path}/${wishId}`)
        setWishData(res.data)
        const hasToken = new URLSearchParams(window.location.search).get('token')
        if (!hasToken) setStage('auth')
        if (!wishId.startsWith('connect_')) {
            setCaption(res.data.caption || '')
            if (Array.isArray(res.data.image_paths) && res.data.image_paths.length > 0) {
                setImagePaths(res.data.image_paths)
                setImagePreviews(res.data.image_paths.map((p, idx) => ({ id: idx, src: `${API_BASE.replace('/api', '')}/uploads/${p}` })))
            }
        }
      } catch (err) {
        console.error("fetchWish error:", err)
        setStage('error')
        setErrorStatus("This wish has expired or does not exist.")
      } finally {
        setIsFetching(false)
      }
    }
    fetchWish()
  }, [wishId, fetchKey])

  // Step 1: Handle Auth Redirect (and Sync Edits First)
  const handleAuth = async () => {
    setIsUpdating(true)
    const platform = wishData?.platform || 'linkedin'
    
    // Save state back to DB if it's a post wish
    if (!wishId.startsWith('connect_')) {
        try {
            await axios.put(`${API_BASE}/post/${wishId}`, {
                caption,
                has_images: imagePaths.length > 0,
                image_paths: imagePaths,
                platform: platform
            })
        } catch (e) {
            console.error("Failed to sync edited wish data:", e)
        }
    }
    
    // Redirect to backend OAuth initiator with context
    window.location.href = `${API_BASE}/auth/${platform}/login?wish_id=${wishId}`
  }

  // Step 2: Watch for token in URL after redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const error = params.get('error')
    const urlPlatform = params.get('platform')

    if (error) {
      setStage('error')
      setErrorStatus(error)
      return
    }

    if (token && !executingRef.current) {
        setStage('loading')
        executeWish(token)
    }
  }, [location])

  const executeWish = async (token) => {
    if (executingRef.current) return
    executingRef.current = true
    
    try {
        // Step-by-step UI updates
        setCurrentStep(0)
        await new Promise(r => setTimeout(r, 1000))
        
        setCurrentStep(1)
        await new Promise(r => setTimeout(r, 1000))
        
        setCurrentStep(2)
        await new Promise(r => setTimeout(r, 1000))
        
        setCurrentStep(3)
        // Actual execution call - LONG timeout
        const isConnect = wishId.startsWith('connect_')
        const execPath = isConnect ? 'connect' : 'post'
        
        const response = await axios.post(`${API_BASE}/${execPath}/execute/${wishId}?access_token=${token}`, {}, {
            timeout: 60000 // 60 seconds
        })
        
        if (response.data.status === 'success') {
            if (isConnect) {
              setWishData(prev => ({ ...prev, ...response.data }))
            } else {
              setPostUrl(response.data.post_url)
            }
            await new Promise(r => setTimeout(r, 1000))
            setStage('granted')
        } else {
            setStage('error')
            setErrorStatus('Execution failed')
        }
    } catch (err) {
        console.error(err)
        setStage('error')
        setErrorStatus(err.response?.data?.detail || 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-djinn-bg bg-grid font-inter relative">
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-djinn-purple opacity-5 blur-[150px] rounded-full" />

      {isFetching ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl mb-6">🪔</motion.div>
          <h2 className="text-2xl font-bold text-djinn-text mb-2">Summoning your wish...</h2>
          <p className="text-djinn-subtext text-sm">Translating ancient scripts from the database.</p>
        </div>
      ) : stage === 'error' ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="text-6xl mb-6">🪄</div>
          <h2 className="text-2xl font-bold text-djinn-text mb-3">This Wish Has Expired</h2>
          <p className="text-djinn-subtext text-sm max-w-xs leading-relaxed mb-8">
            {errorStatus || "This wish does not exist or the Djinn backend is not running."}
          </p>
          <div className="flex flex-col gap-3 items-center">
            <button
            onClick={() => { setIsFetching(true); setFetchKey(k => k + 1) }}
              className="px-8 py-3 rounded-xl border border-djinn-purple/30 bg-djinn-purple/10 text-djinn-purple-light font-bold text-sm hover:bg-djinn-purple/20 transition-all"
            >
              Try Again
            </button>
            <a href="/" className="text-djinn-subtext text-xs underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity">
              Return Home
            </a>
          </div>
        </div>
      ) : (

        <AnimatePresence mode="wait">
        {stage === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-12 pb-24 px-6 ${!wishId.startsWith('connect_') && isEditing ? 'max-w-6xl mx-auto flex flex-col justify-center' : 'flex flex-col items-center justify-center text-center'}`}
          >
            <PlatformAuthPrompt platform={wishData?.platform || 'linkedin'} onAuth={handleAuth} />

            {!wishId.startsWith('connect_') ? (
              isEditing ? (
              // ─── POST WISH: EDITABLE 2-COLUMN VIEW ────────
              <div className="w-full">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium mb-6 w-fit">
                    <Sparkles size={12} />
                    A {wishData?.platform === 'x' ? 'X (Twitter)' : 'LinkedIn'} wish awaits you
                </div>

                <h1 className="text-4xl font-black text-djinn-text mb-12">
                   Review & <span className="text-gradient">Refine Your Wish</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* LEFT COLUMN: THE EDITOR */}
                   <div className="space-y-6 text-left">
                       {/* 1. Context & AI Regeneration */}
                       <div className="space-y-2">
                           <div className="flex items-center justify-between">
                             <label className="block text-sm font-medium text-djinn-text">1. Edit Text or Regenerate</label>
                             <div className="flex gap-2">
                               {aiEngine && (
                                 <span className="px-2 py-0.5 rounded-full border border-djinn-purple/30 text-djinn-purple-light text-[9px] font-bold uppercase tracking-wider">
                                     {aiEngine === 'GEMINI' ? '🦢 Gemini Powered' : aiEngine === 'OPENAI' ? '🤖 OpenAI Powered' : '🪄 Magic Mode'}
                                 </span>
                               )}
                               <button onClick={handleRefine} disabled={isGenerating} className="flex items-center gap-1 bg-djinn-purple/10 hover:bg-djinn-purple/20 text-djinn-purple-light border border-djinn-purple/30 px-3 py-1 rounded-full text-[10px] font-bold transition-all disabled:opacity-50">
                                   {isGenerating ? <Sparkles size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                   Regenerate
                               </button>
                             </div>
                           </div>
                           
                           {isGenerating ? (
                             <div className="rounded-2xl h-[160px] p-4 space-y-2 border border-djinn-border/50 bg-[#12121a]">
                               {[100, 80, 90, 60].map((w, i) => <div key={i} className="h-3 rounded shimmer" style={{ width: `${w}%` }} />)}
                             </div>
                           ) : (
                             <div className="relative">
                               <textarea
                                 value={caption}
                                 onChange={(e) => setCaption(e.target.value)}
                                 className="input-djinn w-full rounded-2xl p-4 text-sm resize-none h-[160px]"
                               />
                               <div className="absolute bottom-3 right-4 text-[10px] font-bold text-djinn-subtext">
                                 {caption.length} / {wishData?.platform === 'x' ? '280' : '3000'}
                               </div>
                             </div>
                           )}

                           {/* Hidden context textbox for regeneration guidance */}
                           <input
                             type="text"
                             value={postContext}
                             onChange={(e) => setPostContext(e.target.value)}
                             placeholder="Give Djinn specific instructions before hitting Regenerate..."
                             className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs text-djinn-subtext focus:border-djinn-purple/30 outline-none"
                           />
                       </div>

                       {/* 2. Image Management */}
                       <div className="space-y-2 pt-4">
                           <div className="flex items-center justify-between">
                               <label className="block text-sm font-medium text-djinn-text">2. Manage Images (Max 6)</label>
                           </div>
                           <div className="grid grid-cols-4 gap-3">
                               {imagePreviews.map((prev, idx) => (
                                 <motion.div key={prev.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                                   <img src={prev.src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                   <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                     <X size={12} />
                                   </button>
                                 </motion.div>
                               ))}
                               {imagePreviews.length < 6 && (
                                 <div onClick={() => fileInputRef.current?.click()} className={`aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all`}>
                                   <Upload className="text-djinn-subtext mb-1" size={16} />
                                   <span className="text-[9px] text-djinn-subtext font-medium">Add Image</span>
                                 </div>
                               )}
                           </div>
                           <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => processImages(e.target.files)} />
                       </div>
                   </div>

                   {/* RIGHT COLUMN: PREVIEW & ACTION */}
                   <div className="flex flex-col items-center">
                       <div className="w-full max-w-sm mb-6 text-left relative">
                           <SocialPreview 
                             platform={wishData?.platform || 'linkedin'}
                             caption={caption} 
                             imageUrls={imagePreviews.map(p => p.src)} 
                           />
                       </div>
                       
                       <p className="text-djinn-subtext text-xs leading-relaxed mb-6 text-center">
                         By clicking Grant, your edits will be permanently saved and Djinn will natively deploy this to your feed.
                       </p>

                       <motion.button
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={handleAuth}
                         disabled={isUpdating}
                         className="btn-glow px-12 py-4 w-full max-w-sm rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                         {isUpdating ? <span className="animate-spin text-xl">◌</span> : <CheckCircle size={20} />}
                         {isUpdating ? "Syncing Magic..." : "Grant this Wish"}
                       </motion.button>
                       <button
                         onClick={() => setIsEditing(false)}
                         disabled={isUpdating}
                         className="mt-4 px-6 py-2 rounded-xl border border-djinn-border text-djinn-subtext hover:text-white hover:bg-white/5 transition-all text-sm"
                       >
                         Cancel Edit
                       </button>
                       <p className="text-djinn-subtext text-[10px] mt-4 opacity-60">Wish ID: {wishId}</p>
                   </div>
                </div>
              </div>
              ) : (
                // ─── POST WISH: DEFAULT CENTERED PREVIEW VIEW ──────
                <>
                   <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="mb-8">
                     <div className="text-8xl">🪔</div>
                   </motion.div>

                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-sm font-medium mb-6">
                     ✨ A {wishData?.platform === 'x' ? 'X (Twitter)' : 'LinkedIn'} wish awaits you
                   </div>

                   <h1 className="text-4xl font-black text-djinn-text mb-6">
                     Review & <span className="text-gradient">Grant Your Wish</span>
                   </h1>
                   
                   <button
                     onClick={() => setIsEditing(true)}
                     className="mb-8 px-5 py-2 rounded-xl border border-djinn-purple/30 bg-djinn-purple/10 text-djinn-purple-light font-bold text-sm flex items-center justify-center gap-2 hover:bg-djinn-purple/20 transition-all shadow-purple-glow"
                   >
                     ✏️ Edit Wish
                   </button>

                   {!isFetching && wishData && (
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mb-10 text-left">
                       <SocialPreview 
                         platform={wishData.platform || 'linkedin'}
                         caption={caption || wishData.caption} 
                         imageUrls={imagePreviews.map(p => p.src)} 
                       />
                     </motion.div>
                   )}

                   <p className="text-djinn-subtext text-sm max-w-xs leading-relaxed mb-6 opacity-80">
                     Granting this wish will publish this directly to your {wishData?.platform === 'x' ? 'X (Twitter)' : 'LinkedIn'} profile.
                   </p>

                   <div className="flex flex-col items-center justify-center">
                     <motion.button
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={handleAuth}
                       disabled={isUpdating}
                       className="btn-glow px-10 py-4 w-full max-w-sm rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {isUpdating ? <span className="animate-spin text-xl">◌</span> : <CheckCircle size={20} />}
                       {isUpdating ? "Syncing..." : "Grant"}
                     </motion.button>
                   </div>
                   <p className="text-djinn-subtext text-xs mt-4 opacity-60">Wish ID: {wishId}</p>
                </>
              )
            ) : (
              // ─── CONNECT WISH: ORIGINAL CENTERED VIEW ──────
              <>
                 <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="mb-8">
                   <div className="text-8xl">🪔</div>
                 </motion.div>

                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-sm font-medium mb-6">
                   ✨ A {wishData?.platform === 'x' ? 'X (Twitter)' : 'LinkedIn'} wish awaits you
                 </div>

                 <h1 className="text-4xl font-black text-djinn-text mb-8">
                   Review & <span className="text-gradient">Grant Your Wish</span>
                 </h1>

                 {!isFetching && wishData && (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mb-10 text-left">
                     <SocialPreview 
                       platform={wishData.platform || 'linkedin'}
                       caption={wishData.caption || wishData.message} 
                       imageUrls={wishData.image_paths ? wishData.image_paths.map(p => `${API_BASE.replace('/api', '')}/uploads/${p}`) : []} 
                     />
                   </motion.div>
                 )}

                 <p className="text-djinn-subtext text-sm max-w-xs leading-relaxed mb-8 opacity-80">
                   Granting this wish will execute this directly via your connected profile.
                 </p>

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleAuth}
                   disabled={isUpdating}
                   className="btn-glow px-12 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isUpdating ? <span className="animate-spin text-xl">◌</span> : <CheckCircle size={20} />}
                   {isUpdating ? "Syncing..." : "Grant this Wish"}
                 </motion.button>
                 <p className="text-djinn-subtext text-xs mt-4 opacity-60">Wish ID: {wishId}</p>
              </>
            )}
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DjinnWorking step={currentStep} platform={wishData?.platform || 'linkedin'} />
          </motion.div>
        )}

        {stage === 'granted' && (
          <motion.div key="granted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WishGranted 
              postUrl={postUrl} 
              platform={wishData?.platform || 'linkedin'} 
              wishData={wishData} 
            />
          </motion.div>
        )}
        )}
      </AnimatePresence>
      )}
    </div>
  )
}
