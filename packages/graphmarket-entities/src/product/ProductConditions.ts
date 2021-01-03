import { registerEnumType } from 'type-graphql';

/**
 * Product conditions.
 */
enum ProductConditions {
  NEW = 'NEW',
  RENEWED = 'RENEWED',
  USED_LIKE_NEW_OR_OPEN_BOX = 'USED_LIKE_NEW_OR_OPEN_BOX',
  USED_VERY_GOOD = 'USED_VERY_GOOD',
  USED_GOOD = 'USED_GOOD',
  USED_ACCEPTABLE = 'USED_ACCEPTABLE',
}

registerEnumType(ProductConditions, { name: 'ProductConditions' });

export default ProductConditions;
