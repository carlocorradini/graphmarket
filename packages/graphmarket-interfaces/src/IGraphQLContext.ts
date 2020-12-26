import IToken from './IToken';

/**
 * GraphQL context.
 */
export default interface IContext {
  readonly user?: IToken;
}
