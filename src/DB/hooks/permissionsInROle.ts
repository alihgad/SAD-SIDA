import { Model } from 'mongoose';
import { RoleSchema } from '../models/role.model';
import { PermissionDocument } from '../models/permission.model';

export function addPermissionsValidationHook(permissionModel: Model<PermissionDocument>) {
  RoleSchema.pre('save', async function (next) {
    const role = this as any;
    if (!role.isModified('permissions')) return next();

    try {
      const permissionsInDb = await permissionModel.find({
        name: { $in: role.permissions as string[] }
      }).distinct('name');

      const invalidPermissions = role.permissions.filter((perm: string) => !permissionsInDb.includes(perm));
      if (invalidPermissions.length > 0) {
        return next(new Error(`The following permissions do not exist: ${invalidPermissions.join(', ')}`));
      }

      next();
    } catch (err) {
      next(err as Error);
    }
  });
}
