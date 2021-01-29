import { Injectable, OnDestroy } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { User } from '../models';
import { TokenService } from './token.service';

const QUERY_ME = gql`
  query Me {
    me {
      id
      username
      roles
      name
      surname
      fullName
      avatar
    }
  }
`;

const MUTATION_SIGN_IN = gql`
  mutation SignIn($username: NonEmptyString!, $password: NonEmptyString!) {
    token: signIn(username: $username, password: $password)
  }
`;

const MUTATION_SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;

@Injectable()
export class UserService {
  public static readonly TOKEN_KEY: string = 'AUTH_TOKEN';

  private userSubject = new BehaviorSubject<User>({} as User);

  public user = this.userSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthSubject = new ReplaySubject<boolean>(1);

  public isAuth = this.isAuthSubject.asObservable();

  public constructor(private readonly apollo: Apollo, private readonly tokenService: TokenService) {}

  public populate() {
    const token = this.tokenService.getToken();

    if (token) {
      this.me().subscribe(
        (data) => {
          this.setAuthUser((data as unknown) as User, token);
        },
        () => this.removeAuthUser(),
      );
    } else {
      this.removeAuthUser();
    }
  }

  public getAuthUser(): User {
    return this.userSubject.value;
  }

  private setAuthUser(user: User, token: string): void {
    this.tokenService.setToken(token);
    this.userSubject.next(user);
    this.isAuthSubject.next(true);
  }

  public removeAuthUser(): void {
    this.tokenService.removeToken();
    this.userSubject.next({} as User);
    this.isAuthSubject.next(false);
  }

  public me() {
    return this.apollo.query<User>({ query: QUERY_ME });
  }

  public signIn(username: string, password: string) {
    return this.apollo.mutate<{ token: string }>({
      mutation: MUTATION_SIGN_IN,
      errorPolicy: 'all',
      variables: {
        username,
        password,
      },
    });
  }

  public signOut(): void {
    this.apollo
      .mutate<void>({ mutation: MUTATION_SIGN_OUT, errorPolicy: 'all' })
      .pipe(
        finalize(() => {
          this.removeAuthUser();
        }),
      ).subscribe();
  }
}
