/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Any unmatched path segments
 * OUTPUT: Triggers 404
 * POS: Catch-all Route
 * CONTRACT: Captures all unknown routes within [locale] scope to render the localized 404 page with layout.
 * 职责: 捕获所有未定义的路由，强制触发带布局的 404 页面。
 */

import { notFound } from 'next/navigation';

export default function NotFoundCatchAll() {
  notFound();
}
