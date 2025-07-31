import type { User } from '@prisma/client';

const useUser = () => useState<User | null>('user', () => null);

export const useAuth = () => {
  const user = useUser();

  const fetchUser = async () => {
    if (user.value) {
      return;
    }

    try {
      const userData = await $fetch<User>('/api/user', {
        headers: useRequestHeaders(['cookie']),
      });
      user.value = userData;
    } catch (error) {
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