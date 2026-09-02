import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency strictly adhering to styleguide.md Section 30
 * Example: Rp150.000, Rp1.250.000 (No space after Rp, no decimals)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp0';
  return `Rp${Math.round(amount).toLocaleString('id-ID')}`;
}
