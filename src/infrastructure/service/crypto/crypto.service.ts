import { createCipheriv, createDecipheriv } from 'crypto';
import { ICryptoService } from '../../../domain/service/crypto.interface';
import { ALGORITHM, IV, KEY } from './crypto.constants';

export class CryptoService implements ICryptoService {
  encrypt(text: string): string {
    const cipher = createCipheriv(ALGORITHM, KEY, IV);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    return encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const encrypted = Buffer.from(text, 'hex');
    const decipher = createDecipheriv(ALGORITHM, KEY, IV);
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
  }
}
