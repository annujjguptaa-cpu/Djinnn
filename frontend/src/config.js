/**
 * Global configuration for the Djinn frontend.
 * The API_URL is determined by the VITE_API_URL environment variable,
 * falling back to localhost for development.
 */
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');
export const API_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
export const API_BASE = `${API_URL}/api`;
