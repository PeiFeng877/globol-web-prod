import { getPayload } from 'payload';
import configPromise from './src/payload.config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({ collection: 'articles', limit: 300 });
  const byLanguage = data.docs.reduce((acc: any, doc: any) => {
    acc[doc.language] = (acc[doc.language] || 0) + 1;
    return acc;
  }, {});
  console.log('Documents by language:', byLanguage);

  const sample = data.docs.find(d => d.slug === 'cheap-date-ideas' && d.language === 'en');
  console.log('Sample cheap-date-ideas:', sample ? { id: sample.id, title: sample.title, language: sample.language } : 'Not found');
}
run();
