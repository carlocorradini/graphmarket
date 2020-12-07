import EnvUtil from '../../src/utils/EnvUtil';

describe('EnvUtil testing', () => {
  test('env identifiers name should match with the value', () => {
    expect(EnvUtil.ENV_PRODUCTION).toStrictEqual('production');
    expect(EnvUtil.ENV_DEVELOPMENT).toStrictEqual('development');
    expect(EnvUtil.ENV_TEST).toStrictEqual('test');
  });

  test('current environment should be defined and equal to test', () => {
    expect(EnvUtil.getCurrentEnv()).toBeDefined();
    expect(EnvUtil.getCurrentEnv()).toStrictEqual(EnvUtil.ENV_TEST);
  });

  test('isProduction function should return false', () => {
    expect(EnvUtil.isProduction()).toBeFalsy();
  });

  test('isDevelopment function should return false', () => {
    expect(EnvUtil.isDevelopment()).toBeFalsy();
  });

  test('isTest function should return true', () => {
    expect(EnvUtil.isTest()).toBeTruthy();
  });
});
