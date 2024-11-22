import { reactive, computed } from 'vue';
import fetcher from './fetcher';
import type { Done, FetchConfig } from '../types';

const cacheMap = reactive<Map<string, unknown>>(new Map());

export default async function cachedFetcher<T = Record<string, unknown>>(
  url: string,
  config: FetchConfig,
  done?: Done<T>
) {
  config.revalidate ??= true;

  // Generate a unique key based on URL and config options (e.g., body, headers)
  const key = url;

  const response = await fetcher<T>(url, { ...config, skip: true });

  const updateCache = () => {
    if (response.data.value !== null && response.data.value !== undefined) {
      cacheMap.set(key, response.data.value);
    }
  };

  const clearCache = () => {
    cacheMap.delete(key);
  };

  const cachedFetch = async () => {
    try {
      await response._fetch(url);
      updateCache();
      if (done) done(response.data.value as T);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const cache = computed(() => cacheMap.get(key) as T | undefined | null);

  // Perform an initial fetch if no cache is found
  if (!cache.value) {
    await cachedFetch();
  } else {
    // Use cached data and start background revalidation if requested
    response.data.value = cache.value;
    response.loading.value = false;

    if (config.revalidate) {
      cachedFetch(); // Revalidate in the background
    }
  }

  // Trigger the done callback with cached data if it exists
  if (done) {
    done(response.data.value as T);
  }

  return {
    ...response,
    _fetch: cachedFetch,    // Triggers a refetch and updates the cache
    data: cache,           // Computed ref holding cached data
    clearCache,            // Clears the cache for this key
    loading: response.loading, // Loading status
    error: response.error,      // Error status
  };
}
