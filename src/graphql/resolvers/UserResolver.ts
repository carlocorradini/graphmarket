import { Repository } from 'typeorm';
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, Recipe } from '@app/entities';
import UserInput, { UserValidationGroup } from '@app/graphql/inputs/UserInput';
import { PaginationArgs } from '@app/graphql/args';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>
  ) {}

  @Query(() => User, { nullable: true })
  user(@Arg('id') id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  @Query(() => [User])
  users(@Args() { skip, take }: PaginationArgs): Promise<User[]> {
    return this.userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  createUser(
    @Arg('user', { validate: { groups: [UserValidationGroup.CREATION] } }) userInput: UserInput
  ): Promise<User> {
    return this.userRepository.save(this.userRepository.create(userInput));
  }

  @FieldResolver()
  recipes(@Root() user: User): Promise<Recipe[]> {
    return this.recipeRepository.findByIds(user.recipesIds);
  }
}
