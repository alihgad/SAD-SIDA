import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Permission } from 'src/DB/models/permission.model';
import { Role } from 'src/DB/models/role.model';

// Role Types
@ObjectType()
export class RoleType {
  @Field(() => String)
  _id!: string;

  @Field()
  name!: string;

  @Field(() => [String])
  permissions!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateRoleInput {
  @Field()
  name!: string;

  @Field(() => [String], { defaultValue: [] })
  permissions?: string[];
}

@InputType()
export class UpdateRoleInput {
  @Field()
  _id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];
}

@InputType()
export class DeleteRoleInput {
  @Field()
  _id!: string;
}

// Permission Types
@ObjectType()
export class PermissionType {
  @Field(() => String)
  _id!: string;

  @Field()
  name!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreatePermissionInput {
  @Field()
  name!: string;
}

@InputType()
export class UpdatePermissionInput {
  @Field()
  _id!: string;

  @Field()
  name!: string;
}

@InputType()
export class DeletePermissionInput {
  @Field()
  _id!: string;
}

// Response Types
@ObjectType()
export class RoleResponse {
  @Field()
  message!: string;

  @Field(() => Role)
  role!: Role;
}

@ObjectType()
export class PermissionResponse {
  @Field()
  message!: string;

  @Field(() => Permission)
  permission!: Permission;
}

@ObjectType()
export class DeleteResponse {
  @Field()
  message!: string;

  @Field()
  success!: boolean;
}

@ObjectType()
export class RolesListResponse {
  @Field(() => [Role])
  roles!: Role[];

  @Field(() => Int)
  total!: number;
}

@ObjectType()
export class PermissionsListResponse {
  @Field(() => [Permission])
  permissions!: Permission[];

  @Field(() => Int)
  total!: number;
} 