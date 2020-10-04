module.exports = {
  roots: ['<rootDir>/test'],
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      compiler: 'ttypescript'
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
