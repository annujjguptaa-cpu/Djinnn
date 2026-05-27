import React from 'react'
import logo from '../assets/logo.jpg'
import './SkeletonShimmer.css'

interface SkeletonLoaderProps {
  isExiting: boolean;
  onTransitionEnd: () => void;
}

export default function SkeletonLoader({ isExiting, onTransitionEnd }: SkeletonLoaderProps) {
  return (
    <div 
      className={`skeleton-overlay ${isExiting ? 'fade-out' : ''}`}
      onTransitionEnd={onTransitionEnd}
    >
      {/* Navbar Skeleton */}
      <div className="skeleton-navbar">
        <div className="skeleton-nav-left">
          <div className="skeleton-shape skeleton-circle skeleton-logo-placeholder" />
        </div>
        <div className="skeleton-nav-right">
          <div className="skeleton-shape skeleton-nav-tab" />
          <div className="skeleton-shape skeleton-nav-tab" />
          <div className="skeleton-shape skeleton-nav-tab" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="skeleton-hero">
        {/* Subtle branded logo/wordmark above the lamp (15% opacity) */}
        <div className="skeleton-brand-logo">
          <img src={logo} alt="Djinn Logo" className="skeleton-brand-image" />
          <span className="skeleton-brand-text">Djinn</span>
        </div>

        {/* Genie Lamp Placeholder */}
        <div className="skeleton-shape skeleton-circle skeleton-lamp-placeholder" />

        {/* Badge Placeholder */}
        <div className="skeleton-shape skeleton-badge-placeholder" />

        {/* Heading stacked placeholders */}
        <div className="skeleton-heading-container">
          <div className="skeleton-shape skeleton-heading-line1" />
          <div className="skeleton-shape skeleton-heading-line2" />
        </div>

        {/* Subtitle stacked placeholders */}
        <div className="skeleton-subtitle-container">
          <div className="skeleton-shape skeleton-subtitle-line1" />
          <div className="skeleton-shape skeleton-subtitle-line2" />
        </div>

        {/* Stats Row placeholders */}
        <div className="skeleton-stats-container">
          <div className="skeleton-shape skeleton-stat-block" />
          <div className="skeleton-shape skeleton-stat-block" />
          <div className="skeleton-shape skeleton-stat-block" />
        </div>

        {/* Button placeholders */}
        <div className="skeleton-buttons-container">
          <div className="skeleton-shape skeleton-button-placeholder" />
          <div className="skeleton-shape skeleton-button-placeholder" />
        </div>
      </div>

      {/* Progress Line (2px) at the very bottom */}
      <div className="skeleton-progress-bar-container">
        <div className="skeleton-progress-bar-fill" />
      </div>
    </div>
  )
}
