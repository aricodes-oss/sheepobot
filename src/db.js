import Datastore from 'nedb-promises';
import path from 'path';

export const collections = ['sequences', 'timestamps', 'commands'];
const basePath = '/db';
const db = {};

const initCollection = async collection => {
  if (db[collection]) {
    return db[collection];
  }

  db[collection] = Datastore.create(path.join(basePath, `${collection}.db`));
  db[collection].persistence.setAutocompactionInterval(1);
  await db[collection].load();

  return db[collection];
};

const initCollections = () => Promise.allSettled(collections.map(c => initCollection(c)));
initCollections();

export const getCollection = c => initCollection(c);

export const getNextSequence = async collName => {
  const sequences = await getCollection('sequences');

  await sequences.findOneAndUpdate(
    { _id: collName },
    { $set: { _id: collName }, $inc: { current: 1 } },
    { upsert: true },
  );

  const newDoc = await sequences.findOne({ _id: collName });

  return newDoc.current;
};

export const setLastTimestamp = async collName => {
  const timestamps = await getCollection('timestamps');

  await timestamps.findOneAndUpdate(
    { _id: collName },
    { $set: { _id: collName, last: Date.now() } },
    { upsert: true },
  );

  const newDoc = await timestamps.findOne({ _id: collName });

  return newDoc.last;
};

export const getLastTimestamp = async collName => {
  const timestamps = await getCollection('timestamps');

  const newDoc = (await timestamps.findOne({ _id: collName })) || { last: 0 };

  return newDoc.last;
};

export const findCommand = async name => {
  const commands = await getCollection('commands');

  const queryName = name.startsWith('!') ? name.slice(1).toLowerCase() : name.toLowerCase();

  return commands.findOne({ $or: [{ _id: queryName }, { aliases: queryName }] });
};

export default db;
