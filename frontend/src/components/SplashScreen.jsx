import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('entering') // entering -> levitating -> bursting -> leaving -> done

  useEffect(() => {
    const sequence = async () => {
      // 1. Enter (0 to 0.8s)
      await new Promise(r => setTimeout(r, 800))
      
      // 2. Start Levitation & Shaking (0.8s to 2.5s)
      setPhase('levitating')
      await new Promise(r => setTimeout(r, 1700))
      
      // 3. The Climax Fly-Through (2.5s to 3.2s)
      setPhase('bursting')
      await new Promise(r => setTimeout(r, 700))
      
      // 4. Fade Out / Done (3.2s)
      setPhase('leaving')
      await new Promise(r => setTimeout(r, 100))
      
      onComplete()
    }
    sequence()
  }, [])

  if (phase === 'done') return null

  // Cinematic levitation physics for ONLY the lamp
  const chiragVariants = {
    entering: { scale: 0.8, opacity: 0, y: 60, filter: "brightness(0.3)" },
    entering_done: { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      filter: "brightness(0.9)",
      transition: { duration: 1.0, ease: "easeOut" } 
    },
    levitating: { 
      // Levitate up (-y) while violently vibrating
      y: [0, -20, -10, -40, -30, -60, -50, -80],
      x: [0, -10, 10, -10, 10, -8, 8, 0],
      rotate: [0, -3, 3, -3, 3, -2, 2, 0],
      scale: 1.2,
      filter: "brightness(1)",
      transition: { duration: 1.7, ease: "easeInOut" }
    },
    bursting: { 
      // Fly completely THROUGH the lamp
      y: 200, 
      scale: 15, 
      opacity: 0,
      filter: "brightness(2) blur(6px)", 
      transition: { duration: 0.7, ease: "easeIn" } 
    },
    leaving: { opacity: 0, transition: { duration: 0.1 } }
  }

  // Smooth cinematic background zoom for the clouds
  const cloudVariants = {
    entering: { scale: 1, opacity: 0 },
    entering_done: { scale: 1.05, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    levitating: { scale: 1.15, transition: { duration: 1.7, ease: "linear" } },
    bursting: { scale: 2, opacity: 0, filter: "brightness(3)", transition: { duration: 0.7, ease: "easeIn" } },
    leaving: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {phase !== 'leaving' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-[#020204] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Layer 0: The Smooth Background Clouds */}
          <motion.div
            variants={cloudVariants}
            initial="entering"
            animate={
              phase === 'entering' ? 'entering_done' : 
              phase === 'levitating' ? 'levitating' : 
              phase === 'bursting' ? 'bursting' : 'leaving'
            }
            className="absolute inset-0 z-0 origin-center"
          >
            <img 
              src="/clouds-bg.png" 
              alt="Clouds Environment" 
              className="w-full h-full object-cover opacity-80 mix-blend-screen" 
            />
          </motion.div>

          {/* Subtle ambient glow - soft, not harsh */}
          <motion.div
            animate={{ opacity: phase === 'levitating' ? [0.08, 0.18, 0.08] : 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 bg-blue-900 blur-[120px] pointer-events-none z-0"
          />

          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Layer 1.5: Sparkles trail falling BEHIND the levitating lamp */}
            {/* Only drops sparkles during levitation, keeping the climax clean */}
            <AnimatePresence>
              {phase === 'levitating' && (
                <>
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={`spark-${i}`}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{ 
                        x: (Math.random() * 500 - 250), 
                        y: (Math.random() * 500 - 250), 
                        scale: Math.random() * 2,
                        opacity: 0,
                        rotate: Math.random() * 360
                      }}
                      transition={{ duration: 1 + Math.random() * 1.5, repeat: Infinity, ease: "easeOut" }}
                      className="absolute z-10 text-[#818cf8]"
                    >
                      <Sparkles size={10 + Math.random() * 24} />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Layer 2: The Action Logic (Isolated Lamp) */}
            <motion.div
              variants={chiragVariants}
              initial="entering"
              animate={
                phase === 'entering' ? 'entering_done' : 
                phase === 'levitating' ? 'levitating' : 
                phase === 'bursting' ? 'bursting' : 'leaving'
              }
              // Adjust origin so it zooms roughly towards the center of the lamp
              style={{ transformOrigin: 'center center' }}
              className="relative z-20 w-[750px] h-auto drop-shadow-[0_30px_60px_rgba(30,60,120,0.6)]"
            >
              {/* Slight blue atmospheric tint to blend with the dark cloud environment */}
              <img 
                src="/chirag-isolated.png" 
                alt="Magic Chirag Element" 
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.3)) brightness(0.92)' }}
              />
            </motion.div>
          </div>
          
          {/* Subtitle UI */}
          <motion.p
            animate={{ opacity: phase === 'levitating' ? [0.4, 0.8, 0.4] : phase === 'bursting' ? 0 : 0.4 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute bottom-20 z-30 text-djinn-purple-light font-bold text-sm tracking-[0.4em] uppercase"
          >
            {phase === 'entering' ? 'Igniting Magic...' : phase === 'levitating' ? 'Summoning Djinn...' : ''}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
