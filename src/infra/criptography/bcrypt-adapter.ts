import { type Hasher, type HashComparer, type HashComparerParams } from '@/@data/protocols/criptography';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async compare (data: HashComparerParams): Promise<boolean> {
    const isSame = await bcrypt.compare(data.password, data.hashedPassword);
    return isSame;
  }

  async hash (value: string): Promise<string> {
    const encrypted = await bcrypt.hash(value, this.salt);
    return encrypted;
  }
}
