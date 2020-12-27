/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import { IToken, ITokenPayload } from '@graphmarket/interfaces';
import { Service } from 'typedi';
import jwtBlacklist from 'express-jwt-blacklist';

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
   * @param lifetime - Purge lifetime
   * @returns True if purged, false otherwise
   */
  public purge(token: IToken, lifetime: number): Promise<boolean>;

  /**
   * Purge all tokens before token (inclusive) identified by token identifier.
   *
   * @param tokenId - Token identifier to purge
   * @param lifetime - Purge lifetime
   * @returns True if purged, false otherwise
   */
  public purge(tokenId: string, lifetime: number): Promise<boolean>;

  /**
   * Purge all tokens before token (inclusive).
   *
   * @param tokenOrTokenId - Token or token identifier to purge
   * @param lifetime - Purge lifetime
   * @returns True if purged, false otherwise
   */
  public purge(tokenOrTokenId: IToken | string, lifetime: number): Promise<boolean> {
    const token: Pick<IToken, 'sub'> =
      typeof tokenOrTokenId !== 'string' ? tokenOrTokenId : { sub: tokenOrTokenId };

    return new Promise((resolve, reject) => {
      jwtBlacklist.purge(token, lifetime, (error, purged) => {
        if (error && !purged) reject(error);
        else resolve(purged);
      });
    });
  }
}
