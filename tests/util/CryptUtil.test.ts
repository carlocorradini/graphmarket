/* eslint-disable no-restricted-syntax */
import CryptUtil from '../../src/utils/CryptUtil';

const STRINGS: string[] = ['password', '1234', 'LongPasswordTest', 'Pa$$word1$'];
const STRING_HASHED_LENGTH: number = 60;

describe('CryptUtil testing', () => {
  const STRINGS_HASHED_SYNC: string[] = [];
  const STRINGS_HASHED_ASYNC: string[] = [];

  beforeAll(async () => {
    for (const s of STRINGS) {
      STRINGS_HASHED_SYNC.push(CryptUtil.hashSync(s));
      // eslint-disable-next-line no-await-in-loop
      STRINGS_HASHED_ASYNC.push(await CryptUtil.hash(s));
    }
  });

  it('should hashed synchronously', () => {
    for (const s of STRINGS_HASHED_SYNC) {
      expect(s).toHaveLength(STRING_HASHED_LENGTH);
    }
  });

  it('should hashed asynchronously', () => {
    for (const s of STRINGS_HASHED_ASYNC) {
      expect(s).toHaveLength(STRING_HASHED_LENGTH);
    }
  });

  it('should compare synchronously', () => {
    for (const [i, s] of STRINGS_HASHED_SYNC.entries()) {
      expect(CryptUtil.compareSync(STRINGS[i], s)).toBeTruthy();
    }
  });

  it('should compare asynchronously', async () => {
    for (const [i, s] of STRINGS_HASHED_ASYNC.entries()) {
      // eslint-disable-next-line no-await-in-loop
      expect(await CryptUtil.compare(STRINGS[i], s)).toBeTruthy();
    }
  });

  it('should not compare synchronously', () => {
    for (const s of STRINGS_HASHED_SYNC) {
      expect(CryptUtil.compareSync('', s)).toBeFalsy();
    }
  });

  it('should not compare asynchronously', () => {
    for (const s of STRINGS_HASHED_ASYNC) {
      expect(CryptUtil.compareSync('', s)).toBeFalsy();
    }
  });
});
