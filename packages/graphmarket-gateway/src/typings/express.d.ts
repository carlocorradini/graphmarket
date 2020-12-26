import { IToken } from '@graphmarket/interfaces';

declare global {
  namespace Express {
    export interface Request {
      user?: IToken;
    }
  }
}
