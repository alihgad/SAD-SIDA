import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class SuperAdminUserType {
  @Field(() => Int)
  id?: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  role!: string;
}


@ObjectType()
export class loginTypeResponse {

  @Field()
  message!: string;

  @Field()
  token!: string;

}

@InputType()
export class CreateSuperAdminUserInput {

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  
}


@InputType()
export class loginInput {

  @Field()
  email!: string;

  @Field()
  password!: string;

}