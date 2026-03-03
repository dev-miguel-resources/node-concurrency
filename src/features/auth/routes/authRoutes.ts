import express, { Router } from 'express';
import { SignUpController } from '@auth/controllers/signup.controller';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  // definición de rutas
  public routes(): Router {
    // design pattern: prototype para el bind
    this.router.post('/signup', SignUpController.prototype.register);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
