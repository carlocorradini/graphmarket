import { Repository } from 'typeorm';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from '@app/entities/User';
import UserInput, { UserValidationGroup } from './UserInput';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  @Query(() => User)
  async user(@Arg('id') id: string): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Mutation(() => User)
  async createUser(
    @Arg('user', { validate: { groups: [UserValidationGroup.CREATION] } }) userInput: UserInput
  ): Promise<User> {
    const user = this.userRepository.create(userInput);
    return await this.userRepository.save(user);
  }
}
