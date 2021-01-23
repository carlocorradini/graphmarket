import config from '@app/config';
import IService from '@app/interfaces/IService';

/**
 * Available services.
 */
const services: IService[] = [
  {
    name: 'authentications',
    url: config.SERVICES.AUTHENTICATIONS.URL,
    features: { authentication: true },
  },
  {
    name: 'users',
    url: config.SERVICES.USERS.URL,
    features: { authentication: true, upload: true },
  },
  {
    name: 'products',
    url: config.SERVICES.PRODUCTS.URL,
    features: { authentication: true, upload: true },
  },
  {
    name: 'inventories',
    url: config.SERVICES.INVENTORIES.URL,
    features: { authentication: true },
  },
  {
    name: 'purchases',
    url: config.SERVICES.PURCHASES.URL,
    features: { authentication: true },
  },
];

export default services;
