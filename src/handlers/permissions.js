import { getCollection, findCommand } from 'db';
import { PermissionsLevel } from 'enums';

const setPermissions = async ({ args, say }) => {
  if (args.length !== 2) {
    await say('This command only takes 2 arguments');
    return;
  }

  const [name, level] = args;

  const commands = await getCollection('commands');
  const existing = await findCommand(name);

  if (Number.isNaN(level) || Number(level) > PermissionsLevel.STREAMER || Number(level) < 0) {
    await say('Invalid choice!');
  }

  await commands.updateOne({ _id: existing._id }, { $set: { permissionsLevel: Number(level) } });
  await say('Updated permissions level!');
};

setPermissions.command = 'setpermissions';
setPermissions.aliases = [
  'setperms',
  'setperm',
  'addperm',
  'addperms',
  'addpermissions',
  'modifypermissions',
  'modifyperms',
];
setPermissions.permissionsLevel = PermissionsLevel.MOD;

export default setPermissions;
