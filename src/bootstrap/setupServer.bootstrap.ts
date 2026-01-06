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
  private routesMiddleware(app: Application): void {}

  // Manejo de errores globales
  private globalErrorHandler(app: Application): void {}

  // Configuraciones de arranque
  private startHttpServer(httpServer: http.Server): void {}
}
