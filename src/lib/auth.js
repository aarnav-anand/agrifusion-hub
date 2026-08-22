/**
 * Client-side SHA-256 password hashing using the Web Crypto API.
 * Runs only in the browser; returns the plain string on the server
 * (Next.js server components don't need to hash passwords).
 */
export async function hashPassword(password) {
  if (typeof window === 'undefined') return password;
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
