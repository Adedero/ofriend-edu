import { shorten } from './functions';

export default function useNumber (value: number | string) {
  const number = typeof value === 'string' ? parseInt(value) : value;

  const useNumberObject = {
    number,
    shorten() { return shorten(this.number) }
  }
  return useNumberObject;
}
