/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { IToken } from '@graphmarket/interfaces';
import { User } from '@graphmarket/entities';
import { AuthenticationError, VerificationError } from '@graphmarket/errors';
import { CryptUtil } from '@graphmarket/utils';
import logger from '@graphmarket/logger';
import { PhoneAdapter, EmailAdapter, TokenAdapter } from '@graphmarket/adapters';
import config from '@app/config';

/**
 * Authentication service.
 *
 * @see AuthenticationService
 */
@Service()
export default class AuthenticationService {
  /**
   * Token adapter instance.
   */
  @Inject()
  private readonly tokenAdapter!: TokenAdapter;

  /**
   * Phone adapter instance.
   */
  @Inject()
  private readonly phoneAdapter!: PhoneAdapter;

  /**
   * Email adapter instance.
   */
  @Inject()
  private readonly emailAdapter!: EmailAdapter;

  /**
   * Verify a user identified by id with email and phone codes.
   *
   * @param id - User's id
   * @param emailCode - Email code
   * @param phoneCode - Phone code
   * @param manager - Transaction manager
   * @returns Verified User
   * @see EmailService
   * @see PhoneService
   */
  @Transaction()
  public async verify(
    id: string,
    emailCode: string,
    phoneCode: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<string> {
    let user: User | undefined;

    try {
      // Obtain user
      user = await manager!.findOneOrFail(User, id);

      // Check email verification
      await this.emailAdapter.checkVerification(user.email, emailCode);

      // Check phone verification
      await this.phoneAdapter.checkVerification(user.phone, phoneCode);
    } catch (error) {
      logger.error(`Verification failed for user ${id}`);

      throw new VerificationError({ message: 'Verification failed' });
    }

    await manager!.update(User, id, { verified: true });

    return this.tokenAdapter.sign({ id: user.id, roles: user.roles }, config.TOKEN.SECRET, {
      expiresIn: config.TOKEN.EXPIRATION_TIME,
    });
  }

  /**
   * Sign in procedure.
   *
   * @param username - User's username
   * @param password - User's password
   * @param manager - Transaction manager
   * @returns Encoded authentication token
   * @see TokenService
   */
  @Transaction()
  public async signIn(
    username: string,
    password: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<string> {
    const user: User | undefined = await manager!.findOne(
      User,
      { username },
      { select: ['id', 'password', 'roles', 'verified'] },
    );

    // Check if user exists and password is valid
    if (!user || !(await CryptUtil.compare(password, user.password!))) {
      logger.warn(`Sign in procedure failed for user ${user ? user.id : '?'}`);

      throw new AuthenticationError();
    }

    // Check if user is verified
    if (!user.verified) {
      logger.warn(`Sign in procedure failed for user ${user.id} due to not verified`);

      throw new VerificationError({ userId: user.id });
    }

    logger.info(`Sign in procedure succeeded for user ${user.id}`);

    return this.tokenAdapter.sign({ id: user.id, roles: user.roles }, config.TOKEN.SECRET, {
      expiresIn: config.TOKEN.EXPIRATION_TIME,
    });
  }

  /**
   * Sign out procedure.
   *
   * @param user - Decoded token
   * @see TokenService
   */
  public async signOut(user: Pick<IToken, 'sub' | 'iat'>): Promise<void> {
    // Revoke token
    await this.tokenAdapter.revoke(user);

    logger.info(`Sign out procedure succeeded for user ${user.sub}`);
  }

  /**
   * Resend the verification codes to the user identified by userId.
   *
   * @param userId - User id
   * @param manager - transaction manager
   */
  @Transaction()
  public async resend(
    userId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    // Obtain user
    const user: User = await manager!.findOneOrFail(User, userId, {
      select: ['verified', 'phone', 'email', 'username'],
    });

    if (user.verified)
      throw new VerificationError({ message: `User ${user.id} has been already verified` });

    // Send verification message
    await this.phoneAdapter.sendVerification(user.phone);

    // Send verification email
    await this.emailAdapter.sendVerification(user.email, { user: { username: user.username } });

    logger.info(`New verification codes sended for user ${userId}`);
  }
}
