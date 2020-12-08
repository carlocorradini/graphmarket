import AuthenticationError from '../../src/errors/AuthenticationError';

const throwAuthenticationError = () => {
  throw new AuthenticationError();
};

describe('Authentication error testing', () => {
  test('it should create an authentication error', () => {
    expect(new AuthenticationError()).toBeDefined();
  });

  test('it should be an error instance', () => {
    expect(new AuthenticationError()).toBeInstanceOf(Error);
  });

  test('is should be throwable', () => {
    expect(throwAuthenticationError).toThrow(AuthenticationError);
  });

  test('error name and message should be equal to the provided', () => {
    expect(() => throwAuthenticationError()).toThrow({
      name: 'AuthenticationError',
      message: 'Invalid username and/or password',
    });
  });
});
