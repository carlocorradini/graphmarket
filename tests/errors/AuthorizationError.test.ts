import AuthorizationError from '@app/errors/AuthorizationError';

const throwAuthorizationError = () => {
  throw new AuthorizationError();
};

describe('Authorization error testing', () => {
  test('it should create an authorization error', () => {
    expect(new AuthorizationError()).toBeDefined();
  });

  test('it should be an error instance', () => {
    expect(new AuthorizationError()).toBeInstanceOf(Error);
  });

  test('is should be throwable', () => {
    expect(throwAuthorizationError).toThrow(AuthorizationError);
  });

  test('error name and message should be equal to the provided', () => {
    expect(() => throwAuthorizationError()).toThrow({
      name: 'AuthorizationError',
      message: 'Insufficient permissions to execute the procedure',
    });
  });
});
