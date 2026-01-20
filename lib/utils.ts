import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DivisionAssignment } from "@/app/lib/definitions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

