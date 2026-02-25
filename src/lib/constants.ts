/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Environment Variables
 * OUTPUT: App-wide constants
 * POS: Library Constants
 * CONTRACT: Exports static configuration values.
 * 职责: 集中管理全局常量（域名、默认配置等）。
 */

// [PROTOCOL] Enforce canonical domain to be www.globol.im
// ignoring process.env.NEXT_PUBLIC_BASE_URL to prevent 307 redirects
export const BASE_URL = 'https://www.globol.im';
