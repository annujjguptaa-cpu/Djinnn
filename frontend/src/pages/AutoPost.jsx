import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, Sparkles, Link2, Copy, Check, X, ThumbsUp, MessageSquare, Repeat2, Send, ArrowLeft } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import SocialPreview from '../components/SocialPreview'
import axios from 'axios'
import { API_BASE } from '../config'
import { useNavigate } from 'react-router-dom'

export default function AutoPost() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [imagePaths, setImagePaths] = useState([])
  const [postContext, setPostContext] = useState('')
  const [platform, setPlatform] = useState('linkedin') // 'linkedin' or 'x'
  const [aiEngine, setAiEngine] = useState(null)
  const [caption, setCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [wishLink, setWishLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isTemplate, setIsTemplate] = useState(false)
  const [optimizationStatus, setOptimizationStatus] = useState("")
  const [summonError, setSummonError] = useState('')
  const fileInputRef = useRef(null)

  // AI Speed Opt: Resize images on frontend before upload
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
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/')).slice(0, 6 - images.length)
    if (validFiles.length === 0) return

    const updatedImages = [...images, ...validFiles]
    setImages(updatedImages)

    setOptimizationStatus("Optimizing images...")
    const optimizedFiles = await Promise.all(updatedImages.map(file => optimizeImage(file)))

    // Generate previews
    const newPreviews = await Promise.all(validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ id: Math.random().toString(36).substr(2, 9), src: e.target.result })
        reader.readAsDataURL(file)
      })
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])

    // 1. Upload Images (Metadata only - Instant)
    try {
      const formData = new FormData()
      optimizedFiles.forEach(file => formData.append('files', file))
      const res = await axios.post(`${API_BASE}/post/upload`, formData)
      const paths = res.data.image_paths || []
      setImagePaths(paths)
      
      // 2. Start Streaming (Real-time)
      await consumeStream(paths, postContext)
    } catch (err) {
      console.error("Upload failed", err)
      setCaption(`🚀 Carousel alert! Excited to share this story through these markers of progress.`)
      setIsTemplate(true) 
      setIsGenerating(false)
      setOptimizationStatus("")
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    processImages(e.dataTransfer.files)
  }, [images])

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  const handleSummon = async () => {
    if (!caption) return
    setIsCreating(true)
    setSummonError('')
    try {
      const res = await axios.post(`${API_BASE}/post/create`, { 
        caption, 
        has_images: images.length > 0,
        image_paths: imagePaths,
        platform
      })
      setWishLink(`${window.location.origin}/wish/${res.data.wish_id}`)
    } catch (err) {
      console.error('Summon failed:', err)
      setSummonError(err.response?.data?.detail || err.message || 'Could not connect to Djinn backend. Please check server status.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleRefine = async () => {
    if (isGenerating) return
    await consumeStream(imagePaths, postContext)
  }

  // Real-time Stream Consumer
  const consumeStream = async (paths, ctx) => {
    setCaption('')
    setIsGenerating(true)
    setOptimizationStatus("Djinn is writing...")
    
    try {
      const response = await fetch(`${API_BASE}/post/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_paths: paths, context: ctx, platform: platform })
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
        
        // Detect and strip engine tags
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
      setCaption("✨ Djinn encountered a mystical error. Please try again or check your API key.")
    } finally {
      setIsGenerating(false)
      setOptimizationStatus("")
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(wishLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const clearImages = () => {
    setImages([])
    setImagePreviews([])
    setImagePaths([])
    setCaption('')
    setWishLink('')
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)

    const newPaths = [...imagePaths]
    newPaths.splice(index, 1)
    setImagePaths(newPaths)
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/topic/presence')}
          className="flex items-center gap-2 text-djinn-subtext hover:text-white mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Presence Wish
        </button>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium mb-4">
            <Sparkles size={12} />
            Omni-Platform AI Agent
          </div>
          <h1 className="text-4xl font-black text-djinn-text mb-2">The Omni-Djinn</h1>
          <p className="text-djinn-subtext">Context + Image → AI magic → Your Social Post</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column — Creation Flow */}
          <div className="space-y-6">
            
            {/* 0. Platform Selector */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium text-djinn-text mb-3">0. Choose Destination</label>
              <div className="flex gap-4">
                {[
                  { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
                  { id: 'x', label: 'X (Twitter)', icon: '🐦' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl border-2 transition-all ${
                      platform === p.id 
                        ? 'border-djinn-purple bg-djinn-purple/10 text-white shadow-purple-glow' 
                        : 'border-white/5 bg-white/5 text-djinn-subtext hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="font-bold text-xs uppercase tracking-widest">{p.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 1. Context Input (The "Why") */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-djinn-text">1. What's the context? (Instructions for AI)</label>
                <span className="text-[10px] uppercase tracking-widest text-djinn-purple-light font-bold">
                  {platform === 'x' ? 'TWEET MODE' : 'PROFESSIONAL MODE'}
                </span>
              </div>
              <textarea
                value={postContext}
                onChange={(e) => setPostContext(e.target.value)}
                placeholder="e.g. A marathon I ran, My new office, Funny tech meme... The more detail you give, the better the AI writes!"
                rows={3}
                className="input-djinn w-full rounded-2xl p-4 text-sm resize-none"
              />
              <p className="text-djinn-subtext text-[10px] mt-1.5 ml-1 italic opacity-70">
                Tip: Enter your context here *before* uploading for the best result.
              </p>
            </motion.div>

            {/* 2. Image Upload (The "What") */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-djinn-text">2. Upload Images (Max 6)</label>
                {imagePreviews.length > 0 && (
                  <button onClick={clearImages} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Remove All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {imagePreviews.map((prev, idx) => (
                  <motion.div 
                    key={prev.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group"
                  >
                    <img src={prev.src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)} 
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
                
                {imagePreviews.length < 6 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-djinn-purple bg-djinn-purple/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                  >
                    <Upload className="text-djinn-subtext mb-2" size={20} />
                    <span className="text-[10px] text-djinn-subtext font-medium">Add Image</span>
                  </div>
                )}
              </div>
              
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => processImages(e.target.files)} 
              />
            </motion.div>

            {/* 3. AI Caption (The "Result") */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-djinn-text">3. AI-Generated Caption</label>
                  {aiEngine && (
                    <motion.div 
                      key={aiEngine}
                      initial={{ opacity: 0, x: -5 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                        aiEngine === 'GEMINI' ? 'bg-djinn-purple/10 border-djinn-purple/30 text-djinn-purple-light' :
                        aiEngine === 'OPENAI' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      }`}
                    >
                      {aiEngine === 'GEMINI' ? '🦢 Gemini Powered' : 
                       aiEngine === 'OPENAI' ? '🤖 OpenAI Powered' : 
                       '🪄 Magic Mode'}
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {!isGenerating && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRefine}
                      className="flex items-center gap-1 text-[11px] font-bold text-djinn-purple-light bg-djinn-purple/10 px-3 py-1.5 rounded-full border border-djinn-purple/20 hover:bg-djinn-purple/30 transition-all shadow-purple-glow"
                    >
                      <Sparkles size={10} />
                      {images.length > 0 ? 'Regenerate' : 'Generate with Magic'}
                    </motion.button>
                  )}
                  {isGenerating && (
                    <span className="text-xs text-djinn-purple-light flex items-center gap-1.5">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⚡</motion.span>
                      {optimizationStatus || "Djinn is writing..."}
                    </span>
                  )}
                </div>
              </div>

              {isGenerating ? (
                <div className="rounded-2xl min-h-[180px] p-4 space-y-2 border border-djinn-border" style={{ background: '#12121a' }}>
                  {[100, 80, 90, 60, 70].map((w, i) => (
                    <div key={i} className="shimmer h-4 rounded" style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <div className="relative group">
                  <textarea
                    id="caption-textarea"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={platform === 'x' ? "Write a banger tweet..." : "Upload images or click 'Regenerate' to see the magic..."}
                    rows={8}
                    className={`input-djinn w-full rounded-2xl p-4 text-sm resize-none leading-relaxed border-opacity-30 ${isTemplate ? 'border-orange-500/30' : 'border-djinn-purple/30'}`}
                  />
                  <div className="absolute bottom-3 right-4 text-[10px] font-bold text-djinn-subtext">
                    {caption.length} / {platform === 'x' ? '280' : '3000'}
                  </div>
                  {isTemplate && (
                    <div className="absolute bottom-3 left-4 flex items-center justify-between pointer-events-none">
                      <p className="text-[9px] text-orange-500/60 font-medium italic">
                        ⚠ Fallback Mode
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* 4. Action Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <motion.button
                id="summon-post-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSummon}
                disabled={!caption || isCreating}
                className="btn-glow w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isCreating ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="inline-block">✨</motion.span> Summoning Wish...</>
                ) : (
                  <><Sparkles size={18} /> Summon Your Djinn</>
                )}
              </motion.button>
            </motion.div>

            {/* Error */}
            {summonError && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm"
              >
                ⚠️ {summonError}
              </motion.div>
            )}

            {/* Result Link */}
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
                    <span className="text-sm font-medium text-djinn-purple-light">Post Wish ready!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input readOnly value={wishLink} className="input-djinn flex-1 rounded-xl px-3 py-2 text-xs" />
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink} className="p-2 rounded-xl bg-djinn-purple/20 border border-djinn-purple/30 text-djinn-purple-light hover:bg-djinn-purple/30">
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column — Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-djinn-text uppercase tracking-widest text-[10px]">
                {platform === 'x' ? 'X (Twitter) Draft Preview' : 'LinkedIn Post Preview'}
              </label>
              <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${platform === 'x' ? 'border-primary/30 text-blue-400 bg-blue-500/10' : 'border-blue-700/30 text-blue-600 bg-blue-700/10'}`}>
                {platform === 'x' ? 'X-v2 TWEET' : 'PROFESSIONAL'}
              </div>
            </div>
            {caption || imagePreviews.length > 0 ? (
              <SocialPreview platform={platform} caption={caption} imageUrls={imagePreviews.map(p => p.src)} />
            ) : (
              <div
                className="rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-white/5 shadow-inner"
                style={{ background: 'rgba(26,26,46,0.2)' }}
              >
                <div className="w-16 h-16 rounded-3xl bg-djinn-surface border border-white/5 flex items-center justify-center mb-4">
                  <Image className="text-djinn-border opacity-30" size={32} />
                </div>
                <p className="text-djinn-subtext text-sm">Your magical post preview will appear here once you upload images</p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </PageWrapper>
  )
}
