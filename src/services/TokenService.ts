/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
// TODO
// import blacklist from 'express-jwt-blacklist';
import config from '@app/config';
import logger from '@app/logger';
import { IToken, ITokenPayload } from '@app/types';
import { Service } from 'typedi';

/**
 * Token service.
 *
 * @see IToken
 */
@Service()
export default class TokenService {
  /**
   * Sign the given payload into a token string payload.
   *
   * @param payload - Payload to sign
   * @returns Token string payload
   */
  public async sign(payload: ITokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.TOKEN.SECRET,
        {
          expiresIn: config.TOKEN.EXPIRATION_TIME,
          subject: payload.id,
        },
        (error, token) => {
          if (error) reject(error);

          resolve(token as string);
        },
      );
    });
  }

  /**
   * Verify the given token.
   *
   * @param token - Token string to verify
   * @returns Decoded token
   */
  public async verify(token: string): Promise<IToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.TOKEN.SECRET, (error, decoded) => {
        if (error) reject(error);

        resolve(decoded as IToken);
      });
    });
  }

  /**
   * Revoke the token.
   *
   * @param token - Token to revoke
   * @returns True if revoked, false otherwise
   */
  public async revoke(token: IToken): Promise<boolean>;

  /**
   * Revoke the token identified by token identifier.
   *
   * @param tokenId - Token identifier
   * @returns True if revoked, false otherwise
   */
  public async revoke(tokenId: string): Promise<boolean>;

  /**
   * Revoke the token.
   *
   * @param tokenOrTokenId - Token or token identifier
   * @returns True if revoked, false otherwise
   */
  public async revoke(tokenOrTokenId: IToken | string): Promise<boolean> {
    // TODO
    /* const token: IJWT =
      typeof tokenOrTokenId !== 'string' ? tokenOrTokenId : ({ sub: tokenOrTokenId } as IJWT);

    return new Promise((resolve, reject) => {
      blacklist.revoke(token, config.JWT.EXPIRATION_TIME, (error, revoked) => {
        if (error && !revoked) reject(error);

        logger.info(`Token ${token.sub} issued at ${token.iat ? token.iat : '?'} has been revoked`);

        resolve(revoked);
      });
    }); */
    logger.info(typeof tokenOrTokenId === 'string');
    return true;
  }

  /**
   * Purge all tokens before token (inclusive).
   *
   * @param token - Token to purge
   * @returns True if purged, false otherwise
   */
  public async purge(token: IToken): Promise<boolean>;

  /**
   * Purge all tokens before token (inclusive) identified by token identifier.
   *
   * @param tokenId - Token identifier to purge
   * @returns True if purged, false otherwise
   */
  public async purge(tokenId: string): Promise<boolean>;

  /**
   * Purge all tokens before token (inclusive).
   *
   * @param tokenOrTokenId - Token or token identifier to purge
   * @returns True if purged, false otherwise
   */
  public async purge(tokenOrTokenId: IToken | string): Promise<boolean> {
    // TODO
    /* const token: IJWT =
      typeof tokenOrTokenId !== 'string' ? tokenOrTokenId : ({ sub: tokenOrTokenId } as IJWT);

    return new Promise((resolve, reject) => {
      blacklist.purge(token, config.JWT.EXPIRATION_TIME, (error, purged) => {
        if (error && !purged) reject(error);

        logger.info(`Token ${token.sub} issued at ${token.iat ? token.iat : '?'} has been purged`);

        resolve(purged);
      });
    }); */
    logger.info(typeof tokenOrTokenId === 'string');
    return true;
  }
}
