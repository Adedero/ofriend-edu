function maskEmail(email: string) {
  const [localPart, domain] = email.split('@');
  if (localPart.length < 4) {
    return email;
  }
  const maskedLocalPart = localPart.slice(0, 3) + '**********';
  return `${maskedLocalPart}@${domain}`;
}

export default maskEmail;
