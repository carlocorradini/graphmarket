import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';
import Swal from 'sweetalert2';
import { TokenService } from './core';

export function createApollo(
  httpLink: HttpLink,
  tokenService: TokenService,
): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([
      setContext(() => ({
        headers: {
          Accept: 'charset=utf-8',
        },
      })),
      setContext(() => {
        const token = tokenService.getToken();

        if (!token) return {};

        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }),
      onError(({ graphQLErrors, networkError }) => {
        let error: string = 'Unknown Error';

        if (graphQLErrors) {
          if (
            graphQLErrors.length !== 0 &&
            graphQLErrors[0].message === 'Verification missing to execute the procedure'
          )
            return;

          if (graphQLErrors.length !== 0) error = '';
          graphQLErrors.map(({ message, locations, path }) => {
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
            error += `\n ${message}`;
          });
        }

        if (networkError) {
          console.error(
            `[Network error]: Name: ${networkError.name}, Message: ${
              networkError.message
            }, Stack: ${networkError.stack ? networkError.stack : '-'}`,
          );
          error = networkError.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: error,
        });
      }),
      httpLink.create({ uri: environment.apiURI }),
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  providers: [
    TokenService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, TokenService],
    },
  ],
})
export class GraphQLModule {}
