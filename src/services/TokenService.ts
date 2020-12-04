/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
// TODO
// import blacklist from 'express-jwt-blacklist';
import config from '@app/config';
import logger from '@app/logger';
import { IJWT, IJWTPayload } from '@app/types';
import { Service } from 'typedi';

/**
 * Token service.
 *
 * @see IJWT
 */
@Service()
export default class TokenService {
  /**
   * Sign the given payload into a JSON Web Token string payload.
   *
   * @param payload - Payload to sign
   * @returns JSON Web Token string payload
   */
  public async sign(payload: IJWTPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.JWT.SECRET,
        {
          expiresIn: config.JWT.EXPIRATION_TIME,
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
   * @param token - JSON Web Token string to verify
   * @returns Decoded token
   */
  public async verify(token: string): Promise<IJWT> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT.SECRET, (error, decoded) => {
        if (error) reject(error);

        resolve(decoded as IJWT);
      });
    });
  }

  /**
   * Revoke the token.
   *
   * @param token - Token to revoke
   * @returns True if revoked, false otherwise
   */
  public async revoke(token: IJWT): Promise<boolean>;

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
  public async revoke(tokenOrTokenId: IJWT | string): Promise<boolean> {
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
  public async purge(token: IJWT): Promise<boolean>;

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
  public async purge(tokenOrTokenId: IJWT | string): Promise<boolean> {
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
