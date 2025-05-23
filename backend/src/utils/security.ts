import crypto from 'crypto';

// Create an anonymous hash for the reporter
export const createReporterHash = (ipAddress: string): string => {
  // Add a salt from environment variables in production
  const salt = process.env.HASH_SALT || 'default-salt';
  
  // Create a SHA-256 hash of the IP + salt
  return crypto
    .createHash('sha256')
    .update(ipAddress + salt)
    .digest('hex');
};