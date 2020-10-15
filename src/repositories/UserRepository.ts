/* eslint-disable class-methods-use-this */
import {
  AbstractRepository,
  EntityManager,
  EntityRepository,
  FindManyOptions,
  Transaction,
  TransactionManager,
} from 'typeorm';
import blacklist from 'express-jwt-blacklist';
import { UserCreateInput, UserUpdateInput } from '@app/graphql/inputs';
import User from '@app/entities/User';
import { CryptUtil } from '@app/util';
import { JWTHelper } from '@app/helper';
import { AuthenticationError } from '@app/error';
import logger from '@app/logger';
import { IJWT } from '@app/types';

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  @Transaction()
  public async createOrFail(
    data: UserCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = await manager!.save(manager!.create(User, data));
    logger.info(`Created user having id ${user.id}`);

    return user;
  }

  public readOneOrFail(id: string): Promise<User> {
    return this.manager.findOneOrFail(User, id, { cache: true });
  }

  public readOrFail(options?: FindManyOptions): Promise<User[]> {
    return this.manager.find(User, { ...options, cache: true });
  }

  @Transaction()
  public async updateOrFail(
    id: string,
    data: UserUpdateInput,
    jwt: IJWT,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = manager!.create(User, data);
    await manager!.update(User, id, user);

    // Purge all jwt tokens if password exists
    if (data.password) blacklist.purge(jwt);

    logger.info(`Updated user having id ${id}`);

    return manager!.findOneOrFail(User, id);
  }

  @Transaction()
  public async deleteOrFail(
    id: string,
    jwt: IJWT,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = await manager!.findOneOrFail(User, id);
    await manager!.delete(User, id);

    // Purge all jwt tokens
    blacklist.purge(jwt);

    logger.info(`Deleted user having id ${id}`);

    return user;
  }

  async signIn(username: string, password: string): Promise<string> {
    const user: User | undefined = await this.manager.findOne(
      User,
      { username },
      { select: ['id', 'password', 'roles'] },
    );

    if (!user || !(await CryptUtil.compare(password, user.password!))) {
      logger.warn(`Signed in failed user having id ${user ? user.id : undefined}`);
      throw new AuthenticationError();
    }
    logger.info(`Signed in successfully user having id ${user.id}`);

    return JWTHelper.sign({ id: user.id, roles: user.roles });
  }

  async signOut(jwt: IJWT): Promise<boolean> {
    // Revoke jwt token
    blacklist.revoke(jwt);
    logger.info(`Signed out successfullt user having id ${jwt.id}`);
    return true;
  }
}
