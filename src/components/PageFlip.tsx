import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// Use local assets for page images
import pageImage1 from '../../Asset/1.png';
import pageImage2 from '../../Asset/2.png';
import pageImage3 from '../../Asset/3.png';
import pageImage4 from '../../Asset/4.png';

interface PageProps {
  children: React.ReactNode;
  index: number;
  currentIndex: number;
  total: number;
}

const Page: React.FC<PageProps> = ({ children, index, currentIndex, total }) => {
  const isPast = index < currentIndex;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full preserve-3d"
      initial={false}
      animate={{
        rotateY: isPast ? -180 : 0,
        zIndex: total - index,
        display: isPast && index < currentIndex - 1 ? 'none' : 'block',
      }}
      transition={{
        type: 'spring',
        stiffness: 40,
        damping: 15,
        mass: 1,
      }}
      style={{
        transformOrigin: 'left center',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="relative w-full h-full bg-[#3d0303] shadow-none overflow-hidden">
        {/* Paper Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply z-10"
          style={{
            backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          }}
        />

        {/* Shadow Depth Gradient */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10" />

        <div className="relative h-full w-full">
          {children}
        </div>
      </div>

      {/* Back of the page (to prevent seeing through) */}
      <div
        className="absolute inset-0 w-full h-full bg-[#3d0303]"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default function PageFlip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pages = [
    { image: pageImage1, bg: "bg-[#3d0303]", location: null },
    { image: pageImage2, bg: "bg-[#3d0303]", location: null },
    { image: pageImage3, bg: "bg-[#3d0303]", location: null },
    {
      image: pageImage4,
      bg: "bg-[#3d0303]",
      location: {
        label: "Wedding Venue",
        venue: "Vajradumbi House, Kodekal Ujire 574240",
        url: "https://maps.google.com/?q=Vajradumbi+House+Kodekal+Ujire+574240",
      },
    },
  ];

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  const next = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound();
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      playSound();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] flex items-center justify-center font-serif overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
        preload="auto"
      />

      {/* Invitation Container */}
      <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ height: '100%', maxHeight: '100vh', aspectRatio: '3/4', maxWidth: '100vw' }}>
        
        {/* Main Content */}
        <div className="relative w-full h-full perspective-1000">
          <div className="relative w-full h-full">
            {pages.map((page, index) => (
              <Page
                key={index}
                index={index}
                currentIndex={currentIndex}
                total={pages.length}
              >
                <div className={cn("w-full h-full relative", page.bg)}>
                  <img
                    src={page.image}
                    alt={`Invitation Page ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Page>
            ))}
          </div>

          {/* Left Tap Button - always visible when not on first page */}
          <AnimatePresence>
            {currentIndex > 0 && (
              <motion.button
                key="left-tap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </div>
                <span className="text-white/40 text-[8px] uppercase tracking-widest">Back</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Tap Button - always visible when not on last page */}
          <AnimatePresence>
            {currentIndex < pages.length - 1 && (
              <motion.button
                key="right-tap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5"
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <div
                  className="relative w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.5)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(212,175,55,0.6)' }}
                    animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                <span className="text-[#D4AF37]/70 text-[8px] uppercase tracking-widest">Next</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Invisible full-width tap zones (fallback) */}
          <div className="absolute inset-0 flex z-40 pointer-events-none">
            <div className="w-1/2 h-full pointer-events-auto" onClick={(e) => { e.stopPropagation(); prev(); }} />
            <div className="w-1/2 h-full pointer-events-auto" onClick={(e) => { e.stopPropagation(); next(); }} />
          </div>

          {/* Location Overlay */}
          <AnimatePresence mode="wait">
            {pages[currentIndex]?.location && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 right-0 flex justify-center z-50 px-6"
              >
                <a
                  href={pages[currentIndex].location!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/80 backdrop-blur-xl border border-[#D4AF37]/40 px-5 py-3 rounded-2xl flex items-center gap-4 hover:border-[#D4AF37] transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-[#D4AF37]/20 p-2 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#D4AF37">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider">{pages[currentIndex].location!.label}</span>
                    <span className="text-white/60 text-[10px] truncate max-w-[200px]">{pages[currentIndex].location!.venue}</span>
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-[9px] uppercase tracking-[0.3em] pointer-events-none z-50">
            Tap or Swipe
          </div>


          {/* Footer Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-50 items-center">
            {pages.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === currentIndex ? "w-6 bg-[#D4AF37]" : "w-1.5 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
}
