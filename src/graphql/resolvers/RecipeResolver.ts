import { Repository } from 'typeorm';
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Recipe, User } from '@app/entities';
import { GraphQLPositiveInt } from '../scalars';
import { PaginationArgs } from '../args';
import { RecipeCreateInput, RecipeUpdateInput } from '../inputs';

@Resolver(Recipe)
@Service()
export default class RecipeResolver {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => Recipe, { nullable: true })
  recipe(@Arg('id', () => GraphQLPositiveInt) id: number): Promise<Recipe | undefined> {
    return this.recipeRepository.findOne(id);
  }

  @Query(() => [Recipe])
  recipes(@Args() { skip, take }: PaginationArgs): Promise<Recipe[]> {
    return this.recipeRepository.find({ skip, take });
  }

  @Mutation(() => Recipe)
  createRecipe(@Arg('data') recipeInput: RecipeCreateInput): Promise<Recipe> {
    const recipe: Recipe = this.recipeRepository.create(recipeInput);
    // TODO Change
    recipe.id = 99;
    recipe.author = this.userRepository.create({ id: '12aad751-ec02-4c96-9441-1866a1c67f54' });

    return this.recipeRepository.save(recipe);
  }

  @Mutation(() => Recipe)
  async updateRecipe(@Arg('data') recipeInput: RecipeUpdateInput): Promise<Recipe> {
    const recipe: Recipe = this.recipeRepository.create(recipeInput);
    // TODO cambiare
    recipe.author = this.userRepository.create({ id: '12aad751-ec02-4c96-9441-1866a1c67f54' });
    await this.recipeRepository.save(recipe);
    return this.recipeRepository.findOneOrFail(recipe.id);
  }

  @Mutation(() => Recipe)
  async deleteRecipe(@Arg('id', () => GraphQLPositiveInt) id: number): Promise<Recipe> {
    const recipe: Recipe = await this.recipeRepository.findOneOrFail(id);
    await this.recipeRepository.delete(recipe.id);
    return recipe;
  }

  @FieldResolver()
  author(@Root() recipe: Recipe): Promise<User> {
    return this.userRepository.findOneOrFail(recipe.author_id);
  }
}
