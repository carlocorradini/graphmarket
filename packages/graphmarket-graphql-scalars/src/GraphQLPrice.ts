import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

/**
 * Number of digits after the decimal point.
 */
const FRACTION_DIGITS: number = 2;

/**
 * Return price (fracion digits) from value (in cents)
 *
 * @param value - Value to be processed
 * @returns Price processed from value
 */
function processValue(value: any) {
  if (
    value === null ||
    typeof value === 'undefined' ||
    Number.isNaN(value) ||
    value === Number.NaN
  ) {
    throw new TypeError(`Price is not a number: ${value}`);
  }

  const parsedValue: number = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue)) {
    throw new TypeError(`Price is not a finite number: ${parsedValue}`);
  }

  if (!Number.isInteger(parsedValue)) {
    throw new TypeError(`Price is not an integer: ${parsedValue}`);
  }

  if (!Number.isSafeInteger(parsedValue)) {
    throw new TypeError(`Price is not a safe integer: ${parsedValue}`);
  }

  if (parsedValue < 0) {
    throw new RangeError(`Price is lower than 0: ${parsedValue}`);
  }

  return (parsedValue / 100).toFixed(FRACTION_DIGITS);
}

/**
 * Price graphQL scalar.
 */
const GraphQLPrice = new GraphQLScalarType({
  name: 'Price',
  description:
    'A floating point number that represents the price of an object. The price has always two digits after the decimal point even if are 00',
  serialize(value: any) {
    return processValue(value);
  },
  parseValue(value: any) {
    return processValue(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.INT) {
      throw new GraphQLError(`Can only validate integers as price but got a: ${ast.kind}`);
    }

    return processValue(ast.value);
  },
});

export default GraphQLPrice;
