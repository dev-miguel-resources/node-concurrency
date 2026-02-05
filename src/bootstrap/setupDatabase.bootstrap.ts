import mongoose from 'mongoose';

import Logger from 'bunyan';

import { config } from '@configs/configEnvs';

import { logger } from '@configs/configLogs';

import { redisConnection } from '@services/redis/redis.connection';

// definición del log para este archivo
const log: Logger = logger.createLogger('setupDatabase');

// Función que inicializa la conexión a la base de datos
export default () => {
  // Función encargada de conectarse a Mongo DB
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        // Emitir un log informativo indicando que la conexión fue exitosa
        log.info('Succesfully connected to database');

        // Iniciar la conexión con redis una vez la base de datos secundaria esté activa
        redisConnection.connect();
      })
      .catch(error => {
        log.error('Error connecting to database', error);
        // Notificar al servidor que la aplicación se cerró por un código de error
        return process.exit(1);
      });
  };

  // Ejecución en base a lo definido
  connect();

  // Escuchar el evento de desconexión de MongoDB
  // Si se pierde la conexión, vamos a intentar reconectarnos automáticamente
  mongoose.connection.on('disconnected', connect);
};
