/**
 * SkeletonShapes.tsx
 * Shared skeleton primitive components. All shimmer styles imported from SkeletonShimmer.css.
 * Never duplicate shimmer styles — always import from this file's parent CSS.
 */

import React from 'react'
import '../SkeletonShimmer.css'

/* ─── SkeletonRect ─────────────────────────────────────────── */
interface SkeletonRectProps {
  width?: number | string
  height?: number | string
  borderRadius?: number | string
  className?: string
  style?: React.CSSProperties
}

export function SkeletonRect({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
  style = {}
}: SkeletonRectProps) {
  return (
    <div
      className={`skeleton-shape ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        flexShrink: 0,
        ...style
      }}
    />
  )
}

/* ─── SkeletonCircle ───────────────────────────────────────── */
interface SkeletonCircleProps {
  size?: number
  className?: string
}

export function SkeletonCircle({ size = 40, className = '' }: SkeletonCircleProps) {
  return (
    <div
      className={`skeleton-shape skeleton-circle ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

/* ─── SkeletonText ─────────────────────────────────────────── */
interface SkeletonTextProps {
  width?: number | string
  lines?: number
  className?: string
}

export function SkeletonText({ width = '100%', lines = 1, className = '' }: SkeletonTextProps) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonRect
          key={i}
          width={i === lines - 1 && lines > 1 ? '70%' : width}
          height={14}
          borderRadius={6}
        />
      ))}
    </div>
  )
}

/* ─── SkeletonCard ─────────────────────────────────────────── */
interface SkeletonCardProps {
  className?: string
  style?: React.CSSProperties
}

export function SkeletonCard({ className = '', style = {} }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col gap-4 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: 200,
        ...style
      }}
    >
      {/* Header shimmer area */}
      <SkeletonRect width="100%" height={60} borderRadius={12} />
      {/* Two text lines */}
      <SkeletonText width="80%" lines={2} />
      {/* Button shimmer */}
      <SkeletonRect width="100%" height={40} borderRadius={12} style={{ marginTop: 'auto' }} />
    </div>
  )
}

/* ─── SkeletonGrid ─────────────────────────────────────────── */
interface SkeletonGridProps {
  columns?: number
  count?: number
  className?: string
}

export function SkeletonGrid({ columns = 3, count = 6, className = '' }: SkeletonGridProps) {
  const gridCols =
    columns === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1'

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/* ─── Skeleton Error State ─────────────────────────────────── */
interface SkeletonErrorProps {
  onRetry?: () => void
}

export function SkeletonError({ onRetry }: SkeletonErrorProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
      style={{ background: '#020817' }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <span style={{ fontSize: 20 }}>⏱</span>
      </div>
      <div>
        <p className="text-white font-semibold text-base mb-1">Something took longer than expected</p>
        <p className="text-slate-400 text-sm">The data is taking a while to arrive.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
