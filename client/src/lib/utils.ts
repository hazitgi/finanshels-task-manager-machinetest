import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function makeSlug(input: string): string {
  return input
    .toLowerCase()         // Convert to lowercase
    .replace(/\s+/g, '-')  // Replace all whitespace characters with dashes
    .replace(/[^a-z0-9\-]/g, ''); // Remove any non-alphanumeric characters except dashes
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}