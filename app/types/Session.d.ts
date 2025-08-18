import 'nuxt-auth-utils'

declare module 'nuxt-auth-utils' {
  interface UserSession {
    user?: {
      id: string;
      email: string;
      name: string | null;
      isAdmin: boolean;
    }
  }
}