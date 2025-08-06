import type { H3Event } from 'h3';

export const logoutUser = (event: H3Event) => {
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0, // expire immediately
  })

  return { status: 'ok', message: 'Logged out' }
}
