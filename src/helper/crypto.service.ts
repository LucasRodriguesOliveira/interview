import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

export class CryptoService {
  private static readonly KEY = scryptSync(
    '321aaa13-7747-4dbb-bd49-972fd7268211',
    'salt',
    32,
  );
  private static readonly IV = scryptSync('iv-salt', 'salt', 16);
  private static readonly ALGORITHM = 'aes-256-cbc';

  static encrypt(text: string): string {
    const cipher = createCipheriv(this.ALGORITHM, this.KEY, this.IV);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    return encrypted.toString('hex');
  }

  static decrypt(text: string): string {
    const encrypted = Buffer.from(text, 'hex');
    const decipher = createDecipheriv(this.ALGORITHM, this.KEY, this.IV);
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
  }
}
