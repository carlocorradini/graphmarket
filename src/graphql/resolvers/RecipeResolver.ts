import { Repository } from 'typeorm';
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Recipe, User } from '@app/entities';
import { PaginationArgs } from '@app/graphql/args';
import RecipeInput, { RecipeValidationGroup } from '@app/graphql/inputs/RecipeInput';

@Resolver(Recipe)
@Service()
export default class RecipeResolver {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => Recipe, { nullable: true })
  recipe(@Arg('id') id: number): Promise<Recipe | undefined> {
    return this.recipeRepository.findOne(id);
  }

  @Query(() => [Recipe])
  recipes(@Args() { skip, take }: PaginationArgs): Promise<Recipe[]> {
    return this.recipeRepository.find({ skip, take });
  }

  @Mutation(() => Recipe)
  createRecipe(
    @Arg('recipe', { validate: { groups: [RecipeValidationGroup.CREATION] } })
    recipeInput: RecipeInput
  ): Promise<Recipe> {
    // TODO Change this
    return this.recipeRepository.save(
      this.recipeRepository.create({
        ...recipeInput,
        authorId: 'be721e75-e7c1-4c8a-bc79-a308768c77e0',
      })
    );
  }

  @FieldResolver()
  author(@Root() recipe: Recipe): Promise<User> {
    return this.userRepository.findOneOrFail(recipe.authorId);
  }
}
