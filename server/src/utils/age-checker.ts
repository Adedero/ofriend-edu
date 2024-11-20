export default function isOldEnough(dateString: string | Date, ageLimit: number) {
  if (!dateString) return false;
  const dob = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  if (age > ageLimit) {
    return true;
  } else if (age === ageLimit) {
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff > 0) {
      return true;
    } else if (monthDiff === 0) {
      const dayDiff = today.getDate() - dob.getDate();
      return dayDiff >= 0;
    }
  }
  return false;
}
