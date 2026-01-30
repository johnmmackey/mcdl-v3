import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DivisionAssignment } from "@/app/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

