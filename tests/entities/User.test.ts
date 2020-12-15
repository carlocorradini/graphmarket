import faker from 'faker';
import User, { UserGenders, UserRoles } from '@app/entities/User';

const USER_PROPERTIES_COUNT: number = 14;
const USER_GENDERS_COUNT: number = 72;
const USER_ROLES_COUNT: number = 3;

describe('User entity testing', () => {
  test('it should create a user entity', () => {
    expect(new User()).toBeDefined();
  });

  test('it should assign all available properties with the correct type', () => {
    const userTemplate: Required<User> = {
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
      avatar: faker.image.imageUrl(512, 512),
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
    };
    const user: User = new User();

    expect(Object.keys(userTemplate)).toHaveLength(USER_PROPERTIES_COUNT);

    user.id = userTemplate.id;
    expect(user.id).toStrictEqual(userTemplate.id);

    user.username = userTemplate.username;
    expect(user.username).toStrictEqual(userTemplate.username);

    user.password = userTemplate.password;
    expect(user.password).toStrictEqual(userTemplate.password);

    user.roles = userTemplate.roles;
    expect(user.roles).toStrictEqual(userTemplate.roles);

    user.name = userTemplate.name;
    expect(user.name).toStrictEqual(userTemplate.name);

    user.surname = userTemplate.surname;
    expect(user.surname).toStrictEqual(userTemplate.surname);

    user.gender = userTemplate.gender;
    expect(user.gender).toStrictEqual(user.gender);

    user.dateOfBirth = userTemplate.dateOfBirth;
    expect(user.dateOfBirth).toStrictEqual(user.dateOfBirth);

    user.email = userTemplate.email;
    expect(user.email).toStrictEqual(userTemplate.email);

    user.phone = userTemplate.phone;
    expect(user.phone).toStrictEqual(userTemplate.phone);

    user.avatar = userTemplate.avatar;
    expect(user.avatar).toStrictEqual(userTemplate.avatar);

    user.createdAt = userTemplate.createdAt;
    expect(user.createdAt).toStrictEqual(userTemplate.createdAt);

    user.updatedAt = userTemplate.updatedAt;
    expect(user.updatedAt).toStrictEqual(userTemplate.updatedAt);
  });

  test(`user genders count should be ${USER_GENDERS_COUNT}`, () => {
    expect(Object.keys(UserGenders)).toHaveLength(USER_GENDERS_COUNT);
  });

  test(`user roles count should be ${USER_ROLES_COUNT}`, () => {
    expect(Object.keys(UserRoles)).toHaveLength(USER_ROLES_COUNT);
  });
});
