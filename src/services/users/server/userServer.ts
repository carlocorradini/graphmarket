import { ApolloServer, ServerInfo } from 'apollo-server';
import { buildDatabaseConnection, buildFederatedSchema } from '@app/helpers';
import { IContext } from '@app/types';
import resolveUserReference from '../references/userReference';
import UserResolver from '../resolvers/UserResolver';
import User from '../entities/User';

// eslint-disable-next-line import/prefer-default-export
const listen = async (port: number): Promise<ServerInfo> => {
  await buildDatabaseConnection();

  const schema = await buildFederatedSchema(
    {
      resolvers: [UserResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: true,
    context: ({ req }) => {
      const context: IContext = {
        user: req.headers.user ? JSON.parse(req.headers.user as string) : undefined,
      };
      return context;
    },
  });

  return server.listen({ port });
};

export default { listen };
