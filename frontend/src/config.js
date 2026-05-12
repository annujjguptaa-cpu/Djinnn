/**
 * Global configuration for the Djinn frontend.
 * The API_URL is determined by the VITE_API_URL environment variable,
 * falling back to localhost for development.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE = `${API_URL}/api`;
