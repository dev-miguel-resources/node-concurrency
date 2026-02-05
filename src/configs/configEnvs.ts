import dotenv from 'dotenv';
import { logger } from './configLogs';

import Logger from 'bunyan';
import cloudinary from 'cloudinary';

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
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public CLOUD_DOMAIN: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.SERVER_PORT = process.env.SERVER_PORT;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.NODE_ENV = process.env.NODE_ENV;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.SALT_ROUND = process.env.SALT_ROUND;
    this.CLOUD_NAME = process.env.CLOUD_NAME;
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
    this.CLOUD_DOMAIN = process.env.CLOUD_DOMAIN;
    this.REDIS_HOST = process.env.REDIS_HOST;
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

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: ConfigEnvs = new ConfigEnvs();
