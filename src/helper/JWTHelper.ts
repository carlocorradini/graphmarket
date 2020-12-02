import jwt from 'jsonwebtoken';
import config from '@app/config';
import { IJWT, IJWTPayload } from '@app/types';

/**
 * JSON Web Token helper.
 */
export default class JWTHelper {
  /**
   * Sign the given payload into a JSON Web Token string payload.
   *
   * @param payload - Payload to sign
   * @returns JSON Web Token string payload
   */
  public static async sign(payload: IJWTPayload): Promise<string> {
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
  public static async verify(token: string): Promise<IJWT> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT.SECRET, (error, decoded) => {
        if (error) reject(error);

        resolve(decoded as IJWT);
      });
    });
  }
}
