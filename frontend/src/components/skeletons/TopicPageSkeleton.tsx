/**
 * TopicPageSkeleton.tsx
 * Skeleton loading screen for Topic inner pages.
 * Used once in Topic.jsx; applies to all 15 topic pages automatically.
 */

import React from 'react'
import { SkeletonRect, SkeletonCircle, SkeletonGrid } from './SkeletonShapes'
import '../SkeletonShimmer.css'

export default function TopicPageSkeleton() {
  return (
    <div style={{ background: '#020817', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Back button placeholder */}
        <SkeletonRect width={80} height={32} borderRadius={8} style={{ marginBottom: 48 }} />

        {/* Hero Header — centered icon + title + subtitle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 48,
          }}
        >
          <SkeletonCircle size={80} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SkeletonRect width={280} height={40} />
            <SkeletonRect width={200} height={24} />
          </div>
        </div>

        {/* Use case card grid — 15 skeleton cards, 3 col on desktop */}
        <SkeletonGrid columns={3} count={15} />
      </div>
    </div>
  )
}
