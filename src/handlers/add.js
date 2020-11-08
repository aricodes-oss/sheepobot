import { getCollection, findCommand } from 'db';
import { PermissionsLevel } from 'enums';

const addCommand = async ({ say, args }) => {
  if (args.length > 2) {
    await say('addcommand only takes 2 arguments');
    await say('Syntax: !addcommand <commandName> <output>');
    return;
  }

  const commands = await getCollection('commands');
  let [name] = args;
  const output = args[1];

  if (name.startsWith('!')) {
    name = name.slice(1);
  }

  const existing = await findCommand(name);

  if (existing) {
    await say(`${existing._id} already exists`);
    return;
  }

  await commands.insertOne({
    _id: name,
    output,
    aliases: [],
    permissionsLevel: PermissionsLevel.USER,
  });
  await say(`Successfully added command ${name}`);
};

addCommand.command = 'addcommand';
addCommand.aliases = ['newcommand'];
addCommand.permissionsLevel = PermissionsLevel.MOD;

export default addCommand;