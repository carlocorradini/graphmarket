import faker from 'faker';
import VerificationError, { IVerificationErrorData } from '@app/VerificationError';

const throwVerificationError = (errorData?: IVerificationErrorData) => {
  throw new VerificationError(errorData);
};

describe('Verification error testing', () => {
  test('it should create a verification error', () => {
    expect(new VerificationError()).toBeDefined();
    expect(new VerificationError({})).toBeDefined();
    expect(new VerificationError({ message: faker.random.words() })).toBeDefined();
    expect(new VerificationError({ userId: faker.random.uuid() })).toBeDefined();
    expect(
      new VerificationError({ message: faker.random.words(), userId: faker.random.uuid() }),
    ).toBeDefined();
  });

  test('it should be an error instance', () => {
    expect(new VerificationError()).toBeInstanceOf(Error);
  });

  test('is should be throwable', () => {
    expect(throwVerificationError).toThrow(VerificationError);
  });

  test('error name and message should be equal to the provided', () => {
    const message: string = faker.random.words();
    const userId: string = faker.random.uuid();

    expect(() => throwVerificationError()).toThrow({
      name: 'VerificationError',
      message: 'Verification missing to execute the procedure',
    });
    expect(() => throwVerificationError({ message })).toThrow({
      name: 'VerificationError',
      message,
    });
    expect(() => throwVerificationError({ userId })).toThrow({
      name: 'VerificationError',
      message: 'Verification missing to execute the procedure',
    });
    expect(() => throwVerificationError({ message, userId })).toThrow({
      name: 'VerificationError',
      message,
    });
  });
});
