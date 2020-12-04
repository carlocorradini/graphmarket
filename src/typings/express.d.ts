import { IJWT } from '@app/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace Express {
    export interface Request {
      user?: IJWT;
    }
  }
}
