import { getDateFormat } from "./functions/format-date";
import { useTimeAgo } from "./functions/time-ago";

export default function useDate(dateString: string | Date | null | undefined) {
  let date = null;
  if (!dateString) {
    date = Date.now();
  }
  date = new Date(dateString as string | Date);
  const useDateObject = {
    date,
    formatDate() { return getDateFormat(this.date) },
    timeAgo() { return useTimeAgo(this.date) }
  }
  return useDateObject
}


