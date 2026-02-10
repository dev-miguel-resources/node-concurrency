import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@configs/configEnvs';
import { BullAdapter, ExpressAdapter, createBullBoard } from '@bull-board/express';
import { logger } from '@configs/configLogs';

// Arreglo global que almacenará los adaptadores para todas las colas.
// Esto es para mostrar los eventos de las colas en el dashboard.
let bullAdapters: BullAdapter[] = [];

// Necesitar exportar el adaptador del servidor para que pueda ser ocupado por express.
export let serverAdapter: ExpressAdapter;

// Definir un tipo base que pueda ser cualquiera de estos tipos de job.
// Esto que permite que la cola acepte múltiples tipos de trabajos. (pendiente)

// Clases de colas la extenderán para crear colas específicas
export abstract class BaseQueue {
  // Define la propiedad queue que representa una cola de Bull
  queue: Queue.Queue;

  log: Logger;

  // Constructor que recibe el nombre de la cola
  // authQueue
  constructor(queueName: string) {
    // Esto sirve para crear una nueva cola conectada a redis mediante un nombre.
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);

    // Crear un adaptador BullAdapter que permite que bull-board permite monitorear colas.
    bullAdapters.push(new BullAdapter(this.queue));

    // Puedes agregar eliminar duplicado mediante la instancia Set.
    bullAdapters = [...new Set(bullAdapters)];

    // Definir una ruta base en la cual se desplegará el dashboard.
    // Por ej: http://localhost:3000/queues
    serverAdapter.setBasePath('/queues');

    // Se crea una instancia del dashboard con todas las colas registradas a nuestro servidor
    createBullBoard({
      queues: bullAdapters, // colas registradas
      serverAdapter // ruta vinculante al servidor
    });

    // Cree logs para las colas
    this.log = logger.createLogger(`${queueName}Queue`);

    // Evento que se ejecuta cuando un job se completa exitosamente.
    this.queue.on('completed', (job: Job) => {
      // Elimina el job una vez completado.
      job.remove();
    });

    // Evento global que se ejecuta cuando cualquier job se complete
    this.queue.on('global:completed', (jobId: string) => {
      // Registrar en el log que el job fue completado con su id de proceso
      this.log.info(`Job ${jobId} completed`);
    });

    // Evento global que se ejecuta cuando un job se queda "stalled".
    // Stalled: significa que el hilo/worker dejado de proceso inesperadamente.
    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  // Método protegido que permite agregar un nuevo job a la cola.
  // name = nombre de la tarea (job)
  // data = datos a manejar en el job
  protected addJob(name: string, data: any): void {
    // configuras el comportamiento de los jobs en las colas
    this.queue.add(name, data, {
      // Número de intentos si el job falla.
      attempts: 3,
      // Configuración de reintentos.
      backoff: {
        type: 'fixed',
        // Espera: 5000 ms (5 seg) antes de reitentar.
        delay: 5000
      }
    });
  }

  // Método para que las colas puedan parametrizar como manejar la concurrencia y otros procesos.
  protected processJob(
    name: string, // nombre de la tarea a procesar
    concurrency: number, // número de jobs que pueden ejecutarse en paralelo
    callback: Queue.ProcessCallbackFunction<void> // función que ejecuta el job
  ): void {
    // Registramos el procesador del job. (CPU)
    this.queue.process(name, concurrency, callback);
  }
}
