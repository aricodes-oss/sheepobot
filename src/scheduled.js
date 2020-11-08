import { MessageEmbed } from 'discord.js';

import { getCollection } from 'db';
import TwitchAPI from 'twitch';

import { NEWS_CHANNEL_ID, EMBED_COLOR } from 'constants';

const notifyStreams = client => async () => {
  if (process.env.DEBUG) {
    return;
  }

  const streams = await getCollection('streams');
  const twitchResponse = await TwitchAPI.getStreams();
  const currentlyLiveStreams = twitchResponse.data.data;

  const liveStreamNames = currentlyLiveStreams.map(s => s.user_name);

  const knownStreams = await streams.find({}).toArray();
  const knownStreamNames = knownStreams.map(s => s.userName);

  // Get the union data
  const notifyAbout = currentlyLiveStreams.filter(
    stream => !knownStreamNames.includes(stream.user_name),
  );

  // Get the inverse of that union
  const deleteStreams = knownStreams.filter(stream => !liveStreamNames.includes(stream.userName));

  const newsChannel = await await client.channels.fetch(NEWS_CHANNEL_ID);

  try {
    for (const stream of deleteStreams) {
      const message = await newsChannel.messages.fetch(stream.messageId, false);
      message.delete();
      await streams.deleteMany(stream);
    }
  } catch (err) {
    console.log('Error deleting messages');
    console.log(err);
  }

  for (const stream of notifyAbout) {
    try {
      const message = await newsChannel.send(
        new MessageEmbed()
          .setColor(EMBED_COLOR)
          .setTitle(stream.user_name)
          .setURL(`https://twitch.tv/${stream.user_name}`)
          .setThumbnail(stream.thumbnail_url.replace('{width}', '72').replace('{height}', '72'))
          .setDescription(stream.title)
          .setTimestamp(),
      );
      await streams.insertOne({ userName: stream.user_name, messageId: message.id });
    } catch (err) {
      console.log(`Error notifying about ${stream.user_name}`);
      console.log(err);
    }
  }
};

export default notifyStreams;
