interface ErrorCreatorOptions {
  code?: string;
  message: string;
  name? : string;
  status: number;
};
export interface UseFetchError extends Error {
  status?: number;
  code?: string;
};
export default function createError(options: ErrorCreatorOptions) {
  const error: UseFetchError = new Error(options.message);
  error.status = options.status;
  if (options.name) error.name = options.name;
  if (options.code) error.code = options.code;
  return error;
}
