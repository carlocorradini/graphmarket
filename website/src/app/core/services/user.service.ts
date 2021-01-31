import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { User, UserGenders } from '../models';
import { TokenService } from './token.service';

export interface SignUpValues {
  username: string;
  password: string;
  name?: string;
  surname?: string;
  gender?: UserGenders;
  dateOfBirth?: string;
  email: string;
  phone: string;
}

export interface updateValues {
  password?: string;
  name?: string;
  surname?: string;
  gender?: UserGenders;
  dateOfBirth?: string;
}

const QUERY_ME = gql`
  query Me {
    user: me {
      id
      username
      roles
      name
      surname
      dateOfBirth
      gender
      fullName
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

const QUERY_USER = gql`
  query User($id: UUID!) {
    user: user(id: $id) {
      id
      username
      fullName
      avatar
      createdAt
    }
  }
`;

const MUTATION_SIGN_IN = gql`
  mutation SignIn($username: NonEmptyString!, $password: NonEmptyString!) {
    token: signIn(username: $username, password: $password)
  }
`;

const MUTATION_SIGN_UP = gql`
  mutation SignUp(
    $username: NonEmptyString!
    $password: NonEmptyString!
    $name: NonEmptyString
    $surname: NonEmptyString
    $gender: UserGenders
    $dateOfBirth: Date
    $email: EmailAddress!
    $phone: PhoneNumber!
  ) {
    user: createUser(
      data: {
        username: $username
        password: $password
        name: $name
        surname: $surname
        gender: $gender
        dateOfBirth: $dateOfBirth
        email: $email
        phone: $phone
      }
    ) {
      id
    }
  }
`;

const MUTATION_SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;

const MUTATION_VERIFY = gql`
  mutation Verify($userId: UUID!, $phoneCode: NonEmptyString!, $emailCode: NonEmptyString!) {
    token: verify(userId: $userId, phoneCode: $phoneCode, emailCode: $emailCode)
  }
`;

const MUTATION_REVERIFY = gql`
  mutation ReVerify($userId: UUID!) {
    reVerify(userId: $userId)
  }
`;

const MUTATION_UPDATE = gql`
  mutation UpdateMe(
    $password: NonEmptyString
    $name: NonEmptyString
    $surname: NonEmptyString
    $gender: UserGenders
    $dateOfBirth: Date
  ) {
    user: updateMe(
      data: {
        password: $password
        name: $name
        surname: $surname
        gender: $gender
        dateOfBirth: $dateOfBirth
      }
    ) {
      id
      username
      roles
      name
      surname
      dateOfBirth
      gender
      fullName
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

const MUTATION_UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatar: Upload!) {
    user: updateAvatar(file: $avatar) {
      id
      username
      roles
      name
      surname
      dateOfBirth
      gender
      fullName
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

@Injectable()
export class UserService {
  public static readonly TOKEN_KEY: string = 'AUTH_TOKEN';

  private userSubject = new BehaviorSubject<User>({} as User);

  public user = this.userSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthSubject = new ReplaySubject<boolean>(1);

  public isAuth = this.isAuthSubject.asObservable();

  public constructor(
    private readonly apollo: Apollo,
    private readonly tokenService: TokenService,
  ) {}

  public populate() {
    const token = this.tokenService.getToken();

    if (token) {
      this.me().subscribe(
        ({ data }) => {
          this.setAuthUser(token, data.user);
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

  public setAuthUser(token: string, user?: User): void {
    this.tokenService.setToken(token);
    this.isAuthSubject.next(true);

    if (user) this.userSubject.next(user);
    else this.populate();
  }

  public updateAuthUser(user: User): void {
    this.userSubject.next(user);
  }

  public removeAuthUser(): void {
    this.tokenService.removeToken();
    this.userSubject.next({} as User);
    this.isAuthSubject.next(false);
  }

  public me() {
    return this.apollo.query<{ user: User }>({ query: QUERY_ME, errorPolicy: 'all' });
  }

  public userById(userId: string) {
    return this.apollo.query<{ user?: User }>({
      query: QUERY_USER,
      errorPolicy: 'all',
      variables: { id: userId },
    });
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

  public signUp(data: SignUpValues) {
    return this.apollo.mutate<{ user: { id: string } }>({
      mutation: MUTATION_SIGN_UP,
      errorPolicy: 'all',
      variables: data,
    });
  }

  public signOut(): void {
    this.apollo
      .mutate<void>({ mutation: MUTATION_SIGN_OUT, errorPolicy: 'all' })
      .pipe(
        finalize(() => {
          this.removeAuthUser();
        }),
      )
      .subscribe();
  }

  public verify(userId: string, phoneCode: string, emailCode: string) {
    return this.apollo.mutate<{ token: string }>({
      mutation: MUTATION_VERIFY,
      errorPolicy: 'all',
      variables: {
        userId,
        phoneCode,
        emailCode,
      },
    });
  }

  public reVerify(userId: string) {
    return this.apollo.mutate<void>({
      mutation: MUTATION_REVERIFY,
      errorPolicy: 'all',
      variables: { userId },
    });
  }

  public update(data: updateValues) {
    return this.apollo.mutate<{ user: User }>({
      mutation: MUTATION_UPDATE,
      errorPolicy: 'all',
      variables: data,
    });
  }

  public updateAvatar(avatar: File) {
    return this.apollo.mutate<{ user: User }>({
      mutation: MUTATION_UPDATE_AVATAR,
      errorPolicy: 'all',
      context: {
        useMultipart: true,
      },
      variables: { avatar },
    });
  }
}
