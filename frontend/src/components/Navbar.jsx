import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/logo.jpg'

const DjinnLogo = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-djinn-purple/50 shadow-purple-glow">
        <img src={logo} alt="Djinn Logo" className="w-full h-full object-cover scale-110" />
      </div>
      <div className="absolute -inset-1 rounded-full bg-djinn-purple opacity-20 blur-sm animate-pulse" />
    </div>
    <span className="text-2xl font-black tracking-tighter text-gradient">Djinn</span>
  </div>
)

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/auto-post', label: 'Auto Post' },
    { to: '/auto-connect', label: 'Auto Connect' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-djinn-border"
      style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <DjinnLogo />
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-djinn-purple/20 text-djinn-purple-light border border-djinn-purple/30'
                  : 'text-djinn-subtext hover:text-djinn-text hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
