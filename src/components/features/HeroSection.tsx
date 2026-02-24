/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: None
 * OUTPUT: Hero visual section
 * POS: Feature Component
 * CONTRACT: Renders full-bleed hero image with overlay.
 * 职责: 首页视觉焦点区块。
 */
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-gray-200">
      <Image
        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop"
        alt="Couple enjoying a date"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  );
}
