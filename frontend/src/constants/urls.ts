import { env } from '$env/dynamic/public';

export const API = env.PUBLIC_API_URL || 'http://localhost:8080';
export const WEBSOCKET = env.PUBLIC_SOCKET_URL || 'http://localhost:3000';
