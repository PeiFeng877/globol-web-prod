/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: None
 * OUTPUT: Playwright 配置
 * POS: Project Root
 * CONTRACT: E2E 测试运行器配置，含 webServer 自动启动。
 * 职责: 统一 Playwright 运行时行为。
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 1,
    workers: 2,

    // 超时设置: 每个测试最多 30 秒
    timeout: 30_000,

    // 期望超时: 元素断言最多等 10 秒
    expect: { timeout: 10_000 },

    // 报告器
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
    ],

    use: {
        baseURL: 'http://localhost:3000',
        // 失败时截图
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },

    // 开发服务器自动启动
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
