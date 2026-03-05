import { authRoutes } from '@auth/routes/authRoutes';
import { config } from '@configs/configEnvs';
import { serverAdapter } from '@services/queues/base.queue';
import { Request, Response } from 'express';
import { Application } from 'express';

export default (app: Application) => {
  const routes = () => {
    // parent routes
    app.use('/healthcheck', (req: Request, res: Response) => res.send('Server is OK!'));
    app.use('/queues', serverAdapter.getRouter());

    app.use(config.BASE_PATH!, authRoutes.routes());
  };

  routes();
};
