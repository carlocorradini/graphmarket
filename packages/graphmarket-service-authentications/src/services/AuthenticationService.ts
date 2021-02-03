/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { IToken } from '@graphmarket/interfaces';
import { User } from '@graphmarket/entities';
import { AuthenticationError, AuthorizationError, VerificationError } from '@graphmarket/errors';
import { CryptUtil } from '@graphmarket/utils';
import logger from '@graphmarket/logger';
import { PhoneAdapter, EmailAdapter, TokenAdapter } from '@graphmarket/adapters';
import config from '@app/config';
import { UserRepository } from '@app/repositories';

/**
 * Authentication service.
 *
 * @see User
 * @see UserRepository
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
   * Create a new authentication token for the user.
   *
   * @param user - User data
   * @returns Authentication token
   */
  private createToken(user: Pick<User, 'id' | 'roles'>) {
    return this.tokenAdapter.sign({ id: user.id, roles: user.roles }, config.TOKEN.SECRET, {
      expiresIn: config.TOKEN.EXPIRATION_TIME,
    });
  }

  /**
   * Verify a user identified by email and phone codes.
   *
   * @param id - User id
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
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);
    let user: User | undefined;

    try {
      // Obtain user
      user = await userRepository.readOneById(id);
      if (!user) throw new AuthorizationError();

      // Check email verification
      await this.emailAdapter.checkVerification(user.email, emailCode);
      logger.info(`User ${user.id} email code verified`);

      // Check phone verification
      await this.phoneAdapter.checkVerification(user.phone, phoneCode);
      logger.info(`User ${user.id} phone code verified`);
    } catch (error) {
      logger.error(`Verification failed for user ${id}`);
      throw new VerificationError({ message: 'Verification failed' });
    }

    // Update verified status
    await userRepository.updateVerifiedStatus(id, true);

    logger.info(`User ${id} has been verified`);

    // Create authentication token
    return this.createToken(user);
  }

  /**
   * Sign in procedure.
   *
   * @param username - User username
   * @param password - User password
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
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Read user
    const user: User | undefined = await userRepository.readOneForSignIn(username);

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

    return this.createToken(user);
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
   * Resend the verification codes to the user.
   *
   * @param userId - User id
   * @param manager - Transaction manager
   */
  @Transaction()
  public async resend(
    userId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Read user
    const user: User | undefined = await userRepository.readOneForResend(userId);

    // Check if user exists
    if (!user) throw new AuthorizationError();

    // Check if user is already verified
    if (user.verified)
      throw new VerificationError({ message: `User ${user.id} has been already verified` });

    // Send verification message
    await this.phoneAdapter.sendVerification(user.phone);
    logger.info(`Phone OTP resended for user ${userId}`);

    // Send verification email
    await this.emailAdapter.sendVerification(user.email, { user: { username: user.username } });
    logger.info(`Email OTP resended for user ${userId}`);
  }
}
