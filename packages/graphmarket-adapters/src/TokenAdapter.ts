/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import { IToken, ITokenPayload } from '@graphmarket/interfaces';
import { Service } from 'typedi';
import jwtBlacklist from 'express-jwt-blacklist';

/**
 * Token adapter.
 *
 * @see IToken
 */
@Service()
export default class TokenAdapter {
  /**
   * Initialize a new token adapter.
   *
   * @param purgeLifetime - Purge lifetime
   * @param redisUrl - Redis url
   */
  public init(redisUrl: string) {
    jwtBlacklist.configure({
      strict: false,
      store: {
        type: 'redis',
        url: redisUrl,
      },
    });
  }

  /**
   * Sign the given payload into a token string payload.
   *
   * @param payload - Payload to sign
   * @param secret - Secret to sign with
   * @param options - Sign options
   * @returns Token string payload
   */
  public async sign(
    payload: ITokenPayload,
    secret: string,
    options: Pick<jwt.SignOptions, 'expiresIn'>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        {
          expiresIn: options.expiresIn,
          subject: payload.id,
        },
        (error, token) => {
          if (error) reject(error);
          else resolve(token as string);
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
  public async verify(token: string, secret: string): Promise<IToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) reject(error);
        else resolve(decoded as IToken);
      });
    });
  }

  /**
   * Revoke the token.
   *
   * @param token - Token sub and iat to revoke
   * @returns True if revoked, false otherwise
   */
  public revoke(token: Pick<IToken, 'sub' | 'iat'>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwtBlacklist.revoke(token, (error, revoked) => {
        if (error && !revoked) reject(error);
        else resolve(revoked);
      });
    });
  }

  /**
   * Purge all tokens before token (inclusive).
   *
   * @param token - Token to purge
   * @returns True if purged, false otherwise
   */
  public purge(token: Pick<IToken, 'sub' | 'iat'>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwtBlacklist.purge(token, (error, purged) => {
        if (error && !purged) reject(error);
        else resolve(purged);
      });
    });
  }
}
