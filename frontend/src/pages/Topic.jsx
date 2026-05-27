import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Sparkles } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import WaitlistModal from '../components/WaitlistModal'
import { topicsData } from '../data/topics'
import TopicPageSkeleton from '../components/skeletons/TopicPageSkeleton'

const SubTopicCard = ({ card, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    className="card-glow rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
  >
    {/* Tag & Badge */}
    <div className="flex justify-between items-center mb-2">
      <div className="px-3 py-1 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-[10px] font-bold tracking-wide uppercase">
        {card.tag}
      </div>
      {card.activeRoute ? (
        <div className="flex items-center gap-1 text-[10px] font-bold text-djinn-purple-light uppercase">
          <Sparkles size={10} /> Active
        </div>
      ) : (
        <div className="text-[10px] font-bold text-djinn-subtext uppercase">
          Coming Soon
        </div>
      )}
    </div>

    {/* Title & Bullets */}
    <div>
      <h3 className="text-xl font-bold text-djinn-text mb-4">{card.title}</h3>
      <ul className="space-y-2 text-sm text-djinn-subtext">
        {card.bullets?.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-djinn-purple inline-block flex-shrink-0"/>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* CTA Button */}
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`mt-auto w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
        card.activeRoute 
          ? 'btn-glow text-white' 
          : 'bg-white/5 border border-white/10 text-djinn-subtext hover:bg-white/10'
      }`}
    >
      <Sparkles size={14} />
      Make a Wish
    </motion.button>
  </motion.div>
)

export default function Topic() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [waitlistTopic, setWaitlistTopic] = useState(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [cardsVisible, setCardsVisible] = useState(false)

  // Show skeleton for 800ms minimum to prevent jarring pop-in of 15 cards simultaneously
  useEffect(() => {
    setShowSkeleton(true)
    setCardsVisible(false)
    const timer = setTimeout(() => {
      setShowSkeleton(false)
      // Cards start staggered reveal immediately after skeleton fades
      setTimeout(() => setCardsVisible(true), 50)
    }, 800)
    return () => clearTimeout(timer)
  }, [topicId])

  const topic = topicsData.find(t => t.id === topicId)
  
  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Topic not found</h1>
        <button onClick={() => navigate('/')} className="btn-glow px-6 py-2 rounded-xl">Go Home</button>
      </div>
    )
  }

  const handleWishClick = (card) => {
    if (card.activeRoute) {
      navigate(card.activeRoute)
    } else {
      setWaitlistTopic(card.title)
    }
  }

  const Icon = topic.icon

  // Show skeleton while loading
  if (showSkeleton) {
    return (
      <PageWrapper>
        <div
          style={{
            opacity: showSkeleton ? 1 : 0,
            transition: 'opacity 300ms ease-out',
          }}
        >
          <TopicPageSkeleton />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-djinn-subtext hover:text-white mb-8 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-2xl bg-djinn-purple/20 border border-djinn-purple/30 flex items-center justify-center shadow-purple-glow">
            <Icon className="text-djinn-purple-light" size={40} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-djinn-text mb-2">{topic.title}</h1>
            <p className="text-djinn-subtext text-lg italic opacity-80">{topic.subtitle}</p>
          </div>
        </div>

        {/* Staggered card reveal — each card fades in with 50ms offset after previous */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.subCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: idx * 0.05 }}
            >
              <SubTopicCard 
                card={card} 
                delay={0}
                onClick={() => handleWishClick(card)} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      <WaitlistModal 
        isOpen={!!waitlistTopic} 
        onClose={() => setWaitlistTopic(null)} 
        topicName={topic.title}
        wishName={waitlistTopic}
      />
    </PageWrapper>
  )
}
