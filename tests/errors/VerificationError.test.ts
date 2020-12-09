import VerificationError from '@app/errors/VerificationError';

const throwVerificationError = () => {
  throw new VerificationError();
};

describe('Verification error testing', () => {
  test('it should create a verification error', () => {
    expect(new VerificationError()).toBeDefined();
  });

  test('it should be an error instance', () => {
    expect(new VerificationError()).toBeInstanceOf(Error);
  });

  test('is should be throwable', () => {
    expect(throwVerificationError).toThrow(VerificationError);
  });

  test('error name and message should be equal to the provided', () => {
    expect(() => throwVerificationError()).toThrow({
      name: 'VerificationError',
      message: 'Verification missing to execute the procedure',
    });
  });
});
