/* eslint-disable class-methods-use-this */
import {
  AbstractRepository,
  EntityManager,
  EntityRepository,
  FindManyOptions,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { ProductCreateInput, ProductUpdateInput } from '@app/graphql/inputs';
import { Product, User } from '@app/entities';
import { UnauthorizedError } from '@app/error';
import logger from '@app/logger';

@EntityRepository(Product)
export default class ProductRepository extends AbstractRepository<Product> {
  private createOwner(owner: User | string): User {
    return this.manager.create(User, {
      id: owner instanceof User ? owner.id : owner,
    });
  }

  @Transaction()
  public async createOrFail(
    data: ProductCreateInput,
    owner: User | string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const product: Product = await manager!.save(
      manager!.create(Product, {
        ...data,
        owner: this.createOwner(owner),
      }),
    );
    logger.info(`Created product having id ${product.id}`);

    return product;
  }

  public readOneOrFail(id: string): Promise<Product> {
    return this.manager.findOneOrFail(Product, id, { cache: true });
  }

  public readOrFail(options?: FindManyOptions): Promise<Product[]> {
    return this.manager.find(Product, { ...options, cache: true });
  }

  @Transaction()
  public async updateOrFail(
    id: number,
    data: ProductUpdateInput,
    owner: User | string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const ownerEntity = this.createOwner(owner);
    const product = await manager!.findOneOrFail(Product, id);

    if (product.ownerId !== ownerEntity.id) {
      logger.warn(`Update product ${id} failed due to unauthorized owner ${ownerEntity.id}`);
      throw new UnauthorizedError();
    }

    await manager!.update(Product, { id, owner: ownerEntity }, manager!.create(Product, data));
    logger.info(`Updated product having id ${id}`);

    return manager!.findOneOrFail(Product, id);
  }

  @Transaction()
  public async deleteOrFail(
    id: number,
    owner: User | string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const ownerEntity = this.createOwner(owner);
    const product: Product = await manager!.findOneOrFail(Product, { id });

    if (product.ownerId !== ownerEntity.id) {
      logger.warn(`Delete product ${id} failed due to unauthorized owner ${ownerEntity.id}`);
      throw new UnauthorizedError();
    }

    await manager!.delete(Product, { id, owner: ownerEntity });
    logger.info(`Deleted product having id ${id}`);

    return product;
  }
}
