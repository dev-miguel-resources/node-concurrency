import Logger from 'bunyan';
import { BaseCache } from '../base.cache';
import { logger } from '@configs/configLogs';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { ServerError } from '@helpers/errors/serverError';
import { Generators } from '@helpers/generators/generators';

const log: Logger = logger.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  // 1. Método para guardar la data de usuario con el formato solicitado por redis.
  // key: es una llave que representa los datos en la cache: 'user'.
  // userUid: identificador de cada elemento en redis.
  // tercer parámetro: es la data de cada user key
  public async saveToUserCache(key: string, userUid: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      social,
      work,
      location,
      school,
      quote,
      bgImageVersion,
      bgImageId
    } = createdUser;

    // convención: cada atributo a redis debe venir como una cadena
    const dataToSave = {
      _id: `${_id}`,
      uId: `${uId}`,
      username: `${username}`,
      email: `${email}`,
      avatarColor: `${avatarColor}`,
      createdAt: `${createdAt}`,
      postsCount: `${postsCount}`,
      blocked: JSON.stringify(blocked),
      blockedBy: JSON.stringify(blockedBy),
      profilePicture: `${profilePicture}`,
      followersCount: `${followersCount}`,
      followingCount: `${followingCount}`,
      notifications: JSON.stringify(notifications),
      social: JSON.stringify(social),
      work: `${work}`,
      location: `${location}`,
      school: `${school}`,
      quote: `${quote}`,
      bgImageVersion: `${bgImageVersion}`,
      bgImageId: `${bgImageId}`
    };

    // Observable que se encarga de verificar el cliente de redis previo a procesar
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      // Proceso de inserción
      // score: puntaje de calibración: radix: 2-36 (devuelve un valor hex de base x)
      // si tu server es básico en la nube: 5-6
      // tu server tiene manejo de eventos: SÍ. 8-10
      // Si tu server tiene alta capacidad de la nube: 10
      await this.client.ZADD('user', { score: parseInt(userUid, 10), value: `${key}` });
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Redis error. Try Again.');
    }
  }

  // 2. Método para leer la data de usuario de la cache.
  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
      // recuperar los valores de json stringify a valor natural con parseJSON
      response.createdAt = new Date(Generators.parseJson(`${response.createdAt}`));
      response.postsCount = Generators.parseJson(`${response.postsCount}`);
      response.blocked = Generators.parseJson(`${response.blocked}`);
      response.blockedBy = Generators.parseJson(`${response.blockedBy}`);
      response.notifications = Generators.parseJson(`${response.notifications}`);
      response.social = Generators.parseJson(`${response.social}`);
      response.followersCount = Generators.parseJson(`${response.followersCount}`);
      response.followingCount = Generators.parseJson(`${response.followingCount}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Redis error. Try Again.');
    }
  }
}
