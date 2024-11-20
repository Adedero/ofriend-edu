export default function useDate(dateString: string | Date | null | undefined) {
  let date = null;

  if (!dateString) {
    date = Date.now();
  }
  
  date = new Date(dateString as string | Date);

  const useDateObject = {
    date,
    formatDate() {
      return getDateFormat(this.date)
    }
  }

  return useDateObject
}

function getDateFormat (date: Date) {
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}