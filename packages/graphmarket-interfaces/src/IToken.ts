import ITokenPayload from './ITokenPayload';

/**
 * Token full payload.
 */
export default interface IToken extends ITokenPayload {
  readonly iat: number;
  readonly exp: number;
  readonly sub: string;
}
