import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  console.log(`[Server Middleware] Running for: ${event.path}`);

  const token = getCookie(event, 'auth_token');
  const jwtSecret = process.env.JWT_SECRET;

  if (token && jwtSecret) {
    console.log('[Server Middleware] Found auth_token cookie.');
    try {
      const decoded = jwt.verify(token, jwtSecret);
      event.context.user = decoded;
      console.log('[Server Middleware] Token verified successfully. User context set:', event.context.user);
    } catch (error: any) {
      console.error('[Server Middleware] Token verification FAILED:', error.message);
      event.context.user = null;
    }
  } else {
    console.log('[Server Middleware] No auth_token cookie found.');
    event.context.user = null;
  }
});