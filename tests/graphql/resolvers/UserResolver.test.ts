import { isEmail, isISO8601, isPhoneNumber, isUUID, isDate, isURL } from 'class-validator';
import faker from 'faker';
import Container from 'typedi';
import { Connection } from 'typeorm';
import { ExecutionResult } from 'graphql';
import { createDatabaseConnection, makeGraphQlRequest } from '@test/__utils__';
import User, { UserGenders, UserRoles } from '@app/entities/User';
import { UserCreateInput } from '@app/graphql/inputs/user';
import { UserService } from '@app/services';

const USER_FIELDS_COUNT: number = 12;

const checkResponseIsData = (
  response: ExecutionResult<
    {
      [key: string]: any;
    },
    {
      [key: string]: any;
    }
  >,
): void => {
  expect(response).toBeDefined();
  expect(response.errors).toBeUndefined();
  expect(response.data).toBeDefined();
};

const checkResponseIsError = (
  response: ExecutionResult<
    {
      [key: string]: any;
    },
    {
      [key: string]: any;
    }
  >,
  isResponseDataNull: boolean = false,
): void => {
  expect(response).toBeDefined();
  if (!isResponseDataNull) expect(response.data).toBeUndefined();
  else expect(response.data).toBeNull();
  expect(response.errors).toBeDefined();
  expect(response.errors).toHaveLength(1);
};

const createMinimalUser = (): UserCreateInput => ({
  username: faker.internet.userName(),
  password: faker.internet.password(8),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber('+3932########'),
});

const checkMinimalUser = (data: User, user: UserCreateInput): void => {
  expect(Object.keys(data)).toHaveLength(USER_FIELDS_COUNT);

  expect(data!.id).toBeDefined();
  expect(isUUID(data!.id)).toBeTruthy();

  expect(data!.username).toBeDefined();
  expect(data!.username).toStrictEqual(user.username);

  expect(data!.password).toBeUndefined();

  expect(data!.roles).toBeDefined();
  expect(data!.roles).toHaveLength(1);
  expect(data!.roles).toContainEqual(UserRoles.USER);

  expect(data!.name).toBeNull();

  expect(data!.surname).toBeNull();

  expect(data!.gender).toBeNull();

  expect(data!.dateOfBirth).toBeNull();

  expect(data!.email).toBeDefined();
  expect(isEmail(data!.email)).toBeTruthy();
  expect(data!.email).toStrictEqual(user.email);

  expect(data!.phone).toBeDefined();
  expect(isPhoneNumber(data!.phone, null)).toBeTruthy();
  expect(data!.phone).toStrictEqual(user.phone);

  expect(data!.avatar).toBeDefined();
  expect(isURL(data!.avatar)).toBeTruthy();

  expect(data!.createdAt).toBeDefined();
  expect(isDate(data!.createdAt)).toBeTruthy();

  expect(data!.updatedAt).toBeDefined();
  expect(isDate(data!.updatedAt)).toBeTruthy();
};

const MUTATION_CREATE_USER: string = `
  mutation CreateUser(
    $username: NonEmptyString!
    $password: NonEmptyString!
    $email: EmailAddress!
    $phone: PhoneNumber!
    $name: NonEmptyString
    $surname: NonEmptyString
    $gender: UserGenders
    $dateOfBirth: Date
  ) {
    createUser(
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
      username
      roles
      name
      surname
      gender
      dateOfBirth
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

const QUERY_ME: string = `
  query {
    me {
      id
      username
      roles
      name
      surname
      gender
      dateOfBirth
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

const QUERY_USER: string = `
  query User($id: UUID!) {
    user(id: $id) {
      id
      username
      roles
      name
      surname
      gender
      dateOfBirth
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`;

/* const QUERY_USERS: string = `
  query Users($skip: NonNegativeInt, $take: PositiveInt) {
    users(skip: $skip, take: $take) {
      id
      username
      roles
      name
      surname
      gender
      dateOfBirth
      email
      phone
      avatar
      createdAt
      updatedAt
    }
  }
`; */

/* const MUTATION_SIGN_IN = `
  mutation SignIn($username: NonEmptyString!, $password: NonEmptyString!) {
    signIn(username: $username, password: $password)
  }
`; */

describe('UserResolver testing', () => {
  const userService: UserService = Container.get(UserService);
  let connection: Connection;

  beforeAll(async () => {
    connection = await createDatabaseConnection();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('it should create a user with minimum parameters on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();
    const response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });

    checkResponseIsData(response);
    expect(response.data!.createUser).toBeDefined();
    checkMinimalUser(response.data!.createUser, user);
  });

  test('it should create a user with maximum parameters on mutation createUser', async () => {
    const user: Required<UserCreateInput> = {
      ...createMinimalUser(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      gender: UserGenders.OTHER,
      dateOfBirth: (faker.date.past().toISOString().split('T')[0] as unknown) as Date,
    };
    const response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });

    checkResponseIsData(response);
    expect(response.data!.createUser).toBeDefined();

    const data: User = response.data!.createUser;

    expect(Object.keys(data)).toHaveLength(USER_FIELDS_COUNT);

    expect(data!.id).toBeDefined();
    expect(isUUID(data!.id)).toBeTruthy();

    expect(data!.username).toBeDefined();
    expect(data!.username).toStrictEqual(user.username);

    expect(data!.password).toBeUndefined();

    expect(data!.roles).toBeDefined();
    expect(data!.roles).toHaveLength(1);
    expect(data!.roles).toContainEqual(UserRoles.USER);

    expect(data!.name).toBeDefined();
    expect(data!.name).toStrictEqual(user.name);

    expect(data!.surname).toBeDefined();
    expect(data!.surname).toStrictEqual(user.surname);

    expect(data!.gender).toBeDefined();
    expect(data!.gender).toStrictEqual(user.gender);

    expect(data!.dateOfBirth).toBeDefined();
    expect(data!.dateOfBirth).toStrictEqual((user.dateOfBirth as unknown) as Date);
    expect(isISO8601(data!.dateOfBirth, { strict: true })).toBeTruthy();

    expect(data!.email).toBeDefined();
    expect(isEmail(data!.email)).toBeTruthy();
    expect(data!.email).toStrictEqual(user.email);

    expect(data!.phone).toBeDefined();
    expect(isPhoneNumber(data!.phone, null)).toBeTruthy();
    expect(data!.phone).toStrictEqual(user.phone);

    expect(data!.avatar).toBeDefined();
    expect(isURL(data!.avatar)).toBeTruthy();

    expect(data!.createdAt).toBeDefined();
    expect(isDate(data!.createdAt)).toBeTruthy();

    expect(data!.updatedAt).toBeDefined();
    expect(isDate(data!.updatedAt)).toBeTruthy();
  });

  test('it should fail due to invalid username on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.username = (null as unknown) as string;
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$username" of non-null type "NonEmptyString!" must not be null.`,
    );

    // Length < 1
    user.username = '';
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$username" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.username = faker.random.alphaNumeric(65);
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should fail due to invalid password on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.password = (null as unknown) as string;
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$password" of non-null type "NonEmptyString!" must not be null.`,
    );

    // Length < 8
    user.password = faker.internet.password(7);
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);

    // Length > 64 characters
    user.password = faker.internet.password(65);
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should fail due to invalid name on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Length < 1
    user.name = '';
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$name" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.name = faker.random.alpha({ count: 65 });
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should fail due to invalid surname on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Length < 1
    user.surname = '';
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$surname" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.surname = faker.random.alpha({ count: 65 });
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should fail due to invalid gender on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Length < 1
    user.gender = 'GENDER_WITH_UNKNOWN_VALUE' as UserGenders;
    const response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$gender" got invalid value "GENDER_WITH_UNKNOWN_VALUE"; Value "GENDER_WITH_UNKNOWN_VALUE" does not exist in "UserGenders" enum.`,
    );
  });

  test('it should fail due to invalid dateOfBirth on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Date type
    user.dateOfBirth = faker.date.past();
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$dateOfBirth" got invalid value {}; Expected type "Date". Date cannot represent non string type "${user.dateOfBirth.toISOString()}"`,
    );

    // DateTime
    user.dateOfBirth = (faker.date.past().toISOString() as unknown) as Date;
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$dateOfBirth" got invalid value "${user.dateOfBirth}"; Expected type "Date". Date cannot represent an invalid date-string ${user.dateOfBirth}.`,
    );

    // Invalid
    user.dateOfBirth = ('2020-12-32' as unknown) as Date;
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$dateOfBirth" got invalid value "${user.dateOfBirth}"; Expected type "Date". Date cannot represent an invalid date-string ${user.dateOfBirth}.`,
    );

    // Future
    user.dateOfBirth = (faker.date.future().toISOString().split('T')[0] as unknown) as Date;
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should fail due to invalid email on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.email = (null as unknown) as string;
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$email" of non-null type "EmailAddress!" must not be null.`,
    );

    // Invalid
    user.email = faker.internet.email().replace(/@/g, '');
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$email" got invalid value "${user.email}"; Expected type "EmailAddress". Value is not a valid email address: ${user.email}`,
    );
  });

  test('it should fail due to invalid phone on mutation createUser', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.phone = (null as unknown) as string;
    let response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$phone" of non-null type "PhoneNumber!" must not be null.`,
    );

    // Length < 10
    user.phone = faker.phone.phoneNumber('+39#######');
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);

    // Length > 15
    user.phone = faker.phone.phoneNumber('+################');
    response = await makeGraphQlRequest({ source: MUTATION_CREATE_USER, variables: user });
    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$phone" got invalid value "${user.phone}"; Expected type "PhoneNumber". Value is not a valid phone number of the form +17895551234 (10-15 digits): ${user.phone}`,
    );
  });

  test('it should return authenticated user on query me', async () => {
    const user: UserCreateInput = createMinimalUser();
    const { id, roles } = await userService.create(user);
    const response = await makeGraphQlRequest({
      source: QUERY_ME,
      token: { id, roles },
    });

    checkResponseIsData(response);
    expect(response.data!.me).toBeDefined();
    checkMinimalUser(response.data!.me, user);
  });

  test('it should fail due to unauthorized on query me', async () => {
    const response = await makeGraphQlRequest({
      source: QUERY_ME,
    });

    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(
      `Access denied! You need to be authorized to perform this action!`,
    );
  });

  test('it should fail due to unknown id on query me', async () => {
    const id: string = faker.random.uuid();

    try {
      await userService.delete(id);
    } catch (error) {
      // User does not exists
    }

    const response = await makeGraphQlRequest({
      source: QUERY_ME,
      token: { id, roles: [UserRoles.USER] },
    });

    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(
      `Could not find any entity of type "User" matching: "${id}"`,
    );
  });

  test('it should fail due to invalid id on query me', async () => {
    const id: string = 'Not a UUID';

    const response = await makeGraphQlRequest({
      source: QUERY_ME,
      token: { id, roles: [UserRoles.USER] },
    });

    checkResponseIsError(response, true);
    expect(response.errors![0].message).toStrictEqual(
      `invalid input syntax for type uuid: "${id}"`,
    );
  });

  test('it should return a user having the same id on query user', async () => {
    const user: User = await userService.create(createMinimalUser());
    const response = await makeGraphQlRequest({
      source: QUERY_USER,
      variables: { id: user.id },
      token: { id: user.id, roles: user.roles },
    });

    checkResponseIsData(response);
    expect(response.data!.user).toBeDefined();
    checkMinimalUser(response.data!.user, user as UserCreateInput);
  });

  test('it should return null if no user found on query user', async () => {
    const id: string = faker.random.uuid();

    try {
      await userService.delete(id);
    } catch (error) {
      // User does not exists
    }

    const response = await makeGraphQlRequest({
      source: QUERY_USER,
      variables: { id },
      token: { id: faker.random.uuid(), roles: [UserRoles.USER] },
    });

    checkResponseIsData(response);
    expect(response.data!.user).toBeNull();
  });

  test('it should fail due to unauthorized on query user', async () => {
    const response = await makeGraphQlRequest({
      source: QUERY_USER,
      variables: { id: faker.random.uuid() },
    });

    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Access denied! You need to be authorized to perform this action!`,
    );
  });

  test('it should fail due to invalid id on query user', async () => {
    const id: string = 'Not a UUID';

    const response = await makeGraphQlRequest({
      source: QUERY_USER,
      variables: { id },
      token: { id: faker.random.uuid(), roles: [UserRoles.USER] },
    });

    checkResponseIsError(response);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$id" got invalid value "${id}"; Expected type "UUID". Value is not a valid UUID: ${id}`,
    );
  });
});
