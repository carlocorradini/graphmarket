import { Repository } from 'typeorm';
import { Arg, Args, Query, Resolver } from 'type-graphql';
import { User } from '@app/entities';

@Resolver(User)
export default class UserResolver {
  constructor(private readonly userRepository: Repository<User>) {}

  @Query(() => User)
  async user(@Arg('id') id: string) {
    const user = await this.userRepository.findOne(id);
    if (user === undefined) throw new Error('');
    return user;
  }
}
