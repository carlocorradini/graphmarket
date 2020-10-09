import { Repository } from 'typeorm';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User, { UserRoles } from '@app/entities/User';
import Product from '@app/entities/Product';
import { CryptUtil } from '@app/util';
import { JWTHelper } from '@app/helper';
import { IContext } from '@app/types';
import { GraphQLNonEmptyString, GraphQLUUID, GraphQLVoid } from '../scalars';
import { PaginationArgs } from '../args';
import { UserCreateInput, UserUpdateInput } from '../inputs';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  @Authorized()
  @Query(() => User)
  me(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.findOneOrFail(ctx.user!.id);
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  user(@Arg('id', () => GraphQLUUID) id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  @Query(() => [User])
  @Authorized()
  users(@Args() { skip, take }: PaginationArgs): Promise<User[]> {
    return this.userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  createUser(@Arg('data') data: UserCreateInput): Promise<User> {
    return this.userRepository.save(this.userRepository.create(data));
  }

  @Mutation(() => User)
  @Authorized(UserRoles.ADMIN)
  async updateUser(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data') data: UserUpdateInput,
  ): Promise<User> {
    const user: User = this.userRepository.create({ ...data, id });
    await this.userRepository.update(user.id, user);
    return this.userRepository.findOneOrFail(user.id);
  }

  @Mutation(() => User)
  @Authorized()
  async updateMe(@Arg('data') data: UserUpdateInput, @Ctx() ctx: IContext) {
    const user: User = this.userRepository.create({ ...data, id: ctx.user!.id });
    await this.userRepository.update(user.id, user);
    return this.userRepository.findOneOrFail(user.id);
  }

  @Mutation(() => User)
  @Authorized(UserRoles.ADMIN)
  async deleteUser(@Arg('id', () => GraphQLUUID) id: string): Promise<User> {
    const user: User = await this.userRepository.findOneOrFail(id);
    await this.userRepository.delete(user.id);
    return user;
  }

  // TODO migliorare error
  @Mutation(() => String)
  async signIn(
    @Arg('username', () => GraphQLNonEmptyString) username: string,
    @Arg('password', () => GraphQLNonEmptyString) password: string,
  ): Promise<string> {
    const user: User | undefined = await this.userRepository.findOne(
      { username },
      { select: ['id', 'password', 'roles'] },
    );
    if (!user) return '';
    if (!(await CryptUtil.compare(password, user.password!))) return '';
    return JWTHelper.sign({ id: user.id, roles: user.roles });
  }

  // TODO implementare
  @Mutation(() => GraphQLVoid)
  async signOut(): Promise<void> {
    // TODO delete
    this.userRepository.findOne('');
  }

  @FieldResolver()
  products(@Root() user: User): Promise<Product[]> {
    return this.productRepository.findByIds(user.products_ids);
  }
}
