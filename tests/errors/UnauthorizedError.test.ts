import UnauthorizedError from '@app/errors/UnauthorizedError';

const throwUnauthorizedError = () => {
  throw new UnauthorizedError();
};

describe('Unauthorized error testing', () => {
  test('it should create an unauthorized error', () => {
    expect(new UnauthorizedError()).toBeDefined();
  });

  test('it should be an error instance', () => {
    expect(new UnauthorizedError()).toBeInstanceOf(Error);
  });

  test('is should be throwable', () => {
    expect(throwUnauthorizedError).toThrow(UnauthorizedError);
  });

  test('error name and message should be equal to the provided', () => {
    expect(() => throwUnauthorizedError()).toThrow({
      name: 'UnauthorizedError',
      message: 'Insufficient permissions to execute the procedure',
    });
  });
});
