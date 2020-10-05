import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { CryptUtil } from '@app/util';
// eslint-disable-next-line import/no-cycle
import Recipe from './Recipe';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

registerEnumType(UserGender, { name: 'UserGender' });
registerEnumType(UserRole, { name: 'UserRole' });

@Entity('user')
@ObjectType()
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @Index()
  @Field(() => ID)
  id!: string;

  @Column({ name: 'username', length: 128, unique: true, update: false })
  @Field()
  username!: string;

  @Column({ name: 'password', length: 72, select: false })
  password?: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.STANDARD })
  @Field(() => UserRole)
  role!: UserRole;

  @Column({ name: 'name', type: 'varchar', length: 64, nullable: true, default: undefined })
  @Field({ nullable: true })
  name?: string;

  @Column({ name: 'surname', type: 'varchar', length: 64, nullable: true, default: undefined })
  @Field({ nullable: true })
  surname?: string;

  @Column({ name: 'gender', type: 'enum', enum: UserGender })
  @Field(() => UserGender)
  gender!: UserGender;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true, default: undefined })
  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'email', length: 128, unique: true, select: false, update: false })
  @Field()
  email!: string;

  @CreateDateColumn({ name: 'created_at', update: false })
  @Field()
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt!: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.author, { nullable: false })
  @Field(() => [Recipe])
  recipes!: Recipe[];

  @RelationId((user: User) => user.recipes)
  recipesIds!: number[];

  @BeforeInsert()
  async beforeInsert() {
    if (this.name) this.name = this.name.replace(/^\w/, (c) => c.toUpperCase());
    if (this.surname) this.surname = this.surname.replace(/^\w/, (c) => c.toUpperCase());
    if (this.password) this.password = await CryptUtil.hash(this.password);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (this.name) this.name = this.name.replace(/^\w/, (c) => c.toUpperCase());
    if (this.surname) this.surname = this.surname.replace(/^\w/, (c) => c.toUpperCase());
    if (this.password) this.password = await CryptUtil.hash(this.password);
  }
}
