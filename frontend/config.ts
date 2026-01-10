const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  recommendationUrl: import.meta.env.VITE_RECOMMENDATION_URL || "http://localhost:8000",
} as const;

export default config;
