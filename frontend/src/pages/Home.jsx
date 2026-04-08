import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import { Sparkles, Share2, Users } from 'lucide-react'
import logo from '../assets/logo.jpg'

const DjinnLamp = () => (
  <div className="relative flex items-center justify-center w-64 h-64 mx-auto mb-12">
    {/* Orbit rings */}
    <div className="orbit-ring w-56 h-56 border-djinn-purple/20" style={{ animationDuration: '8s' }} />
    <div className="orbit-ring w-44 h-44" style={{ animationDuration: '5s', animationDirection: 'reverse', borderColor: 'rgba(167,139,250,0.1)' }} />

    {/* Glow core */}
    <div className="absolute inset-0 rounded-full bg-djinn-purple opacity-20 blur-3xl animate-pulse" />

    {/* Artwork */}
    <motion.div
      animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-4 border-djinn-purple/30 shadow-purple-glow-lg"
    >
      <img src={logo} alt="Djinn Artwork" className="w-full h-full object-cover scale-110" />
    </motion.div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description, badge, buttonLabel, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -4 }}
    className="card-glow rounded-2xl p-8 flex flex-col gap-6"
    style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
  >
    {/* Icon */}
    <div className="w-14 h-14 rounded-xl bg-djinn-purple/20 border border-djinn-purple/30 flex items-center justify-center">
      <Icon className="text-djinn-purple-light" size={26} />
    </div>

    {/* Badge */}
    <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-xs font-medium">
      <Sparkles size={10} />
      {badge}
    </div>

    {/* Text */}
    <div>
      <h3 className="text-2xl font-bold text-djinn-text mb-2">{title}</h3>
      <p className="text-djinn-subtext leading-relaxed">{description}</p>
    </div>

    {/* Features list */}
    <ul className="space-y-2 text-sm text-djinn-subtext">
      {title.includes('Social Post') ? (
        <>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Choose LinkedIn or X (Twitter)</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Upload image → AI writes caption</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Dynamic social post previews</li>
        </>
      ) : (
        <>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Target by role & location</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Personalize your message</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-djinn-purple inline-block"/>Auto-connect campaigns</li>
        </>
      )}
    </ul>

    {/* CTA Button */}
    <motion.button
      id={`btn-${title.replace(/\s+/g, '-').toLowerCase()}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="btn-glow w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-auto"
    >
      <Sparkles size={16} />
      {buttonLabel}
    </motion.button>
  </motion.div>
)

export default function Home() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero Section */}
        <div className="text-center mb-20">
          <DjinnLamp />

            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-djinn-purple/10 border border-djinn-purple/20 text-djinn-purple-light text-sm font-medium mb-6"
          >
            <Sparkles size={14} />
            Omni-Platform Social Automation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl md:text-7xl font-black mb-4 leading-tight"
          >
            <span className="text-djinn-text">You wish it.</span>
            <br />
            <span className="text-gradient">Djinn does it.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-djinn-subtext text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Your AI genie for LinkedIn & X — automate posts, grow your network, and
            share magic links that work for you while you sleep.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-10 mt-10"
          >
            {[['10x', 'Faster Posts'], ['500+', 'Connections/Week'], ['100%', 'AI-Powered']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-gradient">{num}</div>
                <div className="text-xs text-djinn-subtext mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon={Share2}
            title="Omni Social Post"
            description="Upload an image and let Djinn craft the perfect post for LinkedIn or X. Preview your feed and share it instantly."
            badge="LinkedIn & X Support"
            buttonLabel="Make a Wish"
            onClick={() => navigate('/auto-post')}
            delay={0.6}
          />
          <FeatureCard
            icon={Users}
            title="LinkedIn Auto Connect"
            description="Define your ideal connection — role, location, message. Djinn builds your network on autopilot."
            badge="Network Automation"
            buttonLabel="Make a Wish"
            onClick={() => navigate('/auto-connect')}
            delay={0.7}
          />
        </div>

        {/* Bottom glow decoration */}
        <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-djinn-purple opacity-5 blur-[100px] rounded-full" />
      </div>
    </PageWrapper>
  )
}
