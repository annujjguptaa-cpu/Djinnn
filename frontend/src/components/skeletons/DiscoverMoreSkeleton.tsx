/**
 * DiscoverMoreSkeleton.tsx
 * Skeleton loading screen rendered inside the DiscoverMoreWishes component.
 * Displayed for max 600ms until allWishes data is ready.
 */

import React from 'react'
import { SkeletonRect, SkeletonCircle, SkeletonCard } from './SkeletonShapes'
import '../SkeletonShimmer.css'

export default function DiscoverMoreSkeleton() {
  return (
    <div style={{ padding: '24px 0' }}>

      {/* Section header — icon + heading inline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <SkeletonCircle size={32} />
        <SkeletonRect width={200} height={28} />
      </div>

      {/* Tab bar — two tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <SkeletonRect width={140} height={36} borderRadius={12} />
        <SkeletonRect width={140} height={36} borderRadius={12} />
      </div>

      {/* Recommendation cards — horizontal scrollable row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 8,
        }}
      >
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flexShrink: 0, width: 200 }}>
            <SkeletonCard style={{ minHeight: 160 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
