import type { Router } from "vue-router";
import type { UseFetchError } from "./fetch-error-creator";
import signout from "@/utils/functions/signout";

export default function fetchErrorHandler (error: UseFetchError | null, router: Router) {
  if (!error) {
    return null;
  }
  if (error.status === 401) {
    /* if (error.name === 'SuspiciousLoginAttemptError') {
      return null;
    } */
    signout(router, router.currentRoute.value.fullPath);
    return null;
  }
  if (error.status === 403) {
    router.push('/403');
    return null;
  }
  if (error.status === 404) {
    router.push('/404');
    return error;
  }
  if (error.name === 'AbortError') {
    return new Error('That took too long. Check your internet connection and try again.');
  }
  return error;
}
