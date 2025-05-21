import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/[^\d]/g, '');

  let result = '+';
  if (digits.length > 0) result += digits.slice(0, 3); // country code
  if (digits.length > 3) result += '-(' + digits.slice(3, 5); // first part
  if (digits.length > 5) result += ')-' + digits.slice(5, 8); // second part
  if (digits.length > 8) result += '-' + digits.slice(8, 10); // third part
  if (digits.length > 10) result += '-' + digits.slice(10, 13); // fourth part

  return result;
}

export function unformatPhoneNumber(phoneNumber: string) {
  // Saqlanadigan versiyada "+" belgisi ham bo'ladi
  const digits = phoneNumber.replace(/[^\d]/g, '');
  return '+' + digits;
}
