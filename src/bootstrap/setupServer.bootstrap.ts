import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import Logger from 'bunyan';
import cookieSession from 'cookie-session';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';
import applicationRoutes from '@interfaces/http/routes';
import HTTP_STATUS from 'http-status-codes';
import { IErrorResponse } from '@helpers/errors/errorResponse.interface';
import { CustomError } from '@helpers/errors/customError';

const log: Logger = logger.createLogger('server');

// SOLID Principle: Single Responsability
// SOLID Principle: Open/Closed
export class SocialServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    // inicializaciones de métodos a arrancar cuando se levante la app
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    // Manejo de la seguridad del servidor con owasp
    // Design Pattern Synchronized Token: https://medium.com/@kaviru.mihisara/synchronizer-token-pattern-e6b23f53518e
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000, // 1 semana
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  // Definiciones generales
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  // Manejo de rutas de express
  private routesMiddleware(app: Application): void {
    // Inyectar todas las rutas HTTP
    applicationRoutes(app);
  }

  // Manejo de errores globales
  private globalErrorHandler(app: Application): void {
    // Manejar las rutas no encontradas (404)

    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found`
      });
    });

    // Manejo de errores de negocio
    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      // Registrar los errores en los logs
      log.error(error);

      // Si es un error controlado, vamos a devolver una respuesta con formato
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }

      // Si no es un error conocido, continua con el flujo normal de ejecución
      next();
    });
  }

  // Inicializar el servidor HTTP
  private startHttpServer(httpServer: http.Server): void {
    // Log del proceso de ejecución
    log.info(`Server has started with process ${process.pid}`);

    const PORT = Number(config.SERVER_PORT);

    // Arrancar el servidor con el puerto designado
    httpServer.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  }

  // Arranque completo como servidor de Express con HTTP
  private async startServer(app: Application): Promise<void> {
    try {
      // Crear un servidor HTTP usando express
      const httpServer: http.Server = new http.Server(app);

      // Arranque servidor HTTP
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }
}
