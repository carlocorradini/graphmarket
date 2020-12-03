import CryptUtil from '../../src/utils/CryptUtil';

describe('CryptUtil testing', () => {
  test('it should hash synchronously', () => {
    expect(CryptUtil.hashSync('password')).toBeDefined();
    expect(CryptUtil.hashSync('password')).not.toEqual(CryptUtil.hashSync('password'));
    expect(CryptUtil.hashSync('password')).toHaveLength(60);
  });

  test('it should hashed asynchronously', async () => {
    await expect(CryptUtil.hash('password')).resolves.not.toThrow();
    await expect(CryptUtil.hash('password')).resolves.not.toEqual(await CryptUtil.hash('password'));
    await expect(CryptUtil.hash('password')).resolves.toHaveLength(60);
  });

  test('it should compare synchronously', () => {
    const hashHello = CryptUtil.hashSync('hello');
    const hashWorld = CryptUtil.hashSync('world');
    const hashHelloWorld = CryptUtil.hashSync('hello world');

    expect(CryptUtil.compareSync('hello', hashHello)).toBeTruthy();
    expect(CryptUtil.compareSync('hello', hashWorld)).toBeFalsy();
    expect(CryptUtil.compareSync('hello', hashHelloWorld)).toBeFalsy();

    expect(CryptUtil.compareSync('world', hashWorld)).toBeTruthy();
    expect(CryptUtil.compareSync('world', hashHello)).toBeFalsy();
    expect(CryptUtil.compareSync('world', hashHelloWorld)).toBeFalsy();

    expect(CryptUtil.compareSync('hello world', hashHelloWorld)).toBeTruthy();
    expect(CryptUtil.compareSync('hello world', hashHello)).toBeFalsy();
    expect(CryptUtil.compareSync('hello world', hashWorld)).toBeFalsy();
  });

  test('it should compare asynchronously', async () => {
    const hashHello = await CryptUtil.hash('hello');
    const hashWorld = await CryptUtil.hash('world');
    const hashHelloWorld = await CryptUtil.hash('hello world');

    await expect(CryptUtil.compare('hello', hashHello)).resolves.toBeTruthy();
    await expect(CryptUtil.compare('hello', hashWorld)).resolves.toBeFalsy();
    await expect(CryptUtil.compare('hello', hashHelloWorld)).resolves.toBeFalsy();

    await expect(CryptUtil.compare('world', hashWorld)).resolves.toBeTruthy();
    await expect(CryptUtil.compare('world', hashHello)).resolves.toBeFalsy();
    await expect(CryptUtil.compare('world', hashHelloWorld)).resolves.toBeFalsy();

    await expect(CryptUtil.compare('hello world', hashHelloWorld)).resolves.toBeTruthy();
    await expect(CryptUtil.compare('hello world', hashHello)).resolves.toBeFalsy();
    await expect(CryptUtil.compare('hello world', hashWorld)).resolves.toBeFalsy();
  });
});
