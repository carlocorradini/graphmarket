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
import { Recipe, User } from '@app/entities';
import { IContext } from '@app/types';
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
  @Authorized()
  createRecipe(@Arg('data') recipeInput: RecipeCreateInput, @Ctx() ctx: IContext): Promise<Recipe> {
    const recipe: Recipe = this.recipeRepository.create({
      ...recipeInput,
      author: this.userRepository.create({ id: ctx.user!.id }),
    });
    return this.recipeRepository.save(recipe);
  }

  @Mutation(() => Recipe)
  @Authorized()
  async updateRecipe(
    @Arg('data') recipeInput: RecipeUpdateInput,
    @Ctx() ctx: IContext,
  ): Promise<Recipe> {
    const recipe: Recipe = this.recipeRepository.create({
      ...recipeInput,
      author: this.userRepository.create({ id: ctx.user!.id }),
    });
    await this.recipeRepository.save(recipe);
    return this.recipeRepository.findOneOrFail(recipe.id);
  }

  // TODO cambia
  @Mutation(() => Recipe, { nullable: true })
  @Authorized()
  async deleteRecipe(
    @Arg('id', () => GraphQLPositiveInt) id: number,
    @Ctx() ctx: IContext,
  ): Promise<Recipe | undefined> {
    const recipe: Recipe | undefined = await this.recipeRepository.findOne(id);
    if (!recipe) return undefined;
    if (recipe.author_id !== ctx.user!.id) return undefined;
    await this.recipeRepository.delete(recipe.id);
    return recipe;
  }

  @FieldResolver()
  author(@Root() recipe: Recipe): Promise<User> {
    return this.userRepository.findOneOrFail(recipe.author_id);
  }
}
