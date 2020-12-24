import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';

const bootstrap = async () => {
  const { schema, executor } = await new ApolloGateway({
    serviceList: [{ name: 'users', url: 'http://localhost:8081/graphql' }],
  }).load();

  const server = new ApolloServer({
    schema,
    executor,
    tracing: false,
    playground: true,
  });

  server.listen({ port: 8080 }).then(() => {});
};

bootstrap().catch();
