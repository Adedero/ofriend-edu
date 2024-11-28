export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        return num.toString();
    }
}


export function formatChatDate(date) {
  const now = new Date();
  const inputDate = new Date(date);
  
  // Calculate the difference in days
  /* const oneDay = 24 * 60 * 60 * 1000;
  const timeDiff = now - inputDate;
  const dayDiff = Math.floor(timeDiff / oneDay); */

  // Check if it's today
  if (now.toDateString() === inputDate.toDateString()) {
    return 'Today';
  }

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === inputDate.toDateString()) {
    return 'Yesterday';
  }

  // Check if it's within the same year
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = inputDate.getDate();
  const month = monthNames[inputDate.getMonth()];
  const year = inputDate.getFullYear();

  if (year === now.getFullYear()) {
    return `${day} ${month}`;
  } else {
    return `${day} ${month}, ${year}`;
  }
}

export function useAmOrPm(value) {
  const date = new Date(value);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12? 'PM' : 'AM';

  // Format hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;  // the hour '0' should be '12'

  // Format minutes to always be two digits
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Combine into a string
  const formattedTime = `${hours}:${minutes}${ampm}`;
  return formattedTime;
}

export function formatTime(value, shortMonth = false) {
  const date = new Date(value);
  const now = new Date();
  const timeDiff = now - date;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  const monthNamesFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNames = shortMonth ? monthNamesShort : monthNamesFull;

  // Extract hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Format hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;  // the hour '0' should be '12'

  // Format minutes to always be two digits
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Combine into a string
  const formattedTime = `${hours}:${minutes}${ampm}`;

  if (timeDiff < oneDay) {
    // If the time is less than a day old
    if (timeDiff < 0) {
      // Yesterday
      return 'Yesterday';
    } else {
      // Show the time
      return formattedTime;
    }
  } else {
    // If the time is more than a day old, show the date
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // If the date is from the previous year, include the year
    if (year < now.getFullYear()) {
      return `${day} ${month} ${year}`;
    } else {
      return `${day} ${month}`;
    }
  }
}


export function timeAgo(value) {
    const date = new Date(value)
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (let interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}