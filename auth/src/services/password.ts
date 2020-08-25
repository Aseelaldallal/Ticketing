import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'; // to use async await with scrypt function

const scryptAsync = promisify(scrypt);

export class Password {
  // static methods can be accessed without creating an instance of the class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buff.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buff.toString('hex') === hashedPassword;
  }
}
