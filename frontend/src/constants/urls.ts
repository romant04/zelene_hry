import { env } from '$env/dynamic/public';

export const API = env.PUBLIC_API_URL || 'http://localhost:8080';
export const WEBSOCKET = env.PUBLIC_SOCKET_URL || 'http://localhost:3000';
// Public address of this website, used for canonical / hreflang / sitemap URLs
export const SITE_URL = (env.PUBLIC_SITE_URL || 'https://www.zelene-hry.com').replace(/\/$/, '');
