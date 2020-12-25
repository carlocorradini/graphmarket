import { IToken } from '@graphmarket/commons';

declare global {
  namespace Express {
    export interface Request {
      user?: IToken;
    }
  }
}
