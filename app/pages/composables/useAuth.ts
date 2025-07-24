export const useAuth = () => {
  // Use Nuxt's useState for server- and client-side shared state
  const user = useState('user', () => null);
  return { user };
};