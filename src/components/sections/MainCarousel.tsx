'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: slides: Slide[] (server-injected), firstSlideTitle: string
 * OUTPUT: Animated hero carousel with CTA download buttons
 * POS: Section Component
 * CONTRACT: First slide HTML is server-rendered for LCP; JS hydration only adds
 *           auto-play and slide transitions. Translations come via props, not client import.
 * 职责: 首页主轮播（首屏服务端直出，轮播逻辑客户端增强）。
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DownloadButtons } from '@/components/ui/DownloadButtons';

// ─── Types ───────────────────────────────────────────────────
export interface Slide {
  id: number;
  title: string;
  image: string;
  bgGradient: string;
}

interface MainCarouselProps {
  slides: Slide[];
}

// ─── Component ───────────────────────────────────────────────
export const MainCarousel = ({ slides }: MainCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Optimization: Adjusted sizes to be more realistic for responsive breakpoints
  const imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  // Auto-play and Mount check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // For LCP optimization: On SSR and first mount, we only care about the first slide
  const visibleSlides = isMounted ? slides : [slides[0]];

  return (
    <section className="relative h-[92svh] min-h-[600px] w-full overflow-hidden flex items-center bg-off-white">
      {/* Background Gradients Transition */}
      {visibleSlides.map((slide, index) => (
        <div
          key={`bg-${slide.id}`}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-opacity duration-1000 ease-in-out`}
          style={{
            opacity: currentSlide === index ? 1 : 0,
            transitionProperty: index === 0 && currentSlide === 0 ? 'none' : 'opacity'
          }}
        />
      ))}

      <div className="container mx-auto px-8 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start md:items-center relative z-10 h-auto md:h-full">
        {/* Left Content (Text) - Stacked Grid for stability */}
        <div className="order-1 md:order-1 grid grid-cols-1 grid-rows-1 items-center min-w-0">
          {visibleSlides.map((slide, index) => {
            const isActive = currentSlide === index;
            return (
              <div
                key={`text-${slide.id}`}
                className={`col-start-1 row-start-1 flex flex-col items-center text-center md:items-start md:text-left gap-8 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  } ${index === 0 && isActive ? '' : 'transition-opacity duration-700 ease-in-out'
                  }`}
              >
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-4 md:mb-6 leading-tight">
                  {slide.title}
                </h2>
                <div className="hidden md:flex">
                  <DownloadButtons className="justify-center md:justify-start" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Content (Image) */}
        <div className="order-2 md:order-2 flex justify-center md:justify-end relative h-[45vh] sm:h-[52vh] md:h-[75svh] w-full items-center min-w-0">
          {visibleSlides.map((slide, index) => {
            const isActive = currentSlide === index;
            // Disable animations for the very first slide to optimize LCP
            const isInitialSlide = index === 0;
            const animationClasses = isInitialSlide && isActive
              ? ''
              : 'transition-all duration-700 ease-in-out transform';

            return (
              <div
                key={`img-${slide.id}`}
                className={`absolute inset-0 flex items-center justify-center ${animationClasses} ${isActive
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                <div className="relative w-full h-full max-w-[400px] max-h-[800px]">
                  <Image
                    src={slide.image}
                    alt={`Globol App Screen: ${slide.title} - Real-time translation and global chat features`}
                    fill
                    className="object-contain"
                    sizes={imageSizes}
                    priority={isInitialSlide}
                    loading={isInitialSlide ? "eager" : "lazy"}
                    fetchPriority={isInitialSlide ? "high" : "auto"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Download Buttons (Title -> Image -> Buttons) */}
        <div className="order-3 md:hidden flex justify-center mt-4">
          <DownloadButtons className="justify-center" />
        </div>
      </div>

      {/* Vertical Pagination Dots (Right Side) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'h-8 bg-gray-900' : 'h-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
