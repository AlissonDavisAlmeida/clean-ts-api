import { type Encrypter } from '@/@data/protocols/criptography';
import jwt from 'jsonwebtoken';

export class JWTAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  async generate (id: string): Promise<string> {
    const token = jwt.sign({ id }, this.secret);

    return token;
  }
}
