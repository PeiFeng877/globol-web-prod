import { getPayload } from 'payload';
import configPromise from './src/payload.config';
import { getArticleBySlug } from './src/lib/content';

async function run() {
  const article = await getArticleBySlug('en', 'conversation-starters-for-couples');
  console.log(article.contentHtml);
}
run();
