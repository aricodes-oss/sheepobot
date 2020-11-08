import { PermissionsLevel } from 'enums';
import { MOD_ROLE_ID } from 'constants';

const getPermissionsLevel = message => {
  if (message.member.roles.cache.some(role => role.id === MOD_ROLE_ID)) {
    return PermissionsLevel.MOD;
  }

  return PermissionsLevel.USER;
};

export default getPermissionsLevel;
