export default defineEventHandler((event) => {
    // Clear the cookie by setting its value to empty and maxAge to 0
    setCookie(event, 'auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire the cookie immediately
        path: '/',
    });

    return { status: 'ok', message: 'Logged out' };
});