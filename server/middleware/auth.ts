// server/middleware/auth.ts
import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  // We are logging the path to see which requests this middleware runs for.
  console.log(`[Server Middleware] Running for: ${event.path}`);

  const token = getCookie(event, 'auth_token'); // Make sure name is 'auth_token'
  const jwtSecret = process.env.JWT_SECRET;

  if (token && jwtSecret) {
    console.log('[Server Middleware] Found auth_token cookie.');
    try {
      // Try to verify the token
      const decoded = jwt.verify(token, jwtSecret);
      // If successful, attach the user payload to the event.
      event.context.user = decoded;
      console.log('[Server Middleware] Token verified successfully. User context set:', event.context.user);
    } catch (error: any) {
      // If token is invalid (expired, wrong signature, etc.)
      console.error('[Server Middleware] Token verification FAILED:', error.message);
      event.context.user = null;
    }
  } else {
    // No token was found in the request.
    console.log('[Server Middleware] No auth_token cookie found.');
    event.context.user = null;
  }
});