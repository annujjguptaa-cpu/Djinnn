import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react'

// Shared LinkedIn-style Post Preview with Carousel
export default function LinkedInPreview({ caption, imageUrls = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="linkedin-card rounded-xl overflow-hidden bg-[#1b1b2e] border border-white/5 shadow-xl">
      {/* LinkedIn header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-djinn-purple to-djinn-purple-dark flex items-center justify-center text-white font-bold text-lg shadow-purple-glow">
          D
        </div>
        <div>
          <div className="text-djinn-text font-semibold text-sm">Djinn User</div>
          <div className="text-djinn-subtext text-xs">AI Action Agent • Just now</div>
          <div className="flex items-center gap-1 text-djinn-subtext text-xs mt-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            Shared worldwide
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-4 pb-3">
          <p className="text-djinn-text text-sm leading-relaxed whitespace-pre-line">{caption}</p>
        </div>
      )}

      {/* Media Carousel */}
      {imageUrls.length > 0 && (
        <div className="relative w-full bg-djinn-surface group">
          <div className="relative overflow-hidden aspect-[4/3]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={imageUrls[currentIndex]}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Indicators */}
          {imageUrls.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {imageUrls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
              
              {/* Navigation arrows (only visible on hover) */}
              <button 
                onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </button>
              <button 
                onClick={() => setCurrentIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* Reactions bar */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-1 mb-3">
          <div className="flex -space-x-1">
            {['👍','❤️','🔥'].map((e, i) => (
              <span key={i} className="w-5 h-5 rounded-full bg-djinn-surface flex items-center justify-center text-xs border border-djinn-card">{e}</span>
            ))}
          </div>
          <span className="text-djinn-subtext text-xs ml-1">247 reactions • 34 comments</span>
        </div>
        <div className="flex items-center justify-around border-t border-white/5 pt-2">
          {[{ icon: ThumbsUp, label: 'Like' }, { icon: MessageSquare, label: 'Comment' }, { icon: Repeat2, label: 'Repost' }, { icon: Send, label: 'Send' }].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-1.5 text-djinn-subtext hover:text-djinn-purple-light text-xs px-2 py-1.5 rounded-lg hover:bg-djinn-purple/10 transition-all">
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
