import { Repository } from 'typeorm';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from '@app/entities/User';
import UserInput, { UserValidationGroup } from '@app/graphql/inputs/UserInput';
import { PaginationArgs } from '@app/graphql/args';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  @Query(() => User)
  async user(@Arg('id') id: string): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  @Query(() => [User])
  async users(@Args() { skip, take }: PaginationArgs): Promise<User[]> {
    return await this.userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  async createUser(
    @Arg('user', { validate: { groups: [UserValidationGroup.CREATION] } }) userInput: UserInput
  ): Promise<User> {
    return await this.userRepository.save(this.userRepository.create(userInput));
  }
}
