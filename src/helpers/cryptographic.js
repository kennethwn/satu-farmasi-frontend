import CryptoJS from 'crypto-js';

export const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
export const decryptData = (cipherText) => JSON.parse(CryptoJS.AES.decrypt(cipherText, secretKey).toString(CryptoJS.enc.Utf8));