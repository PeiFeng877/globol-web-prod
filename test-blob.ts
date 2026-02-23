import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const testFile = path.resolve('public/favicon.ico');
  const fileBuffer = fs.readFileSync(testFile);
  
  const created = await payload.create({
    collection: 'media',
    data: { alt: 'test blob' },
    file: {
      data: fileBuffer,
      mimetype: 'image/x-icon',
      name: 'test-favicon.ico',
      size: fileBuffer.length
    }
  });

  console.log('Created Media URL:', created.url);
  
  await payload.delete({ collection: 'media', id: created.id });
  process.exit(0);
}
run();
