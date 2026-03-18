import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { logger } from '@configs/configLogs';
import { userService } from '@services/db/user.service';

const log: Logger = logger.createLogger('userWorker');

class UserWorker {
  public async addUserToDB(job: Job): Promise<void> {
    try {
      const { value } = job.data;

      console.log('JOB DATA:', value);

      await userService.addUserData(value);

      console.log('USER SAVED');

      await job.progress(100);
    } catch (error) {
      console.error('ERROR MONGO:', error);
      log.error(error);
      throw error; // Bull marcará el job como failed
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
