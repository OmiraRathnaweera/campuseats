// Read the backend API base URL from the Vite environment variable VITE_API_URL
const rawBaseUrl = import.meta.env.VITE_API_URL || "";

// Normalize base URL (strip any trailing slashes)
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

/**
 * Builds the full URL for an API endpoint.
 * When VITE_API_URL is configured (e.g., https://campuseats-api.onrender.com),
 * it returns `${VITE_API_URL}/api/...`.
 * If VITE_API_URL is not configured, it falls back to the relative path `/api/...`
 * which is automatically proxied during local development.
 */
export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};
