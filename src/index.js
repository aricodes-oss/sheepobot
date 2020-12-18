import 'environment';

import every from 'every.js';
import { Client as DiscordClient } from 'discord.js';
import whisparse from 'whisparse';

import notifyNewStreams from 'scheduled';
import { getCollection, getNextSequence } from 'db';
import { wrapHandlerFunc, getPermissionsLevel } from 'utils';

import handlers from 'handlers';

const client = new DiscordClient();
const checkInterval = Number(process.env.TWITCH_INTERVAL || '30');

client.on('ready', () => {
  console.log('Ret-2-go!');
});

const countSheepo = async message => {
  if (message.content.toLowerCase().includes('sheepo')) {
    const count = await getNextSequence('sheepo');
    const prelude = `We have now said Sheepo ${count} times!`;

    if (count === 420) {
      message.channel.send(`${prelude} *Nice.*`);
    }

    if (count % 100 === 0) {
      message.channel.send(prelude);
    }
  }
};

client.on('message', async message => {
  if (message.author.bot) {
    return;
  }

  const parsed = whisparse(message.content);

  await countSheepo(message);

  if (!parsed) {
    return;
  }

  const commands = await getCollection('commands');
  let dbCommands = await commands.find({}).toArray();

  dbCommands = dbCommands.map(d => {
    const result = ({ say }) => say(d.output);
    Object.assign(result, d, { command: d._id });
    return wrapHandlerFunc(result);
  });

  // eslint-disable-next-line no-param-reassign
  message.permissionsLevel = getPermissionsLevel(message);

  for (const handler of handlers.concat(dbCommands)) {
    handler({
      ...parsed,
      message,
      // This should be unnecessary, but discord.js is a truly terrible library
      say: msg => message.channel.send(msg),
      reply: msg => message.reply(msg),
    });
  }
});

every(`${checkInterval} seconds`, () => {
  notifyNewStreams(client)().catch(console.log);
});

client.login(process.env.DISCORD_BOT_TOKEN);
