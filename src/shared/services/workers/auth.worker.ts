// callback: es una función de ejecución de tareas
// Job: data que procesa un hilo para una cierta tarea
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { authService } from '@services/db/auth.service';
import { logger } from '@configs/configLogs';

const log: Logger = logger.createLogger('authWorker');

class AuthWorker {
  public async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data; // destructuración de la data custom
      await authService.createAuthUser(value); // query db
      // gestionar el tema de resolución de progreso
      job.progress(100); // progreso
      done(null, job.data); // notificación con éxito del proceso completado
    } catch (error) {
      log.error(error);
      done(error as Error); // ejecución con error
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
