import { IAppConfig } from '../types/app.interface';

type AppConfig = {
  app: IAppConfig;
};

export const APP_TOKEN = Symbol('app');

const DEFAULT_API_PORT = '3000';

export const appEnv = (): AppConfig => {
  const { PORT = DEFAULT_API_PORT } = process.env;

  return {
    app: {
      port: parseInt(PORT, 10),
    },
  };
};
