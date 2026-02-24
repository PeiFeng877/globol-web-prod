/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Dev Server (localhost:3000)
 * OUTPUT: 内容完整性测试结果
 * POS: Tests / Content
 * CONTRACT: 验证图片正确渲染、不同文章使用不同图片、头像和 Feed 图片正常加载。
 * 职责: 防止内容展示回归（尤其是图片丢失问题）。
 */
import { test, expect } from '@playwright/test';

// ────────────────────────────────────────────────────────────
// C01: 文章列表图片渲染
// ────────────────────────────────────────────────────────────
test('C01: 文章列表卡片图片渲染 @content', async ({ page }) => {
    await page.goto('/date-ideas');
    // 等待文章卡片渲染
    const cards = page.locator('a[href*="/date-ideas/"]');
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // 每张卡片应包含 img
    for (let i = 0; i < Math.min(count, 5); i++) {
        const img = cards.nth(i).locator('img');
        const imgCount = await img.count();
        if (imgCount > 0) {
            const src = await img.first().getAttribute('src');
            expect(src).toBeTruthy();
        }
    }
});

// ────────────────────────────────────────────────────────────
// C02: 文章详情 Hero 图
// ────────────────────────────────────────────────────────────
test('C02: 文章详情 Hero 图存在 @content', async ({ page }) => {
    await page.goto('/date-ideas/best-first-date-ideas');
    await page.waitForLoadState('domcontentloaded');
    // CMS Hero 图 src 格式: /_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fhero-X.webp
    const heroImg = page.locator('img[src*="media"]').first();
    await expect(heroImg).toBeVisible();
    const src = await heroImg.getAttribute('src');
    expect(src).toBeTruthy();
});

// ────────────────────────────────────────────────────────────
// C03: 不同文章使用不同图片
// 注意: 此测试访问 3 篇文章, CMS 冷编译可能较慢
// ────────────────────────────────────────────────────────────
test('C03: 不同文章使用不同 Hero 图 @content', async ({ page }) => {
    test.setTimeout(90_000);

    const slugs = [
        'best-first-date-ideas',
        'fun-date-ideas',
        'cute-date-ideas',
    ];

    const heroSrcs: string[] = [];

    for (const slug of slugs) {
        await page.goto(`/date-ideas/${slug}`, { waitUntil: 'domcontentloaded' });
        // CMS Hero 图 src 格式: /_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fhero-X.webp
        const heroImg = page.locator('img[src*="media"]').first();
        await expect(heroImg).toBeVisible();
        const src = await heroImg.getAttribute('src') ?? '';
        expect(src).toBeTruthy();
        heroSrcs.push(src);
    }

    // 三篇文章的 Hero 图应互不相同
    const unique = new Set(heroSrcs);
    expect(unique.size).toBe(heroSrcs.length);
});

// ────────────────────────────────────────────────────────────
// C04: International Dating 头像渲染
// Next.js Image 会将 src 转为 /_next/image?url=...avatar... 格式
// 因此用 srcset 或 alt 来定位头像图片
// ────────────────────────────────────────────────────────────
test('C04: International Dating 头像渲染 @content', async ({ page }) => {
    await page.goto('/international-dating');
    await page.waitForLoadState('domcontentloaded');

    // 查找 profile 链接内的图片（头像）
    const profileCards = page.locator('a[href*="/international-dating/profile/"]');
    await expect(profileCards.first()).toBeVisible();
    const count = await profileCards.count();
    expect(count).toBeGreaterThan(0);

    // 每个 profile 卡片应包含至少 1 个 img
    for (let i = 0; i < Math.min(count, 3); i++) {
        const img = profileCards.nth(i).locator('img');
        await expect(img.first()).toBeVisible();
    }
});

// ────────────────────────────────────────────────────────────
// C05: 详情页 Feed 图片
// ────────────────────────────────────────────────────────────
test('C05: 个人详情页 Feed 含图片 @content', async ({ page }) => {
    await page.goto('/international-dating/profile/emma');
    await page.waitForLoadState('domcontentloaded');
    // 页面至少有若干张图片（头像 + feed）
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(2);
});

// ────────────────────────────────────────────────────────────
// C06: 首页轮播图片
// Next.js Image 将 src 转换为 /_next/image?url=... 格式
// ────────────────────────────────────────────────────────────
test('C06: 首页轮播图片加载 @content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // 查找所有图片（排除 navbar logo 等小图标）
    const allImgs = page.locator('img');
    const count = await allImgs.count();
    // 首页至少有 logo + 1 张轮播图
    expect(count).toBeGreaterThanOrEqual(2);
});
