import { Connection } from 'typeorm';
import createTestConnection from '../../createTestConnection';
import graphqlTestCall from '../../graphqlTestCall';

const CREATE_USER = `
  mutation {
    createUser(
      data: {
        username: "carlocorradini"
        password: "password"
        name: "Carlo"
        surname: "Corradini"
        gender: MALE
        dateOfBirth: "1998-12-24"
        email: "carlo.corradini@gmail.com"
        phone: "+393273679553"
      }
    ) {
      username
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
  test('it should create a user', async () => {
    const response = await graphqlTestCall(CREATE_USER);

    expect(response).toEqual({ data: { createUser: { username: 'carlocorradini' } } });
  });
});
