import { AES, enc } from 'crypto-js';

export function encryptSecretKey(secretKey) {
  const KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY;
  const IV = process.env.REACT_APP_CRYPTO_IV_KEY;

  const encrypted = AES.encrypt(secretKey, KEY, { iv: IV });
  const encryptedHex = encrypted.toString();

  return encryptedHex;
}

export function decryptSecretKey(encryptedSecretKey) {
  const KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY;
  const IV = process.env.REACT_APP_CRYPTO_IV_KEY;

  const decrypted = AES.decrypt(encryptedSecretKey, KEY, { iv: IV });
  const decryptedText = decrypted.toString(enc.Utf8);

  return decryptedText;
}
