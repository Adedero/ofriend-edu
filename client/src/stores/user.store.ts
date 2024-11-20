import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@/types/user.type';

const useUserStore = defineStore('user', () => {
  const user = ref<Partial<User> | null>(null);

   const setUser = (userId: string | undefined, value?: Partial<User> | null) => {
    if (typeof userId !== 'string') return;

    if (value) {
      localStorage.setItem(`user-${userId}`, JSON.stringify(value));
      user.value = value;
    } else {
      const storedUser = localStorage.getItem(`user-${userId}`);
      user.value = storedUser ? JSON.parse(storedUser) : null;
    }
  }
  return { setUser, user }
});

export default useUserStore;
