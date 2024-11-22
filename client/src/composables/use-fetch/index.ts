import type { Ref } from "vue";
import cachedFetcher from "./functions/cached-fetcher";
import fetcher from "./functions/fetcher";
import type { Done, FetchConfig } from "./types";
import type { UseFetchError } from "./functions/fetch-error-creator";

const options: FetchConfig = {
  cache: false,
  revalidate: true,
  skip: false,
  refetch: false,
  withCredentials: true,
  timeout: 60 * 1000,
  body: null,
  method: 'GET',
  headers: {},
  router: null,
}

export default async function useFetch<T = Record<string, unknown>>(url: string, config?: FetchConfig, done?: Done<T>) {
  config = {
    ...options,
    ...config
  }
  if (config.cache) {
    const res = await cachedFetcher(url, config, done);
    return res;
  }
  const res = await fetcher<T>(url, config, done);
  return {
    ...res,
    clearCache: () => {}
  };
}
