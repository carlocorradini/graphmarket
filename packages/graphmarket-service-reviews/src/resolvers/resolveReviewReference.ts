import { Container } from 'typedi';
import { Review } from '@graphmarket/entities';
import { ReviewService } from '@app/services';

/**
 * Review service instance.
 *
 * @see ReviewService
 */
const reviewService: ReviewService = Container.get(ReviewService);

/**
 * Resolve review reference.
 *
 * @param reference - Review reference identifier
 * @returns Review that match the reference identifier, undefined otherwise
 */
export default function resolveReviewReference(
  reference: Pick<Review, 'id'>,
): Promise<Review | undefined> {
  return reviewService.readOneById(reference.id);
}
