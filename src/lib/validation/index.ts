// Validation schemas and helper assertions for Seafarer & Training submissions

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const phoneClean = phone.replace(/[\s\-\+\(\)]/g, '');
  return phoneClean.length >= 8 && phoneClean.length <= 15;
}

export function isValidPassport(passport: string): boolean {
  // Common alphanumeric passport pattern
  return /^[A-Z0-9]{6,12}$/i.test(passport.trim());
}

export function isValidCDC(cdc: string): boolean {
  // CDC format verification
  return cdc.trim().length >= 4;
}
