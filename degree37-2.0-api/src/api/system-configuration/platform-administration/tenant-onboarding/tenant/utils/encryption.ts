import { AES, enc } from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();
// Encryption function
export function encryptSecretKey(secretKey: string): string {
  const KEY = process.env.CRYPTO_SECRET_KEY;
  const IV = process.env.CRYPTO_IV_KEY;

  const encrypted = AES.encrypt(secretKey, KEY, { iv: IV });
  return encrypted.toString();
}

// Decryption function
export function decryptSecretKey(encryptedSecretKey: string): string {
  const KEY = process.env.CRYPTO_SECRET_KEY;
  const IV = process.env.CRYPTO_IV_KEY;

  const decrypted = AES.decrypt(encryptedSecretKey, KEY, { iv: IV });
  return decrypted.toString(enc.Utf8);
}
