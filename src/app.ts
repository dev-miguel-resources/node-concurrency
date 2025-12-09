// Es la definición de lo que contiene y carga la app
// Principio SOLID de Single Responsability
class Application {
  public initialize(): void {}

  private loadConfig(): void {}
}

const application: Application = new Application();
application.initialize();
