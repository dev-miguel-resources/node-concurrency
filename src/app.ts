import databaseConnection from '@bootstrap/setupDatabase.bootstrap';
import { SocialServer } from '@bootstrap/setupServer.bootstrap';

import { config } from '@configs/configEnvs';
import express, { Express } from 'express';

// Es la definición de lo que contiene y carga la app
// Principio SOLID de Single Responsability
class Application {
  public initialize(): void {
    // 1. Carga y validación de config-envs
    this.loadConfig();

    // 2. Inicializo la conexión a la base de datos
    databaseConnection();

    // 3. Crea la instancia de express
    const app: Express = express();

    // 4. Inyectar express al servidor principal
    const server: SocialServer = new SocialServer(app);

    // 5. Arranco el servidor con todos los comportamientos
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
