/**
 * VaultSkeleton.tsx
 * Skeleton loading screen for the Vault / Wish History page.
 */

import React from 'react'
import { SkeletonRect, SkeletonCircle, SkeletonText } from './SkeletonShapes'
import '../SkeletonShimmer.css'

export default function VaultSkeleton() {
  return (
    <div style={{ background: '#020817', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Page title + subtitle */}
        <div style={{ marginBottom: 32 }}>
          <SkeletonRect width={200} height={36} style={{ marginBottom: 12 }} />
          <SkeletonRect width={300} height={20} />
        </div>

        {/* Filter / tab bar — 3 pill tabs side by side */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {[0, 1, 2].map(i => (
            <SkeletonRect key={i} width={100} height={36} borderRadius={12} />
          ))}
        </div>

        {/* 4 vault entry cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <VaultEntryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function VaultEntryCardSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        height: 100,
        boxSizing: 'border-box',
      }}
    >
      {/* Left: wish type icon */}
      <SkeletonCircle size={40} />

      {/* Middle: wish name, company list, timestamp */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <SkeletonText width="60%" lines={3} />
      </div>

      {/* Right: expand button */}
      <SkeletonRect width={80} height={32} borderRadius={8} />
    </div>
  )
}
