import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { AuthMiddleware } from '../../common/middleware/authntication.middleware';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  RoleType,
  CreateRoleInput,
  UpdateRoleInput,
  DeleteRoleInput,
  RoleResponse,
  DeleteResponse,
  RolesListResponse,
  PermissionType,
  CreatePermissionInput,
  UpdatePermissionInput,
  DeletePermissionInput,
  PermissionResponse,
  PermissionsListResponse
} from './roles.types';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  // Role Queries
  @Query(() => RolesListResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async getAllRoles(): Promise<RolesListResponse> {
    return this.rolesService.getAllRoles();
  }

  @Query(() => RoleType)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async getRoleById(@Args('_id') _id: string): Promise<RoleType> {
    return this.rolesService.getRoleById(_id);
  }

  // Role Mutations
  @Mutation(() => RoleResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async createRole(@Args('input') input: CreateRoleInput): Promise<RoleResponse> {
    return this.rolesService.createRole(input);
  }

  @Mutation(() => RoleResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async updateRole(@Args('input') input: UpdateRoleInput): Promise<RoleResponse> {
    return this.rolesService.updateRole(input);
  }

  @Mutation(() => DeleteResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async deleteRole(@Args('input') input: DeleteRoleInput): Promise<DeleteResponse> {
    return this.rolesService.deleteRole(input);
  }

  // Permission Queries
  @Query(() => PermissionsListResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async getAllPermissions(): Promise<PermissionsListResponse> {
    return this.rolesService.getAllPermissions();
  }

  @Query(() => PermissionType)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async getPermissionById(@Args('_id') _id: string): Promise<PermissionType> {
    return this.rolesService.getPermissionById(_id);
  }

  // Permission Mutations
  @Mutation(() => PermissionResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async createPermission(@Args('input') input: CreatePermissionInput): Promise<PermissionResponse> {
    return this.rolesService.createPermission(input);
  }

  @Mutation(() => PermissionResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async updatePermission(@Args('input') input: UpdatePermissionInput): Promise<PermissionResponse> {
    return this.rolesService.updatePermission(input);
  }

  @Mutation(() => DeleteResponse)
  @Roles('admin')
  @UseGuards(AuthMiddleware)
  @UseGuards(RolesGuard)
  async deletePermission(@Args('input') input: DeletePermissionInput): Promise<DeleteResponse> {
    return this.rolesService.deletePermission(input);
  }
} 