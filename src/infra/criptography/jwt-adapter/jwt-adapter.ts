import { type Encrypter } from '@/@data/protocols/criptography';
import { type Decrypter } from '@/@data/protocols/criptography/decrypter';
import jwt from 'jsonwebtoken';

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async decrypt (ciphertext: string): Promise<string | null> {
    const payload = jwt.verify(ciphertext, this.secret);

    return payload as string;
  }

  async generate (id: string): Promise<string> {
    const token = jwt.sign({ id }, this.secret);

    return token;
  }
}
