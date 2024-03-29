import { type Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}

  async encrypt (value: string): Promise<string> {
    const encrypted = await bcrypt.hash(value, this.salt);
    return encrypted;
  }
}
