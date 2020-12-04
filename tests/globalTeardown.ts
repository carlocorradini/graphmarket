import { getConnection } from 'typeorm';

export default async () => {
  await getConnection().close();
};
