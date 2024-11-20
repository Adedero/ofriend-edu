import useUserStore from "@/stores/user.store";
import type { Router } from "vue-router";

export default function signout(router: Router, redirectUrl?: string) {
  const userStore = useUserStore();
  localStorage.removeItem(`user-${userStore.user?.id}`);
  if (router) {
    router.push({
      name: 'sign-in',
      query: {
        redirect: redirectUrl ?? ''
      }
    });
  }
};
