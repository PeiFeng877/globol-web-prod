/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Badge props
 * OUTPUT: Styled badge element
 * POS: UI Primitive
 * CONTRACT: Renders uppercase pill badge for labels.
 * 职责: 基础徽章样式。
 */
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 ${className}`}>
      {children}
    </span>
  );
};
