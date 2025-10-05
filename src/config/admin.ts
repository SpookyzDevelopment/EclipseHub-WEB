// Admin credentials - In production, use environment variables
export const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@eclipcestore.digital',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'Admin123!@#',
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];
