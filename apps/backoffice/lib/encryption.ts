import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET!;

if (!ENCRYPTION_KEY) {
  throw new Error('API_KEY_ENCRYPTION_SECRET environment variable is required');
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('API_KEY_ENCRYPTION_SECRET must be 64 hex characters (32 bytes)');
}

/**
 * Encryption Service for API Keys
 *
 * Uses AES-256-GCM for secure encryption with authentication
 */
export class EncryptionService {
  /**
   * Verschlüsselt einen API Key
   *
   * @param plainText - Der zu verschlüsselnde Text (API Key)
   * @returns Verschlüsselter String im Format: iv:authTag:encrypted
   */
  static encrypt(plainText: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Entschlüsselt einen API Key
   *
   * @param encryptedData - Verschlüsselter String im Format: iv:authTag:encrypted
   * @returns Entschlüsselter Klartext
   */
  static decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Maskiert einen API Key für sichere Anzeige
   *
   * @param key - Der zu maskierende Key
   * @returns Maskierter Key (z.B. "sk-ant-••••-8x7k")
   */
  static mask(key: string): string {
    if (key.length <= 8) return '••••••••';

    // Für Anthropic Keys (sk-ant-xxx)
    if (key.startsWith('sk-ant-')) {
      const parts = key.split('-');
      if (parts.length >= 3) {
        return `${parts[0]}-${parts[1]}-••••-${key.slice(-4)}`;
      }
    }

    // Für OpenAI Keys (sk-xxx)
    if (key.startsWith('sk-')) {
      return `sk-••••-${key.slice(-4)}`;
    }

    // Fallback
    return `${key.slice(0, 4)}••••${key.slice(-4)}`;
  }
}
