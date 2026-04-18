import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, MessageSquare, Repeat2, Send, Heart, Share2, BarChart2, Bird } from 'lucide-react'
import LinkedInPreview from './LinkedInPreview'

// Shared Social Media Post Preview (LinkedIn or X)
export default function SocialPreview({ caption, imageUrls = [], platform = 'linkedin' }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (platform === 'x') {
    return (
      <div className="rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl p-4 font-sans">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-djinn-purple to-djinn-purple-dark flex-shrink-0 animate-pulse border border-white/10" />
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-1 mb-1">
              <span className="text-white font-bold text-sm truncate">Djinn Agent</span>
              <span className="text-djinn-subtext text-sm">@djinn_ai · Just now</span>
            </div>

            {/* Caption */}
            {caption && (
              <p className="text-white text-[15px] leading-normal mb-3 whitespace-pre-line break-words">
                {caption}
              </p>
            )}

            {/* Media */}
            {imageUrls.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-video relative group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={imageUrls[currentIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded-md text-[10px] font-bold text-white">
                    {currentIndex + 1} / {imageUrls.length}
                  </div>
                )}
                
                {/* Nav arrows for X */}
                {imageUrls.length > 1 && (
                  <>
                    <button onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : imageUrls.length - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
                    <button onClick={() => setCurrentIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : 0))} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">›</button>
                  </>
                )}
              </div>
            )}

            {/* X Stats / Actions */}
            <div className="flex items-center justify-between mt-3 max-w-sm text-djinn-subtext">
              <button className="flex items-center gap-2 hover:text-blue-400 transition-colors"><MessageSquare size={16} /><span className="text-xs">12</span></button>
              <button className="flex items-center gap-2 hover:text-green-400 transition-colors"><Repeat2 size={16} /><span className="text-xs">45</span></button>
              <button className="flex items-center gap-2 hover:text-pink-400 transition-colors"><Heart size={16} /><span className="text-xs">128</span></button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition-colors"><BarChart2 size={16} /><span className="text-xs">4.2K</span></button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition-colors"><Share2 size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use the dedicated LinkedInPreview for the LinkedIn UI
  return (
    <LinkedInPreview 
      caption={caption} 
      imageUrls={imageUrls} 
    />
  )
}
