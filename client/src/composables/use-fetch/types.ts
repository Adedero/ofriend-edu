export interface FetchConfig {
  baseUrl?: string;
  body?: null | string | FormData | Record<string, unknown>;
  cache?: boolean;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  refetch?: boolean;
  revalidate?: boolean;
  skip?: boolean;
  timeout?: number | null;
  withCredentials?: boolean;
}

export type Done<T> = (data: T) => void | T;


