import { getPayload } from 'payload';
import configPromise from './src/payload.config';
import 'dotenv/config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({ collection: 'articles', limit: 3 });
  console.log(JSON.stringify(data.docs.map(d => d.heroImage), null, 2));
}
run();
