import jwt from 'jsonwebtoken';
import { Request } from 'express';
import config from '@app/config';
import { IJWTPayload } from '@app/types';
import { CacheService } from '@app/services';

export default class JWTHelper {
  public static getToken(req: Request): string | undefined {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }

    return undefined;
  }

  public static async sign(payload: IJWTPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.JWT.SECRET,
        {
          expiresIn: config.JWT.EXPIRATION_TIME,
        },
        (error, token) => {
          if (error) reject(error);
          resolve(token);
        },
      );
    });
  }

  public static async verify(token: string): Promise<IJWTPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT.SECRET, (error, decoded) => {
        if (error) reject(error);
        resolve(decoded as IJWTPayload);
      });
    });
  }

  public static async block(token: string): Promise<boolean> {
    return (await CacheService.getInstance().sadd(config.REDIS.JWT_BLOCKLIST, token)) === 1;
  }

  public static async isBlocked(token: string): Promise<boolean> {
    return (await CacheService.getInstance().sismember(config.REDIS.JWT_BLOCKLIST, token)) === 1;
  }
}
