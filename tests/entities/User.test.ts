import faker from 'faker';
import User, { UserGenders, UserRoles } from '../../src/entities/User';

const USER_PROPERTIES_COUNT: number = 12;
const USER_GENDERS_COUNT: number = 72;
const USER_ROLES_COUNT: number = 3;

describe('User entity testing', () => {
  test('it should create a user entity', () => {
    expect(new User()).toBeDefined();
  });

  test('it should assign all available properties with the correct type', () => {
    const userFake: Required<User> = {
      id: faker.random.uuid(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      roles: [UserRoles.USER],
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      gender: UserGenders.OTHER,
      dateOfBirth: faker.date.past(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber('+3932########'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user: User = new User();

    expect(Object.keys(userFake)).toHaveLength(USER_PROPERTIES_COUNT);

    user.id = userFake.id;
    expect(user.id).toStrictEqual(userFake.id);

    user.username = userFake.username;
    expect(user.username).toStrictEqual(userFake.username);

    user.password = userFake.password;
    expect(user.password).toStrictEqual(userFake.password);

    user.roles = userFake.roles;
    expect(user.roles).toStrictEqual(userFake.roles);

    user.name = userFake.name;
    expect(user.name).toStrictEqual(userFake.name);

    user.surname = userFake.surname;
    expect(user.surname).toStrictEqual(userFake.surname);

    user.gender = userFake.gender;
    expect(user.gender).toStrictEqual(user.gender);

    user.dateOfBirth = userFake.dateOfBirth;
    expect(user.dateOfBirth).toStrictEqual(user.dateOfBirth);

    user.email = userFake.email;
    expect(user.email).toStrictEqual(userFake.email);

    user.phone = userFake.phone;
    expect(user.phone).toStrictEqual(userFake.phone);

    user.createdAt = userFake.createdAt;
    expect(user.createdAt).toStrictEqual(userFake.createdAt);

    user.updatedAt = userFake.updatedAt;
    expect(user.updatedAt).toStrictEqual(userFake.updatedAt);
  });

  test(`user genders count should be ${USER_GENDERS_COUNT}`, () => {
    expect(Object.keys(UserGenders)).toHaveLength(USER_GENDERS_COUNT);
  });

  test(`user roles count should be ${USER_ROLES_COUNT}`, () => {
    expect(Object.keys(UserRoles)).toHaveLength(USER_ROLES_COUNT);
  });
});
