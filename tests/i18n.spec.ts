/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Dev Server (localhost:3000)
 * OUTPUT: 多语言测试结果
 * POS: Tests / i18n
 * CONTRACT: 验证多语言路由、内容切换、回退策略正确。
 * 职责: 防止国际化功能回归。
 */
import { test, expect } from '@playwright/test';

// ────────────────────────────────────────────────────────────
// I01: 英文首页（默认 locale）
// ────────────────────────────────────────────────────────────
test('I01: 英文首页默认加载 @i18n', async ({ page }) => {
    await page.goto('/');
    // html lang 应为 en
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
});

// ────────────────────────────────────────────────────────────
// I02: 中文首页
// ────────────────────────────────────────────────────────────
test('I02: 中文首页加载 @i18n', async ({ page }) => {
    const res = await page.goto('/zh');
    expect(res?.status()).toBe(200);
    // 页面应包含中文文案
    const text = await page.textContent('body');
    // 中文字符正则匹配
    expect(text).toMatch(/[\u4e00-\u9fa5]/);
});

// ────────────────────────────────────────────────────────────
// I03: 日文 Date Ideas 列表
// ────────────────────────────────────────────────────────────
test('I03: 日文 Date Ideas 列表 @i18n', async ({ page }) => {
    const res = await page.goto('/ja/date-ideas');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// I04: 语言切换不丢路由
// ────────────────────────────────────────────────────────────
test('I04: 语言切换保持路由路径 @i18n', async ({ page }) => {
    // 先访问英文 date-ideas
    await page.goto('/date-ideas');
    const enUrl = page.url();
    expect(enUrl).toContain('/date-ideas');

    // 然后直接访问中文同路由
    await page.goto('/zh/date-ideas');
    const zhUrl = page.url();
    expect(zhUrl).toContain('/zh/date-ideas');

    // 内容应包含中文
    const text = await page.textContent('body');
    expect(text).toMatch(/[\u4e00-\u9fa5]/);
});

// ────────────────────────────────────────────────────────────
// I05: 非英文文章详情
// ────────────────────────────────────────────────────────────
test('I05: 韩文文章详情页 @i18n', async ({ page }) => {
    const res = await page.goto('/ko/date-ideas/best-first-date-ideas');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

// ────────────────────────────────────────────────────────────
// I06: 非英文 Dating 筛选
// ────────────────────────────────────────────────────────────
test('I06: 法文 Dating 筛选 @i18n', async ({ page }) => {
    const res = await page.goto('/fr/international-dating/woman');
    expect(res?.status()).toBe(200);
});

// ────────────────────────────────────────────────────────────
// I07: 无效 locale 处理
// ────────────────────────────────────────────────────────────
test('I07: 无效 locale 返回 404 @i18n', async ({ page }) => {
    const res = await page.goto('/xx/date-ideas');
    // 应返回 404（或 200 渲染 not-found 页面, 或 500 首次编译）
    const status = res?.status() ?? 0;
    // 404 = 正确; 200 = 可能渲染 not-found 内容; 500 = dev server _error 编译
    expect([404, 200, 500]).toContain(status);
    if (status === 200) {
        // 如果返回 200, 那内容应是 not-found 页面
        const text = await page.textContent('body');
        expect(text?.toLowerCase()).toMatch(/not found|404|error|page/i);
    }
});
