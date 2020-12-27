import { ServiceEndpointDefinition } from '@apollo/gateway';
import config from '@app/config';

const serviceList: Required<ServiceEndpointDefinition>[] = [
  { name: config.SERVICES.USERS.NAME, url: config.SERVICES.USERS.URL },
  { name: config.SERVICES.PRODUCTS.NAME, url: config.SERVICES.PRODUCTS.URL },
];

export default serviceList;
