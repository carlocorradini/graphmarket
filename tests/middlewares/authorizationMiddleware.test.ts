import { ArgsDictionary, ResolverData } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import faker from 'faker';
import authorizationMiddleware from '@app/middlewares/authorizationMiddleware';
import { UserRoles } from '@app/entities/User';
import { IContext } from '@app/types';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

const createResolverData = (context: IContext = {}): ResolverData<IContext> => ({
  args: (undefined as unknown) as ArgsDictionary,
  context,
  info: (undefined as unknown) as GraphQLResolveInfo,
  root: (undefined as unknown) as any,
});

const createContext = (partialContext: DeepPartial<IContext> = {}): IContext => {
  const id: string = partialContext?.user?.id ? partialContext.user.id : faker.random.uuid();
  const sub: string = partialContext?.user?.sub ? partialContext.user.sub : id;

  return {
    user: {
      iat: partialContext?.user?.iat ? partialContext.user.iat : faker.date.past().getTime(),
      exp: partialContext?.user?.exp ? partialContext.user.exp : faker.date.future().getTime(),
      sub,
      id,
      roles: partialContext?.user?.roles ? (partialContext.user.roles as UserRoles[]) : [],
    },
  };
};

describe('Authorization middleware test', () => {
  test('it should return true if roles is empty and user is defined', () => {
    expect(authorizationMiddleware(createResolverData(createContext()), [])).toBeTruthy();
  });

  test('it should return false if roles is empty and user is undefined', () => {
    expect(authorizationMiddleware(createResolverData(), [])).toBeFalsy();
  });

  test('it should return false if roles is not empty and user is undefined', () => {
    expect(authorizationMiddleware(createResolverData(), [UserRoles.USER])).toBeFalsy();
  });

  test('it should return true if roles is not empty and the user has at least one allowed role', () => {
    const context = createContext({
      user: {
        roles: [UserRoles.ADMINISTRATOR],
      },
    });

    expect(
      authorizationMiddleware(createResolverData(context), [UserRoles.ADMINISTRATOR]),
    ).toBeTruthy();
  });

  test('it should return false if roles is not empty and the user has none allowed role', () => {
    const context = createContext({
      user: {
        roles: [UserRoles.USER],
      },
    });

    expect(
      authorizationMiddleware(createResolverData(context), [UserRoles.ADMINISTRATOR]),
    ).toBeFalsy();
  });
});
