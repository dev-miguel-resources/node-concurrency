import { BaseQueue } from '@services/queues/base.queue';
import { userWorker } from '@services/workers/user.worker';
import { IUserJob } from '@user/interfaces/userJob.interface';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }

  public addUserJob(name: string, data: IUserJob) {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
