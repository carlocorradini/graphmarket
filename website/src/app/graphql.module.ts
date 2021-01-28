import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';
import { environment } from '../environments/environment';
import Swal from 'sweetalert2';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        let error: string = 'Unknown Error';

        if (graphQLErrors) {
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
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
