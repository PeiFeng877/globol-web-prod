/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: None
 * OUTPUT: Sticky header
 * POS: Layout Component
 * CONTRACT: Renders navigation and primary CTA header.
 * 职责: 页头导航与 CTA。
 */
import Link from 'next/link';
import Button from '../ui/Button';
import Container from './Container';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-yellow-500">
            Globol
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-body">
            <Link href="#" className="hover:text-text-main">The Buzz</Link>
            <Link href="#" className="hover:text-text-main">Events</Link>
            <Link href="#" className="hover:text-text-main">Success Stories</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hidden md:block text-sm font-medium hover:text-yellow-500">
            Sign In
          </Link>
          <Button size="sm">Join Globol</Button>
        </div>
      </Container>
    </header>
  );
}
