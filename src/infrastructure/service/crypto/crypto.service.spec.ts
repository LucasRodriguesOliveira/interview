import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe(CryptoService.name, () => {
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    cryptoService = app.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(cryptoService).toBeDefined();
  });

  describe('encrypt', () => {
    const text = 'Hello, World!';

    it('should encrypt text', () => {
      const encryptedText = cryptoService.encrypt(text);
      expect(encryptedText).toBeDefined();
      expect(typeof encryptedText).toBe('string');
      expect(encryptedText.length).toBeGreaterThan(0);
      expect(encryptedText).not.toBe(text);
    });
  });

  describe('decrypt', () => {
    const text = 'Hello, World!';
    let encryptedText: string;

    beforeEach(() => {
      encryptedText = cryptoService.encrypt(text);
    });

    it('should decrypt text', () => {
      const decryptedText = cryptoService.decrypt(encryptedText);
      expect(decryptedText).toBeDefined();
      expect(decryptedText).toBe(text);
    });
  });
});
