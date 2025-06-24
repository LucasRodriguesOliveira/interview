export interface ICryptoService {
  encrypt(text: string): string;
  decrypt(text: string): string;
}
