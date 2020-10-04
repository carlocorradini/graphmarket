import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsString, IsEmail, IsEnum, Length, IsEmpty, IsOptional, IsISO8601 } from 'class-validator';
import { CryptUtil } from '@app/util';

export enum UserValidationGroup {
  CREATION = 'creation',
  UPDATE = 'update',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserRole {
  ADMIN = 'admin',
  STANDARD = 'standard',
}

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @Index()
  @IsEmpty({ always: true })
  id!: string;

  @Column({ name: 'username', length: 128, unique: true, update: false })
  @IsString({ groups: [UserValidationGroup.CREATION] })
  @Length(1, 128, { groups: [UserValidationGroup.CREATION] })
  @IsEmpty({ groups: [UserValidationGroup.UPDATE] })
  username!: string;

  @Column({ name: 'password', length: 72, select: false })
  @IsString({
    groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE],
  })
  @Length(8, 64, {
    groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE],
  })
  @IsOptional({ groups: [UserValidationGroup.UPDATE] })
  password!: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.STANDARD,
  })
  @IsEnum(UserRole, { groups: [UserValidationGroup.UPDATE] })
  @IsEmpty({ groups: [UserValidationGroup.CREATION] })
  @IsOptional({ groups: [UserValidationGroup.UPDATE] })
  role!: UserRole;

  @Column({ name: 'name', type: 'varchar', length: 64, nullable: true, default: undefined })
  @IsString({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @Length(0, 64, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  name!: string;

  @Column({ name: 'surname', type: 'varchar', length: 64, nullable: true, default: undefined })
  @IsString({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @Length(0, 64, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  surname!: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: UserGender,
  })
  @IsEnum(UserGender, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  gender!: UserGender;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true, default: undefined })
  @IsISO8601(
    { strict: true },
    { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] }
  )
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  dateOfBirth!: Date;

  @Column({ name: 'email', length: 128, unique: true, select: false, update: false })
  @IsEmail(undefined, { groups: [UserValidationGroup.CREATION] })
  @Length(3, 128, { groups: [UserValidationGroup.CREATION] })
  @IsEmpty({ groups: [UserValidationGroup.UPDATE] })
  email!: string;

  @CreateDateColumn({ name: 'created_at', update: false })
  @IsEmpty({ always: true })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updatedAt!: Date;

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
