import { Connection } from 'typeorm';
import { isEmail, isISO8601, isPhoneNumber, isUUID, isDate } from 'class-validator';
import faker from 'faker';
import Container from 'typedi';
import createTestConnection from '../../createTestConnection';
import graphqlTestCall from '../../graphqlTestCall';
import User, { UserGenders, UserRoles } from '../../../src/entities/User';
import { UserCreateInput } from '../../../src/graphql/inputs/user';
import { UserService } from '../../../src/services';

const createMinimalUser = (): UserCreateInput => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(8),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber('+3932########'),
  };
};

const MUTATION_CREATE_USER = `
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
      createdAt
      updatedAt
    }
  }
`;

/* const MUTATION_SIGN_IN = `
  mutation SignIn($username: NonEmptyString!, $password: NonEmptyString!) {
    signIn(username: $username, password: $password)
  }
`; */

const QUERY_ME = `
  query Me {
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
      createdAt
      updatedAt
    }
  }
`;

describe('UserResolver testing', () => {
  const userService: UserService = Container.get(UserService);
  let conn: Connection;

  beforeAll(async () => {
    conn = await createTestConnection();
  });

  afterAll(async () => {
    await conn.close();
  });

  test('it should create a user with minimum parameters', async () => {
    const user: UserCreateInput = createMinimalUser();
    const response = await graphqlTestCall(MUTATION_CREATE_USER, user);

    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data!.createUser).toBeDefined();

    const data: User = response.data!.createUser;

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

    expect(data!.createdAt).toBeDefined();
    expect(isDate(data!.createdAt)).toBeTruthy();

    expect(data!.updatedAt).toBeDefined();
    expect(isDate(data!.updatedAt)).toBeTruthy();
  });

  test('it should create a user with maximum parameters', async () => {
    const user: Required<UserCreateInput> = {
      ...createMinimalUser(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      gender: UserGenders.OTHER,
      dateOfBirth: (faker.date.past().toISOString().split('T')[0] as unknown) as Date,
    };
    const response = await graphqlTestCall(MUTATION_CREATE_USER, user);

    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data!.createUser).toBeDefined();

    const data: User = response.data!.createUser;

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

    expect(data!.createdAt).toBeDefined();
    expect(isDate(data!.createdAt)).toBeTruthy();

    expect(data!.updatedAt).toBeDefined();
    expect(isDate(data!.updatedAt)).toBeTruthy();
  });

  test('it should not create a user due to invalid username', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.username = (null as unknown) as string;
    let response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$username" of non-null type "NonEmptyString!" must not be null.`,
    );

    // Length < 1
    user.username = '';
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$username" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.username = faker.random.alphaNumeric(65);
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeNull();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should not create a user due to invalid password', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Null
    user.password = (null as unknown) as string;
    let response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$password" of non-null type "NonEmptyString!" must not be null.`,
    );

    // Length < 8
    user.password = faker.internet.password(7);
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeNull();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);

    // Length > 64 characters
    user.password = faker.internet.password(65);
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeNull();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should not create a user due to invalid name', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Length < 1
    user.name = '';
    let response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$name" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.name = faker.random.alpha({ count: 65 });
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeNull();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should not create a user due to invalid surname', async () => {
    const user: UserCreateInput = createMinimalUser();

    // Length < 1
    user.surname = '';
    let response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(
      `Variable "$surname" got invalid value ""; Expected type "NonEmptyString". Value cannot be an empty string: `,
    );

    // Length > 64
    user.surname = faker.random.alpha({ count: 65 });
    response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.data).toBeNull();
    expect(response.errors).toBeDefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors![0].message).toStrictEqual(`Argument Validation Error`);
  });

  test('it should return authenticated user', async () => {
    const user: UserCreateInput = createMinimalUser();
    const { id } = await userService.create(user);
    const response = await graphqlTestCall(QUERY_ME, {}, { id });

    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data!.me).toBeDefined();

    const data: User = response.data!.me;

    expect(data!.id).toBeDefined();
    expect(isUUID(data!.id)).toBeTruthy();
    expect(data!.id).toStrictEqual(id);

    expect(data!.username).toBeDefined();
    expect(data!.username).toStrictEqual(user.username);

    expect(data!.password).toBeUndefined();

    expect(data!.roles).toBeDefined();
    expect(data!.roles).toHaveLength(1);
    expect(data!.roles).toContainEqual(UserRoles.USER);

    expect(data!.email).toBeDefined();
    expect(isEmail(data!.email)).toBeTruthy();
    expect(data!.email).toStrictEqual(user.email);

    expect(data!.phone).toBeDefined();
    expect(isPhoneNumber(data!.phone, null)).toBeTruthy();
    expect(data!.phone).toStrictEqual(user.phone);

    expect(data!.createdAt).toBeDefined();
    expect(isDate(data!.createdAt)).toBeTruthy();

    expect(data!.updatedAt).toBeDefined();
    expect(isDate(data!.updatedAt)).toBeTruthy();
  });
});
