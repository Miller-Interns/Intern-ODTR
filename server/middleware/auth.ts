import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
    const token = getCookie(event, 'auth-token');
    const jwtSecret = process.env.JWT_SECRET;

    if (token && jwtSecret) {
        try {
            // Verify the token and decode the payload
            const decoded = jwt.verify(token, jwtSecret);
            // Attach the user payload to the event context
            event.context.user = decoded;
        } catch (error) {
            // If token is invalid, clear it and proceed as an unauthenticated user
            event.context.user = null;
            // Optional: you could clear the invalid cookie here
            // setCookie(event, 'auth-token', '', { maxAge: 0, path: '/' });
        }
    } else {
        event.context.user = null;
    }
});