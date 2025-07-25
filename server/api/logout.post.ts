// server/api/logout.post.ts
export default defineEventHandler((event) => {
  // Clear the cookie by setting its value to empty and maxAge to -1
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0, // Tell the browser to expire the cookie immediately
  });

  return { status: 'ok', message: 'Logged out' };
});