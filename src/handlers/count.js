import { getCollection } from 'db';

const count = async ({ say }) => {
  const sequences = await getCollection('sequences');
  const doc = await sequences.findOne({ _id: 'sheepo' });

  say(`We have said Sheepo ${doc.current} times!`);
};

count.command = 'count';
count.aliases = ['sheepocount', 'totalsheepos', 'sheepos'];

export default count;
