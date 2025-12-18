import dotenv from 'dotenv';
import { logger } from './configLogs';

import Logger from 'bunyan';

dotenv.config({});

const log: Logger = logger.createLogger('logEnvs');

class ConfigEnvs {
  public DATABASE_URL: string | undefined;
  public SERVER_PORT: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.SERVER_PORT = process.env.SERVER_PORT;
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
