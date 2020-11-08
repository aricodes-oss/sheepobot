import { getCollection, findCommand } from 'db';
import { PermissionsLevel } from 'enums';

const editCommand = async ({ say, args }) => {
  if (args.length > 2) {
    await say('editcommand only takes 2 arguments');
    await say('Syntax: !editcommand <commandName> <output>');
    return;
  }

  const commands = await getCollection('commands');
  let [name] = args;
  const output = args[1];

  if (name.startsWith('!')) {
    name = name.slice(1);
  }

  const existing = await findCommand(name);

  if (!existing) {
    await say(`${name} was not found in the command list!`);
    return;
  }

  await commands.updateOne(existing, { $set: { output } });
  await say(`Successfully edited command ${name}`);
};

editCommand.command = 'editcommand';
editCommand.aliases = [
  'updatecommand',
  'changecommand',
  'edit',
  'editcmd',
  'cmdedit',
  'commandedit',
];
editCommand.permissionsLevel = PermissionsLevel.MOD;

export default editCommand;
