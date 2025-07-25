// /app/composables/useAuth.ts
import type { User } from '@prisma/client'; // Optional: Import your User type

// The user state is created with useState to be shared across all components and requests.
// It's initialized to null.
const useUser = () => useState<User | null>('user', () => null);

export const useAuth = () => {
  const user = useUser();

  const fetchUser = async () => {
    // If the user state is already populated, don't fetch again.
    if (user.value) {
      return;
    }

    try {
      // $fetch will make a request to the /api/user endpoint.
      // On the server, this is a direct function call. On the client, it's an HTTP request.
      // useRequestHeaders(['cookie']) ensures the cookie is passed along during server-side rendering.
      const userData = await $fetch<User>('/api/user', {
        headers: useRequestHeaders(['cookie']),
      });
      user.value = userData;
    } catch (error) {
      // If the API call fails (e.g., 401 Unauthorized), the user state is cleared.
      user.value = null;
    }
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    fetchUser,
    clearUser,
  };
};