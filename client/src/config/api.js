export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "https://event-nest-system.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://event-nest-system.onrender.com";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://event-nest-system.onrender.com";

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
