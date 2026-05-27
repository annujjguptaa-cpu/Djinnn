import React, { useEffect, useState } from 'react'
import diwaliBg from '../assets/diwali_bg.jpg'

export default function FloatingLanterns() {
  const [delayedStart, setDelayedStart] = useState(false)

  // Delay startup by 400ms to match the skeleton loader fade-out transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedStart(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  if (!delayedStart) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `url(${diwaliBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'block'
      }}
    />
  )
}
