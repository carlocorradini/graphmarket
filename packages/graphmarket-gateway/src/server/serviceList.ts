import config from '@app/config';

const serviceList = [
  { name: config.SERVICES.USERS.NAME, url: config.SERVICES.USERS.URL },
  { name: config.SERVICES.PRODUCTS.NAME, url: config.SERVICES.PRODUCTS.URL },
];

export default serviceList;
