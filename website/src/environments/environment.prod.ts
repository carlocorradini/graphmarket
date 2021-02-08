import { environment as commonEnvironment } from './environment.common';

export const environment = {
  ...commonEnvironment,
  production: true,
  apiURI: 'http://graphmarket.hopto.org:8080/graphql',
};
