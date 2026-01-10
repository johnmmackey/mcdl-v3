export function userInitials(name?: string, fallback = "?"): string {
  if (!name) return fallback;

  // Split on whitespace and remove empty parts
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return fallback;
  }

  if (parts.length === 1) {
    // Single-word name: first two letters if possible
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Multi-word name: first letter of first and last words
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
}
