import 'environment';

import every from 'every.js';
import { Client as DiscordClient } from 'discord.js';

import TwitchAPI from 'twitch';
import notifyNewStreams from 'scheduled';

const client = new DiscordClient();
const checkInterval = Number(process.env.TWITCH_INTERVAL || '30');

client.on('ready', () => {
  console.log('Ret-2-go!');
});

every(`${checkInterval} seconds`, () => {
  notifyNewStreams(client)().catch(console.log);
});

client.login(process.env.DISCORD_BOT_TOKEN);
