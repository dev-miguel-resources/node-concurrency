import dotenv from 'dotenv';
import { logger } from './configLogs';

import Logger from 'bunyan';

dotenv.config({});

const log: Logger = logger.createLogger('logEnvs');

class ConfigEnvs {
  public DATABASE_URL: string | undefined;
  public SERVER_PORT: string | undefined;
  public CLIENT_URL: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public NODE_ENV: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SALT_ROUND: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.SERVER_PORT = process.env.SERVER_PORT;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.NODE_ENV = process.env.NODE_ENV;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.SALT_ROUND = process.env.SALT_ROUND;
  }

  // Método que valida que ninguna variable de entorno a utilizar sea undefined
  public validateConfig(): void {
    console.log(this);

    // Recorrer todas las propiedades del objeto configEnvs (clase)
    for (const [key, value] of Object.entries(this)) {
      // Si alguna variable no está definida, se registra el error
      if (value === undefined) {
        log.error(`Configuration ${key} is undefined`);
      }
    }
  }

  // más adelante agregaremos otro método de config para otras variables específicas
}

export const config: ConfigEnvs = new ConfigEnvs();
