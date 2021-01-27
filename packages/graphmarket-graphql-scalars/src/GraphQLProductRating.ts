import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

/**
 * Minimum rating (inclusive).
 */
const MIN_RATING: number = 0;
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

  const parsedValue: number = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    throw new TypeError(`Rating is not a finite number: ${parsedValue}`);
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
 * Product rating graphQL scalar.
 */
const GraphQLProductRating = new GraphQLScalarType({
  name: 'ProductRating',
  description: `Average rating of a product that will have a value from 0 (inclusive) to 5 (inclusive)`,
  serialize(value: any) {
    return processValue(value);
  },
  parseValue(value: any) {
    return processValue(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
      throw new GraphQLError(
        `Can only validate floating point numbers as rating but got a: ${ast.kind}`,
      );
    }

    return processValue(ast.value);
  },
});

export default GraphQLProductRating;
