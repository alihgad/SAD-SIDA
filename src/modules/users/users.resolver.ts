import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { AuthMiddleware } from '../../common/middleware/authntication.middleware';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  SuperAdminUserType,
  CreateSuperAdminUserInput,
  loginInput,
  loginTypeResponse
} from './users.types';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => String)
  getHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => SuperAdminUserType)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async createUser(@Args('input') input: CreateSuperAdminUserInput): Promise<SuperAdminUserType> {
    return this.usersService.createUser(input);
  }

  @Mutation(() => loginTypeResponse)
  async login(@Args('input') input: loginInput): Promise<loginTypeResponse> {
    return this.usersService.login(input);
  }
}
