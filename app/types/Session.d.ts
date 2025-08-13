// app/types/session.d.ts
import 'nuxt-auth-utils'

// By declaring this module, we are telling nuxt-auth-utils
// what to expect inside its session data.
declare module 'nuxt-auth-utils' {
  interface UserSession {
    // We define that our session can have a user object
    // with this specific structure.
    user?: {
      id: string;
      email: string;
      name: string | null;
      isAdmin: boolean;
    }
  }
}