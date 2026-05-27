/**
 * DiscoverMoreWishes Component
 * 
 * Usage:
 * import DiscoverMoreWishes from '../components/DiscoverMoreWishes'
 * 
 * Add at the bottom of any Wish Granted page:
 * <DiscoverMoreWishes currentWish="linkedin-post" />
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ALL_WISHES } from '../data/allWishes'
import type { Wish } from '../data/allWishes'
import RequestAccessModal from './RequestAccessModal'
import DiscoverMoreSkeleton from './skeletons/DiscoverMoreSkeleton'

interface DiscoverMoreWishesProps {
  currentWish: string
}

export default function DiscoverMoreWishes({ currentWish }: DiscoverMoreWishesProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended')
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Request Access Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWishForAccess, setSelectedWishForAccess] = useState<Wish | null>(null)

  // Show skeleton for max 600ms on mount — prevents pop-in flash since allWishes is local data
  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Map shorthand recommendation IDs to their actual IDs in ALL_WISHES
  const resolveWishId = (id: string) => {
    const map: Record<string, string> = {
      'personal-brand-engine': 'personal-brand-building-engine',
      'twitter-post': 'twitter-x-auto-post',
      'open-source-onboarding': 'open-source-contributor-onboarding',
      'recruitment-pipeline': 'full-recruitment-pipeline',
      'crm-update': 'crm-update-automation',
      'lead-generation': 'lead-generation-linkedin',
      'accelerator-submission': 'startup-accelerator-submission',
      'pr-outreach': 'pr-outreach-automation',
    }
    return map[id] || id
  }

  // Get recommended wish IDs based on current wish
  const getRecommendedIds = (wishId: string): string[] => {
    switch (wishId) {
      case 'linkedin-post':
        return ['linkedin-connect', 'github-push', 'vc-outreach', 'cold-email', 'personal-brand-engine', 'twitter-post']
      case 'linkedin-connect':
        return ['linkedin-post', 'vc-outreach', 'cold-email', 'sales-followup', 'linkedin-jobs', 'pr-outreach']
      case 'github-push':
        return ['github-b2b', 'linkedin-post', 'technical-blog-publisher', 'developer-onboarding', 'open-source-onboarding', 'cloud-cost-monitor']
      case 'github-b2b':
        return ['github-push', 'developer-onboarding', 'employee-onboarding', 'recruitment-pipeline', 'linkedin-post', 'cold-email']
      case 'linkedin-jobs':
        return ['naukri-jobs', 'scholarships', 'linkedin-connect', 'resume-optimiser', 'cover-letter-generator', 'linkedin-profile-optimiser']
      case 'naukri-jobs':
        return ['linkedin-jobs', 'scholarships', 'resume-optimiser', 'cover-letter-generator', 'linkedin-connect', 'internship-hunt']
      case 'scholarships':
        return ['linkedin-jobs', 'naukri-jobs', 'university-admissions', 'student-loan-application', 'linkedin-connect', 'hackathon-registration']
      case 'vc-outreach':
        return ['cold-email', 'linkedin-post', 'sales-followup', 'linkedin-connect', 'accelerator-submission', 'pr-outreach']
      case 'cold-email':
        return ['vc-outreach', 'sales-followup', 'linkedin-connect', 'linkedin-post', 'partnership-outreach', 'crm-update']
      case 'sales-followup':
        return ['cold-email', 'vc-outreach', 'linkedin-connect', 'linkedin-post', 'crm-update', 'lead-generation']
      default:
        return ['linkedin-post', 'linkedin-connect', 'github-push', 'vc-outreach', 'linkedin-jobs', 'cold-email']
    }
  }

  // Find all wishes flat list
  const flatWishes: Record<string, Wish> = {}
  ALL_WISHES.forEach(topic => {
    topic.wishes.forEach(wish => {
      flatWishes[wish.id] = wish
    })
  })

  // Get recommended wish objects
  const recommendedWishes: Wish[] = getRecommendedIds(currentWish)
    .map(id => flatWishes[resolveWishId(id)])
    .filter(Boolean)

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }))
  }

  const handleWishAction = (wish: Wish) => {
    if (wish.isActive && wish.path) {
      navigate(wish.path)
    } else {
      setSelectedWishForAccess(wish)
      setIsModalOpen(true)
    }
  }

  // Helper to find a topic title by ID
  const getTopicTitle = (topicId: string): string => {
    return ALL_WISHES.find(t => t.id === topicId)?.title || 'Mystic Wish'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-16 pt-16 border-t border-white/10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-16"
    >
      {isInitializing ? (
        <DiscoverMoreSkeleton />
      ) : (
        <>
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 bg-djinn-purple/20 border border-djinn-purple/30 rounded-full flex items-center justify-center mb-4 shadow-purple-glow">
          <Wand2 className="text-djinn-purple-light" size={24} />
        </div>
        <h2 className="text-3xl font-black text-djinn-text mb-2">Discover More Wishes</h2>
        <p className="text-sm text-djinn-subtext">
          Your wish was granted. Here is what Djinn can do next.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center border-b border-white/5 mb-8">
        <div className="flex gap-8 relative">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              activeTab === 'recommended' ? 'text-djinn-purple-light' : 'text-djinn-subtext hover:text-white'
            }`}
          >
            Recommended for You
            {activeTab === 'recommended' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-djinn-purple"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              activeTab === 'all' ? 'text-djinn-purple-light' : 'text-djinn-subtext hover:text-white'
            }`}
          >
            All Wishes
            {activeTab === 'all' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-djinn-purple"
              />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[250px]">
        {activeTab === 'recommended' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendedWishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                className="card-glow rounded-2xl p-6 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-djinn-purple-light uppercase tracking-wider px-2 py-0.5 rounded bg-djinn-purple/10 border border-djinn-purple/20">
                      {wish.isActive ? 'Active' : 'Locked'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-djinn-text mb-2">{wish.name}</h4>
                  <p className="text-xs text-djinn-subtext line-clamp-3 mb-6">{wish.description}</p>
                </div>

                <motion.button
                  onClick={() => handleWishAction(wish)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    wish.isActive
                      ? 'btn-glow text-white'
                      : 'bg-white/5 border border-white/10 text-djinn-subtext hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {wish.isActive ? (
                    <>
                      <Sparkles size={12} />
                      Make a Wish
                    </>
                  ) : (
                    'Request Access'
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {ALL_WISHES.map(topic => {
              const isExpanded = !!expandedTopics[topic.id]
              const activeCount = topic.wishes.filter(w => w.isActive).length
              return (
                <div key={topic.id} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <h4 className="text-base font-bold text-djinn-text">{topic.title}</h4>
                        <p className="text-xs text-djinn-subtext">
                          {topic.wishes.length} wishes {activeCount > 0 && `• ${activeCount} active`}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="text-djinn-subtext" size={20} />
                    ) : (
                      <ChevronDown className="text-djinn-subtext" size={20} />
                    )}
                  </button>

                  {/* Wishes List */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/20"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5">
                          {topic.wishes.map(wish => (
                            <div
                              key={wish.id}
                              style={{ background: 'linear-gradient(135deg, #16162a, #101830)' }}
                              className="p-4 rounded-xl border border-white/[0.03] flex flex-col justify-between"
                            >
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-bold text-djinn-text">{wish.name}</h5>
                                </div>
                                <p className="text-[11px] text-djinn-subtext leading-relaxed">{wish.description}</p>
                              </div>

                              <button
                                onClick={() => handleWishAction(wish)}
                                className={`w-full py-2 rounded-lg font-semibold text-[10px] flex items-center justify-center gap-1 transition-all ${
                                  wish.isActive
                                    ? 'btn-glow text-white'
                                    : 'bg-white/5 border border-white/10 text-djinn-subtext hover:bg-white/10'
                                }`}
                              >
                                {wish.isActive ? (
                                  <>
                                    <Sparkles size={10} />
                                    Make a Wish
                                  </>
                                ) : (
                                  'Request Access'
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Access Request Modal */}
      {selectedWishForAccess && (
        <RequestAccessModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedWishForAccess(null)
          }}
          wishName={selectedWishForAccess.name}
          wishTopic={getTopicTitle(selectedWishForAccess.topic)}
        />
      )}
      </>
      )}
    </motion.div>
  )
}
