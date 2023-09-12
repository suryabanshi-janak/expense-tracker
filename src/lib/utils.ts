import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // replace one or more consecutive whitespace characters with a single hyphen
    .replace(/[^\w-]+/g, '') // remove any characters that are not word characters or hyphens
    .replace(/--+/g, '-'); // replaces one or more consecutive hyphens with a single hyphen
}
