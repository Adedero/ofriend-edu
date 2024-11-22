import { ref, watch } from 'vue';
import useUserStore from '@/stores/user.store';
import createError, { type UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import type { FetchConfig, Done } from '../types';
import fetchErrorHandler from './fetch-error-handler';


export default async function fetcher<T = Record<string, unknown>>(url: string, config: FetchConfig, done?: Done<T>) {

  const loading = ref(false);
  const error = ref<null | UseFetchError>(null);
  const data = ref<null | T>(null);
  const status = ref<null | number>(null);
  const canAbort = ref(false);
  const TIMEOUT = config.timeout || 60 * 1000;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const _fetch = async (api: string) => {
    if (loading.value) return;

    const headers: HeadersInit = {};

    const body = config.body ?
      (config.body instanceof FormData ? config.body : JSON.stringify(config.body)) :
      null;

    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (config.withCredentials) {
      const userStore = useUserStore();
      const token = userStore.user?.token ?? '';
      if (!token) {
        throw createError({ code: 'INVALID_AUTHENTICATION_TOKEN', message: 'Invalid token.', status: 401 });
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const abortController = new AbortController();
    const abort = () => abortController.abort();

    loading.value = true;
    canAbort.value = true;
    timer = setTimeout(abort, TIMEOUT);

    const fullUrl = `${config.baseUrl || import.meta.env.VITE_API_URL}/${api.startsWith('/') ? api.slice(1) : api}`;

    const fetchApiOptions = {
      method: config.method || 'GET',
      headers: { ...headers, ...config.headers } as HeadersInit,
      body,
      signal: abortController.signal,
    }

    try {
      const response = await fetch(fullUrl, fetchApiOptions);

      const payload = await response.json();
      status.value = response.status;
      canAbort.value = false;

      if (status.value >= 400 && status.value < 600) {
        throw createError({
          code: payload.info || 'API_ERROR',
          message: payload.message || 'An error occurred.',
          name: payload.errorName || 'RequestError',
          status: status.value
        });
      }

      data.value = payload;
      if (done && typeof done === 'function') done(data.value);
    } catch (err) {
      if (config.router) {
        error.value = fetchErrorHandler(err as UseFetchError, config.router);
        return;
      }
      error.value = err as UseFetchError;
    } finally {
      loading.value = false;
      if (timer) clearTimeout(timer);
    }
  };

  if (!config.skip) await _fetch(url);

  watch(() => url, async (newValue) => {
    if (config.refetch) await _fetch(newValue);
  });

  return { _fetch, canAbort, data, error, loading, status };
}
