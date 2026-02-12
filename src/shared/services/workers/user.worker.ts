import { logger } from '@configs/configLogs';
import { userService } from '@services/db/user.service';
import { Job, DoneCallback } from 'bull';
import Logger from 'bunyan';

const log: Logger = logger.createLogger('userWorker');

class UserWorker {
  public async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await userService.addUserData(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
