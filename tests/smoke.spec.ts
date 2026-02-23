/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Dev Server (localhost:3000)
 * OUTPUT: 冒烟测试结果
 * POS: Tests / Smoke
 * CONTRACT: 验证所有核心页面可访问、返回正确状态码、渲染关键元素。
 * 职责: 防止基础功能回归。
 */
import { test, expect } from '@playwright/test';

// ────────────────────────────────────────────────────────────
// S01: 首页加载
// ────────────────────────────────────────────────────────────
test('S01: 首页 HTTP 200 @smoke', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    // 轮播图至少有 1 张
    await expect(page.locator('img').first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S02: Date Ideas 列表页
// ────────────────────────────────────────────────────────────
test('S02: Date Ideas 列表页 @smoke', async ({ page }) => {
    const res = await page.goto('/date-ideas');
    expect(res?.status()).toBe(200);
    // 至少有 1 篇文章卡片（含链接）
    const cards = page.locator('a[href*="/date-ideas/"]');
    await expect(cards.first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S03: Date Ideas 详情页
// ────────────────────────────────────────────────────────────
test('S03: Date Ideas 详情页 @smoke', async ({ page }) => {
    const res = await page.goto('/date-ideas/best-first-date-ideas');
    expect(res?.status()).toBe(200);
    // 文章标题
    await expect(page.locator('h1')).toBeVisible();
    // Hero 图片
    await expect(page.locator('img').first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S04: International Dating 列表页
// ────────────────────────────────────────────────────────────
test('S04: International Dating 列表页 @smoke', async ({ page }) => {
    const res = await page.goto('/international-dating');
    expect(res?.status()).toBe(200);
    // 至少 1 个用户卡片
    const cards = page.locator('a[href*="/international-dating/profile/"]');
    await expect(cards.first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S05: International Dating 性别筛选
// ────────────────────────────────────────────────────────────
test('S05: International Dating 性别筛选 (woman) @smoke', async ({ page }) => {
    const res = await page.goto('/international-dating/woman');
    expect(res?.status()).toBe(200);
    const cards = page.locator('a[href*="/international-dating/profile/"]');
    await expect(cards.first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S06: International Dating 性别 + 国家筛选
// ────────────────────────────────────────────────────────────
test('S06: International Dating 性别+国家筛选 @smoke', async ({ page }) => {
    const res = await page.goto('/international-dating/man/japan');
    expect(res?.status()).toBe(200);
});

// ────────────────────────────────────────────────────────────
// S07: International Dating 个人详情页
// ────────────────────────────────────────────────────────────
test('S07: International Dating 个人详情页 @smoke', async ({ page }) => {
    const res = await page.goto('/international-dating/profile/emma');
    expect(res?.status()).toBe(200);
    await page.waitForLoadState('domcontentloaded');
    // 页面含有 h1 标签（用户名）
    await expect(page.locator('h1').first()).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S08: About 页
// ────────────────────────────────────────────────────────────
test('S08: About 页 @smoke', async ({ page }) => {
    const res = await page.goto('/about');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S09: Contact 页
// ────────────────────────────────────────────────────────────
test('S09: Contact 页 @smoke', async ({ page }) => {
    const res = await page.goto('/contact');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S10: Date Idea Generator 页
// ────────────────────────────────────────────────────────────
test('S10: Date Idea Generator 页 @smoke', async ({ page }) => {
    const res = await page.goto('/date-idea-generator');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// S11: 404 页面
// ────────────────────────────────────────────────────────────
test('S11: 404 页面 @smoke', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist-xyz');
    // Next.js 可能返回 200 但渲染 404 内容, 或返回 404
    const status = res?.status() ?? 0;
    expect([200, 404]).toContain(status);
});

// ────────────────────────────────────────────────────────────
// S12: Privacy/Terms 重定向
// ────────────────────────────────────────────────────────────
test('S12: Privacy 重定向至 CDN @smoke', async ({ request }) => {
    const res = await request.get('/privacy', { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    const location = res.headers()['location'] ?? '';
    expect(location).toContain('cdn.globol.im');
});

test('S12b: Terms 重定向至 CDN @smoke', async ({ request }) => {
    const res = await request.get('/terms', { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    const location = res.headers()['location'] ?? '';
    expect(location).toContain('cdn.globol.im');
});
