/**
 * @param minutes
 * @returns { code: string; expiresAt: Date}
 */
export const generateExpiryCode = (minutes = 30) => ({
  code: Math.floor(1000 + Math.random() * 9000).toString(),
  expiresAt: new Date(Date.now() + minutes * 60 * 1000),
});
