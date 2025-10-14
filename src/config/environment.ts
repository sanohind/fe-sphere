// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  fgStoreUrl: import.meta.env.VITE_FG_STORE_URL || 'http://127.0.0.1:8001',
  inventoryUrl: import.meta.env.VITE_INVENTORY_URL || 'http://127.0.0.1:8002',
};
