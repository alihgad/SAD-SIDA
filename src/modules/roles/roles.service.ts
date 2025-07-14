import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../../DB/models/role.model';
import { Permission, PermissionDocument } from '../../DB/models/permission.model';
import {
  CreateRoleInput,
  UpdateRoleInput,
  DeleteRoleInput,
  RoleResponse,
  DeleteResponse,
  RolesListResponse,
  CreatePermissionInput,
  UpdatePermissionInput,
  DeletePermissionInput,
  PermissionResponse,
  PermissionsListResponse
} from './roles.types';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  // Role CRUD Operations
  async createRole(input: CreateRoleInput): Promise<RoleResponse> {

    // Check if role name already exists
    const existingRole = await this.roleModel.findOne({ name: input.name });
    if (existingRole) {
      throw new BadRequestException('Role with this name already exists');
    }

    // Validate permissions if provided
    if (input.permissions && input.permissions.length > 0) {
      const validPermissions = await this.permissionModel.find({
        name: { $in: input.permissions }
      });
      
      if (validPermissions.length !== input.permissions.length) {
        throw new BadRequestException('Some permissions do not exist');
      }
    }

    const role = await this.roleModel.create(input);
    
    return {
      message: 'Role created successfully',
      role: role  
    };
  }

  async getAllRoles(): Promise<RolesListResponse> {
    const roles = await this.roleModel.find().sort({ createdAt: -1 });
    const total = await this.roleModel.countDocuments();
    
    return {
      roles: roles,
      total
    };
  }

  async getRoleById(_id: string): Promise<Role> {
    const role = await this.roleModel.findById(_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    return role;
  }

  async updateRole(input: UpdateRoleInput): Promise<RoleResponse> {
    const { _id, ...updateData } = input;
    
    // Check if role exists
    const existingRole = await this.roleModel.findById(_id);
    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }

    // Check if new name already exists (if name is being updated)
    if (updateData.name && updateData.name !== existingRole.name) {
      const roleWithSameName = await this.roleModel.findOne({ 
        name: updateData.name,
        _id: { $ne: _id }
      });
      if (roleWithSameName) {
        throw new BadRequestException('Role with this name already exists');
      }
    }

    // Validate permissions if provided
    if (updateData.permissions && updateData.permissions.length > 0) {
      const validPermissions = await this.permissionModel.find({
        name: { $in: updateData.permissions }
      });
      
      if (validPermissions.length !== updateData.permissions.length) {
        throw new BadRequestException('Some permissions do not exist');
      }
    }

    const updatedRole = await this.roleModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      throw new NotFoundException('Role not found');
    }

    return {
      message: 'Role updated successfully',
      role: updatedRole
    };
  }

  async deleteRole(input: DeleteRoleInput): Promise<DeleteResponse> {
    const { _id } = input;
    
    const role = await this.roleModel.findById(_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleModel.findByIdAndDelete(_id);
    
    return {
      message: 'Role deleted successfully',
      success: true
    };
  }

  // Permission CRUD Operations
  async createPermission(input: CreatePermissionInput): Promise<PermissionResponse> {
    // Check if permission name already exists
    const existingPermission = await this.permissionModel.findOne({ name: input.name });
    if (existingPermission) {
      throw new BadRequestException('Permission with this name already exists');
    }

    const permission = await this.permissionModel.create(input);
    
    return {
      message: 'Permission created successfully',
      permission: permission
    };
  }

  async getAllPermissions(): Promise<PermissionsListResponse> {
    const permissions = await this.permissionModel.find().sort({ createdAt: -1 });
    const total = await this.permissionModel.countDocuments();
    
    return {
      permissions: permissions,
      total
    };
  }

  async getPermissionById(_id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(_id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    
    return permission;
  }

  async updatePermission(input: UpdatePermissionInput): Promise<PermissionResponse> {
    const { _id, name } = input;
    
    // Check if permission exists
    const existingPermission = await this.permissionModel.findById(_id);
    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }

    // Check if new name already exists
    if (name !== existingPermission.name) {
      const permissionWithSameName = await this.permissionModel.findOne({ 
        name,
        _id: { $ne: _id }
      });
      if (permissionWithSameName) {
        throw new BadRequestException('Permission with this name already exists');
      }
    }

    const updatedPermission = await this.permissionModel.findByIdAndUpdate(
      _id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedPermission) {
      throw new NotFoundException('Permission not found');
    }

    return {
      message: 'Permission updated successfully',
      permission: updatedPermission
    };
  }

  async deletePermission(input: DeletePermissionInput): Promise<DeleteResponse> {
    const { _id } = input;
    
    const permission = await this.permissionModel.findById(_id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    // Check if permission is being used in any role
    const rolesUsingPermission = await this.roleModel.find({
      permissions: permission.name
    });
    
    if (rolesUsingPermission.length > 0) {
      throw new BadRequestException('Cannot delete permission that is being used by roles');
    }

    await this.permissionModel.findByIdAndDelete(_id);
    
    return {
      message: 'Permission deleted successfully',
      success: true
    };
  }
} 