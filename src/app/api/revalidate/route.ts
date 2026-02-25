/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: POST Request from Payload CMS with slug, language, and secret in query params.
 * OUTPUT: Revalidation success or failure response.
 * POS: Next.js API Route for Revalidation
 * CONTRACT: Handles On-Demand Revalidation based on exact Next.js cache tags.
 * 职责: 处理 CMS 触发的按需刷新缓存的请求。
 */
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    // 1. Verify the secret parameter
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 2. Parse the request body for specific tags
    const body = await request.json();
    const { slug, language } = body;

    // We can also accept an array of custom tags if passed
    const customTags = body.tags || [];

    // 3. Revalidate paths
    let tagsRevalidated: string[] = [];

    // Tag pattern for the list page
    if (language) {
      revalidateTag(`articles-${language}`);
      tagsRevalidated.push(`articles-${language}`);
    }

    // Tag pattern for the specific article details page
    if (slug && language) {
      revalidateTag(`article-${slug}-${language}`);
      tagsRevalidated.push(`article-${slug}-${language}`);
    }

    // Custom exact tags passed through
    if (customTags.length > 0) {
      customTags.forEach((tag: string) => {
        revalidateTag(tag);
        tagsRevalidated.push(tag);
      });
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), tags: tagsRevalidated });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 });
  }
}
