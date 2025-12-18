import bunyan from 'bunyan';

// Design Pattern: Singleton
// Solid: Single Responsibility
class LoggerConfig {
  // Método público que crea y devuelve la instancia configurada de bunyan
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({
      name,
      // Habilitar todos los logs desde debug hacia arriba
      level: 'debug'
    });
  }
}

export const logger: LoggerConfig = new LoggerConfig();
