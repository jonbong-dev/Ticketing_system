// Simple password encoding/decoding for localStorage
// Note: This is basic encoding, not encryption. For production, use a backend with proper authentication.

export function encodePassword(password: string): string {
  // Simple base64 encoding for demo purposes
  // In production, use proper backend authentication with bcrypt/argon2
  return btoa(password);
}

export function decodePassword(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}

export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // Decode the stored password and compare
  const decoded = decodePassword(storedPassword);
  return inputPassword === decoded;
}
