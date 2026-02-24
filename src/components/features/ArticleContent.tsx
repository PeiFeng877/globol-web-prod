/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: children: React.ReactNode
 * OUTPUT: Article content container
 * POS: Feature Component
 * CONTRACT: Wraps article body with layout, spacing, and styling.
 * 职责: 文章内容的统一容器样式。
 */
import React from 'react';
import Container from '../layout/Container';

interface ArticleContentProps {
  children: React.ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
  return (
    <div className="relative z-10 -mt-24 md:-mt-32 pb-20">
      <Container>
        <div className="bg-off-white rounded-t-[2.5rem] p-8 md:p-16 lg:p-20 shadow-sm max-w-4xl mx-auto">
          {children}
        </div>
      </Container>
    </div>
  );
}
