import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

/**
 * Minimum rating (inclusive).
 */
const MIN_RATING: number = 1;
/**
 * Maximum rating (inclusive).
 */
const MAX_RATING: number = 5;

/**
 * Return rating from the processed value.
 *
 * @param value - Value to be processed
 * @returns Rating processed from value
 */
function processValue(value: any) {
  if (
    value === null ||
    typeof value === 'undefined' ||
    Number.isNaN(value) ||
    value === Number.NaN
  ) {
    throw new TypeError(`Rating is not a number: ${value}`);
  }

  const parsedValue: number = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue)) {
    throw new TypeError(`Rating is not a finite number: ${parsedValue}`);
  }

  if (!Number.isInteger(parsedValue)) {
    throw new TypeError(`Rating is not an integer: ${parsedValue}`);
  }

  if (!Number.isSafeInteger(parsedValue)) {
    throw new TypeError(`Rating is not a safe integer: ${parsedValue}`);
  }

  if (parsedValue < MIN_RATING) {
    throw new RangeError(`Rating is lower than ${MIN_RATING}: ${parsedValue}`);
  }

  if (parsedValue > MAX_RATING) {
    throw new RangeError(`Rating is higher than ${MAX_RATING}: ${parsedValue}`);
  }

  return parsedValue;
}

/**
 * Review rating graphQL scalar.
 */
const GraphQLReviewRating = new GraphQLScalarType({
  name: 'ReviewRating',
  description: `Rating of a product's review that will have a value from 1 (inclusive) to 5 (inclusive)`,
  serialize(value: any) {
    return processValue(value);
  },
  parseValue(value: any) {
    return processValue(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.INT) {
      throw new GraphQLError(`Can only validate integers as rating but got a: ${ast.kind}`);
    }

    return processValue(ast.value);
  },
});

export default GraphQLReviewRating;
