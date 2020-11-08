import { getCollection, findCommand } from 'db';
import { PermissionsLevel } from 'enums';

const addAlias = async ({ say, args }) => {
  if (args.length < 2) {
    await say('Syntax: !addalias <commandName> <alias1> [alias2 [alias3 [alias4]]]');
    return;
  }

  const commands = await getCollection('commands');
  let [name] = args;
  const aliases = args.slice(1);

  if (name.startsWith('!')) {
    name = name.slice(1);
  }

  const existing = await findCommand(name);

  if (!existing) {
    await say('No matching command found!');
    return;
  }

  await commands.updateOne(
    { _id: existing._id },
    { $addToSet: { aliases: { $each: aliases.map(a => a.toLowerCase()) } } },
  );

  const term = aliases.length > 1 ? 'aliases' : 'alias';
  const addedNames = aliases.map(a => a.toLowerCase()).join(', ');
  await say(`Successfully added ${term} ${addedNames} to ${existing._id}`);
};

addAlias.command = 'addalias';
addAlias.aliases = ['newalias', 'alias'];
addAlias.permissionsLevel = PermissionsLevel.MOD;

export default addAlias;
