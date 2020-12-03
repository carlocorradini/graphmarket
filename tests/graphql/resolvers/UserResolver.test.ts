import { Connection } from 'typeorm';
import { isEmail, isISO8601, isPhoneNumber, isUUID, isDate } from 'class-validator';
import faker from 'faker';
import createTestConnection from '../../createTestConnection';
import graphqlTestCall from '../../graphqlTestCall';
import User, { UserGenders, UserRoles } from '../../../src/entities/User';

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
  let conn: Connection;

  beforeAll(async () => {
    conn = await createTestConnection();
  });

  afterAll(async () => {
    await conn.close();
  });

  test('it should create a user with minimum parameters', async () => {
    const user: User = conn.manager.create(User, {
      username: faker.internet.userName(),
      password: faker.internet.password(8),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber('+393#########'),
    });
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
    const user: User = conn.manager.create(User, {
      username: faker.internet.userName(),
      password: faker.internet.password(8),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      gender: UserGenders.OTHER,
      dateOfBirth: faker.date.past().toISOString().split('T')[0],
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber('+393#########'),
    });
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

  test('it should return current authenticated user', async () => {
    const user: User = conn.manager.create(User, {
      username: faker.internet.userName(),
      password: faker.internet.password(8),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber('+393#########'),
    });

    let response = await graphqlTestCall(MUTATION_CREATE_USER, user);
    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data!.createUser).toBeDefined();
    user.id = response.data!.createUser.id;

    response = await graphqlTestCall(QUERY_ME, {}, { id: user.id });
    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data!.me).toBeDefined();

    const data: User = response.data!.me;

    expect(data!.id).toBeDefined();
    expect(isUUID(data!.id)).toBeTruthy();
    expect(data!.id).toStrictEqual(user.id);

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
