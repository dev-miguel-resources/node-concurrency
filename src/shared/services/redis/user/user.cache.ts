import Logger from 'bunyan';
import { BaseCache } from '../base.cache';
import { logger } from '@configs/configLogs';
import { IUserDocument } from '@user/interfaces/userDocument.interface';

const log: Logger = logger.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  // 1. Método para guardar la data de usuario con el formato solicitado por redis.
  // key: es una llave que representa los datos en la cache: 'user'.
  // userUid: identificador de cada elemento en redis.
  // tercer parámetro: es la data de cada user key
  public async saveToUserCache(key: string, userUid: string, createdUser: IUserDocument): Promise<void> {}

  // 2. Método para leer la data de usuario de la cache.
  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    // se retorna null
    return null;
  }
}
