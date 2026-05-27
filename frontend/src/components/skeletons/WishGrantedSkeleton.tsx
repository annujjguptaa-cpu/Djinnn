/**
 * WishGrantedSkeleton.tsx
 * Skeleton loading screen for Wish Granted result pages.
 * Used in all 6 new use case granted pages + existing granted screens.
 */

import React from 'react'
import { SkeletonRect, SkeletonCircle, SkeletonText } from './SkeletonShapes'
import '../SkeletonShimmer.css'

export default function WishGrantedSkeleton() {
  return (
    <div
      style={{
        background: '#020817',
        minHeight: '60vh',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 800 }}>

        {/* Center circle — granted animation placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <SkeletonCircle size={80} />
        </div>

        {/* "Your wish is granted" heading */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <SkeletonRect width={240} height={36} />
        </div>

        {/* Summary subtitle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <SkeletonRect width={180} height={20} />
        </div>

        {/* Summary stats card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: 24,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 32,
            gap: 16,
          }}
        >
          {[0, 1, 2].map(i => (
            <SkeletonRect key={i} width="30%" height={56} borderRadius={8} />
          ))}
        </div>

        {/* Results list heading */}
        <SkeletonRect width={160} height={24} style={{ marginBottom: 16 }} />

        {/* 6 result rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <ResultRowSkeleton key={i} />
          ))}
        </div>

        {/* Discover More placeholder */}
        <SkeletonRect width="100%" height={120} borderRadius={16} />
      </div>
    </div>
  )
}

function ResultRowSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        height: 64,
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 12,
      }}
    >
      {/* Company logo placeholder */}
      <SkeletonCircle size={32} />
      {/* Company name + job title */}
      <div style={{ flex: 1 }}>
        <SkeletonText width="60%" lines={2} />
      </div>
      {/* Status badge */}
      <SkeletonRect width={80} height={24} borderRadius={20} />
    </div>
  )
}
