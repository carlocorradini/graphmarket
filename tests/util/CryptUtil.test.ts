import faker from 'faker';
import CryptUtil from '@app/utils/CryptUtil';

describe('CryptUtil testing', () => {
  test('it should hash synchronously', () => {
    const password: string = faker.internet.password(16);

    expect(CryptUtil.hashSync(password)).toBeDefined();
    expect(CryptUtil.hashSync(password)).not.toEqual(CryptUtil.hashSync(password));
    expect(CryptUtil.hashSync(password)).toHaveLength(60);
  });

  test('it should hash asynchronously', async () => {
    const password: string = faker.internet.password(16);

    await expect(CryptUtil.hash(password)).resolves.not.toThrow();
    await expect(CryptUtil.hash(password)).resolves.not.toEqual(await CryptUtil.hash(password));
    await expect(CryptUtil.hash(password)).resolves.toHaveLength(60);
  });

  test('it should compare synchronously', () => {
    const password1 = faker.internet.password(16);
    const password1Hash = CryptUtil.hashSync(password1);
    const password2 = faker.internet.password(16);
    const password2Hash = CryptUtil.hashSync(password2);
    const password1And2 = `${password1} ${password2}`;
    const password1And2Hash = CryptUtil.hashSync(password1And2);

    expect(CryptUtil.compareSync(password1, password1Hash)).toBeTruthy();
    expect(CryptUtil.compareSync(password1, password2Hash)).toBeFalsy();
    expect(CryptUtil.compareSync(password1, password1And2Hash)).toBeFalsy();

    expect(CryptUtil.compareSync(password2, password2Hash)).toBeTruthy();
    expect(CryptUtil.compareSync(password2, password1Hash)).toBeFalsy();
    expect(CryptUtil.compareSync(password2, password1And2Hash)).toBeFalsy();

    expect(CryptUtil.compareSync(password1And2, password1And2Hash)).toBeTruthy();
    expect(CryptUtil.compareSync(password1And2, password1Hash)).toBeFalsy();
    expect(CryptUtil.compareSync(password1And2, password2Hash)).toBeFalsy();
  });

  test('it should compare asynchronously', async () => {
    const password1 = faker.internet.password(16);
    const password1Hash = await CryptUtil.hash(password1);
    const password2 = faker.internet.password(16);
    const password2Hash = await CryptUtil.hash(password2);
    const password1And2 = `${password1} ${password2}`;
    const password1And2Hash = await CryptUtil.hash(password1And2);

    await expect(CryptUtil.compare(password1, password1Hash)).resolves.toBeTruthy();
    await expect(CryptUtil.compare(password1, password2Hash)).resolves.toBeFalsy();
    await expect(CryptUtil.compare(password1, password1And2Hash)).resolves.toBeFalsy();

    await expect(CryptUtil.compare(password2, password2Hash)).resolves.toBeTruthy();
    await expect(CryptUtil.compare(password2, password1Hash)).resolves.toBeFalsy();
    await expect(CryptUtil.compare(password2, password1And2Hash)).resolves.toBeFalsy();

    await expect(CryptUtil.compare(password1And2, password1And2Hash)).resolves.toBeTruthy();
    await expect(CryptUtil.compare(password1And2, password1Hash)).resolves.toBeFalsy();
    await expect(CryptUtil.compare(password1And2, password2Hash)).resolves.toBeFalsy();
  });
});
