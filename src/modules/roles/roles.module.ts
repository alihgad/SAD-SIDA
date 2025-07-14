import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/DB/models/role.model';
import { Permission, PermissionSchema, PermissionDocument } from 'src/DB/models/permission.model';
import { addPermissionsValidationHook } from 'src/DB/hooks/permissionsInROle';
import { Model } from 'mongoose';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: (permissionModel: Model<PermissionDocument>) => {
          // ✅ تفعيل الهوك هنا
          addPermissionsValidationHook(permissionModel);
          return RoleSchema;
        },
        inject: [getModelToken(Permission.name)],
      },
      {
        name: Permission.name,
        useFactory: () => PermissionSchema,
      },
    ]),
  ],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}
