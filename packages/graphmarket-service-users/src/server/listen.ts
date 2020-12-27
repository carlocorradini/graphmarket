import { AddressInfo } from 'net';
import jwtBlacklist from 'express-jwt-blacklist';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import { User } from '@graphmarket/entities';
import config from '@app/config';
import { UserResolver, resolveUserReference } from '@app/resolvers';

jwtBlacklist.configure({
  strict: false,
  store: {
    type: 'redis',
    url: config.REDIS.URL,
  },
});

const listen = async (port: number): Promise<AddressInfo> => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [UserResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const app = buildService({
    graphql: {
      schema,
      path: config.GRAPHQL.PATH,
      playground: config.GRAPHQL.PLAYGROUND,
    },
    upload: {
      maxFileSize: config.ADAPTERS.UPLOAD.MAX_FILE_SIZE,
      maxFiles: config.ADAPTERS.UPLOAD.MAX_FILES,
    },
  });

  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        resolve(server.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export default listen;
