import { logger } from '@configs/configLogs';
import Logger from 'bunyan';
import bcrypt from 'bcryptjs';
import { config } from '@configs/configEnvs';

// const log: Logger = logger.createLogger('generators');
export class Generators {
  // Primer character en Uppercase el resto en lowercase
  static firstLetterUppercase(str: string) {
    const valueString = str.toLowerCase();
    return valueString
      .split(' ')
      .map(value => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  // Toda la cadena en lowercase
  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  // generar random integers de base 10
  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length; // 10
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return parseInt(result, 10);
  }

  // encriptar contraseñas
  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(config.SALT_ROUND));
  }
}
