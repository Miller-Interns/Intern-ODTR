export default defineEventHandler((event) => {
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  });

  return { status: 'ok', message: 'Logged out' };
});