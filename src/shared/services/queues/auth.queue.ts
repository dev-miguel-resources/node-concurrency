import { IAuthJob } from '@auth/interfaces/authJob.interface';
import { BaseQueue } from './base.queue';
import { authWorker } from '@services/workers/auth.worker';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    // Aquí se parametriza la personalización de la cola
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: IAuthJob) {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
