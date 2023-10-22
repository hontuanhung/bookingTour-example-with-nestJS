import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/interface/user.interface';

// enum Role {
//   Admin = 'admin',
//   Guide = 'guide',
//   Lead_guide = 'lead-guide',
//   User = 'user',
// }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
