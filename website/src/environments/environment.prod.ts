import { environment as commonEnvironment } from './environment.common';

export const environment = {
  ...commonEnvironment,
  production: true,
  apiURI: 'http://localhost:8080/graphql',
};
