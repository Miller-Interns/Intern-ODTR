// composables/useAuth.ts
import { type User } from '@prisma/client';

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);

  /**
   * Fetches the current user's data from the server API.
   * This is used to re-populate the user state on app load (e.g., page refresh).
   */
  const fetchUser = async () => {
    // If we already have the user, don't fetch it again.
    if (user.value) {
      return;
    }

    try {
      // Use $fetch to call our new API endpoint.
      // The `auth-token` cookie is automatically sent by the browser.
      // We are casting the result to User.
      const data = await $fetch<User>('/api/user');
      user.value = data;
    } catch (error) {
      // If the API call fails (e.g., 401 Unauthorized), the user state remains null.
      user.value = null;
    }
  };

  return {
    user,
    fetchUser,
  };
};