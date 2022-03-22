import db, { collections } from 'db';
import path from 'path';
import fs from 'fs/promises';

(async () => {
  for (const collection of collections) {
    console.log(collection);
    const raw = await fs.readFile(path.join('/code/old-data', `${collection}.json`));
    const parsed = JSON.parse(raw);

    const coll = db[collection];

    for (const doc of parsed) {
      const res = await coll.insert(doc);
    }
  }
})();
