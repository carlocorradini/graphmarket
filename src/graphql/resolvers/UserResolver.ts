import { Repository } from 'typeorm';
import {
  Arg,
  Args,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User, { UserRoles } from '@app/entities/User';
import Recipe from '@app/entities/Recipe';
import { CryptUtil } from '@app/util';
import { JWTHelper } from '@app/helper';
import { GraphQLNonEmptyString, GraphQLUUID, GraphQLVoid } from '../scalars';
import { PaginationArgs } from '../args';
import { UserCreateInput, UserUpdateInput } from '../inputs';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
  ) {}

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
  createUser(@Arg('data') userInput: UserCreateInput): Promise<User> {
    return this.userRepository.save(this.userRepository.create(userInput));
  }

  @Mutation(() => User)
  @Authorized(UserRoles.ADMIN)
  async updateUser(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data') userInput: UserUpdateInput,
  ): Promise<User> {
    const user: User = this.userRepository.create({ ...userInput, id });
    await this.userRepository.save(user);
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
  recipes(@Root() user: User): Promise<Recipe[]> {
    return this.recipeRepository.findByIds(user.recipes_ids);
  }
}
