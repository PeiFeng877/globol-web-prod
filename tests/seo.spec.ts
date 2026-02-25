/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Dev Server (localhost:3000)
 * OUTPUT: SEO 验证测试结果
 * POS: Tests / SEO
 * CONTRACT: 验证 meta 标签、canonical、hreflang、JSON-LD、sitemap 等 SEO 关键要素。
 * 职责: 防止 SEO 回归与结构化数据缺失。
 */
import { test, expect } from '@playwright/test';

// ────────────────────────────────────────────────────────────
// E01: 首页 <title>
// ────────────────────────────────────────────────────────────
test('E01: 首页 title 非空 @seo', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
    // 不应是 Next.js 默认标题
    expect(title).not.toContain('Create Next App');
});

// ────────────────────────────────────────────────────────────
// E02: 首页 meta description
// ────────────────────────────────────────────────────────────
test('E02: 首页 meta description @seo', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
});

// ────────────────────────────────────────────────────────────
// E03: 首页 canonical
// ────────────────────────────────────────────────────────────
test('E03: 首页 canonical 存在 @seo', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
});

// ────────────────────────────────────────────────────────────
// E04: 首页 hreflang 完整性
// ────────────────────────────────────────────────────────────
test('E04: 首页 hreflang 含 x-default 和 15 种语言 @seo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // head 内标签不可见，用 attached 而非默认的 visible
    await page.waitForSelector('link[rel="alternate"][hreflang]', { state: 'attached', timeout: 10_000 });
    const hreflangs = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangs.count();
    // 15 种语言 + x-default = 16
    expect(count).toBeGreaterThanOrEqual(16);

    // 验证 x-default 存在
    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
});

// ────────────────────────────────────────────────────────────
// E05: 首页 Open Graph
// ────────────────────────────────────────────────────────────
test('E05: 首页 Open Graph 标签完整 @seo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // head 内标签不可见，用 attached 而非默认的 visible
    await page.waitForSelector('meta[property="og:title"]', { state: 'attached', timeout: 10_000 });
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDesc).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
});

// ────────────────────────────────────────────────────────────
// E06: 文章详情 title 含文章关键词
// ────────────────────────────────────────────────────────────
test('E06: 文章详情 title 含文章标题 @seo', async ({ page }) => {
    await page.goto('/date-ideas/best-first-date-ideas');
    const title = await page.title();
    expect(title).toBeTruthy();
    // 标题应含有关键词（不是默认首页标题）
    expect(title.length).toBeGreaterThan(10);
});

// ────────────────────────────────────────────────────────────
// E07: 文章详情 canonical
// ────────────────────────────────────────────────────────────
test('E07: 文章详情 canonical 正确 @seo', async ({ page }) => {
    await page.goto('/date-ideas/best-first-date-ideas');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    // 应包含 date-ideas 路径
    expect(canonical).toContain('date-ideas/best-first-date-ideas');
    // 不含尾斜杠
    expect(canonical).not.toMatch(/\/$/);
});

// ────────────────────────────────────────────────────────────
// E08: 文章详情 JSON-LD
// ────────────────────────────────────────────────────────────
test('E08: 文章详情含 Article JSON-LD @seo', async ({ page }) => {
    await page.goto('/date-ideas/best-first-date-ideas');
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // 至少有一个包含 Article 类型
    let hasArticle = false;
    for (let i = 0; i < count; i++) {
        const text = await jsonLdScripts.nth(i).textContent();
        if (text?.includes('Article')) {
            hasArticle = true;
            break;
        }
    }
    expect(hasArticle).toBe(true);
});

// ────────────────────────────────────────────────────────────
// E09: Dating 页 JSON-LD (BreadcrumbList)
// ────────────────────────────────────────────────────────────
test('E09: Dating 页含 BreadcrumbList JSON-LD @seo', async ({ page }) => {
    await page.goto('/international-dating');
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    let hasBreadcrumb = false;
    for (let i = 0; i < count; i++) {
        const text = await jsonLdScripts.nth(i).textContent();
        if (text?.includes('BreadcrumbList')) {
            hasBreadcrumb = true;
            break;
        }
    }
    expect(hasBreadcrumb).toBe(true);
});

// ────────────────────────────────────────────────────────────
// E10: Sitemap 可访问
// ────────────────────────────────────────────────────────────
test('E10: sitemap.xml 返回 200 @seo', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<urlset');
});

// ────────────────────────────────────────────────────────────
// E11: Sitemap URL 唯一性
// ────────────────────────────────────────────────────────────
test('E11: sitemap.xml 无重复 URL @seo', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    const body = await res.text();

    // 提取所有 <loc> 标签内容
    const locRegex = /<loc>(.*?)<\/loc>/g;
    const urls: string[] = [];
    let match;
    while ((match = locRegex.exec(body)) !== null) {
        urls.push(match[1]);
    }

    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
});

// ────────────────────────────────────────────────────────────
// E12: 无尾斜杠
// ────────────────────────────────────────────────────────────
test('E12: canonical 和 sitemap URL 无尾斜杠 @seo', async ({ page, request }) => {
    // 检查首页 canonical
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (canonical && canonical !== '/') {
        expect(canonical).not.toMatch(/\/$/);
    }

    // 检查 sitemap 中的 URL
    const res = await request.get('/sitemap.xml');
    const body = await res.text();
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(body)) !== null) {
        const url = match[1];
        // 根路径本身 "https://xxx.com" 没有尾斜杠是正确的
        const path = new URL(url).pathname;
        if (path !== '/') {
            expect(url).not.toMatch(/\/$/);
        }
    }
});

// ────────────────────────────────────────────────────────────
// E13: 文章详情只有 1 个 <h1>
// ────────────────────────────────────────────────────────────
test('E13: 文章详情只有 1 个 h1 @seo', async ({ page }) => {
    await page.goto('/date-ideas/best-first-date-ideas');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
});

// ────────────────────────────────────────────────────────────
// E14: 图片 alt 属性
// ────────────────────────────────────────────────────────────
test('E14: 文章列表图片有 alt 属性 @seo', async ({ page }) => {
    await page.goto('/date-ideas');
    const images = page.locator('a[href*="/date-ideas/"] img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
        const alt = await images.nth(i).getAttribute('alt');
        // alt 应存在（可以为空字符串用于装饰性图片, 但不应为 null）
        expect(alt).not.toBeNull();
    }
});
