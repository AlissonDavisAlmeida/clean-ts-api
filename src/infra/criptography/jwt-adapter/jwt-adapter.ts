import { type Encrypter } from '@/@data/protocols/criptography';
import jwt from 'jsonwebtoken';

export class JWTAdapter implements Encrypter {
  async generate (id: string): Promise<string> {
    const token = jwt.sign({ id }, 'secret');

    return token;
  }
}
