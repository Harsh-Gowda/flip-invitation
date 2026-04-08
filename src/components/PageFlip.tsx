import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Use local assets for page images (replaced from remote placeholders)
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
  const isCurrent = index === currentIndex;
  const isPast = index < currentIndex;
  const isFuture = index > currentIndex;

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
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-hide swipe hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);


  const pages = [
    {
      image: pageImage1,
      bg: "bg-[#3d0303]",
      location: null,
    },
    {
      image: pageImage2,
      bg: "bg-[#3d0303]",
      location: null,
    },
    {
      image: pageImage3,
      bg: "bg-[#3d0303]",
      location: null,
    },
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

  const dismissHint = () => setShowSwipeHint(false);

  const next = () => {
    dismissHint();
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound();
    }
  };

  const prev = () => {
    dismissHint();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      playSound();
    }
  };

  // Drag gestures
  const x = useMotionValue(0);
  const dragThreshold = 50;

  const handleDragEnd = () => {
    const currentX = x.get();
    dismissHint();
    if (currentX < -dragThreshold) {
      next();
    } else if (currentX > dragThreshold) {
      prev();
    }
    animate(x, 0);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] flex items-center justify-center font-serif overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
        preload="auto"
      />

      {/* Invitation Container - Full screen on mobile, constrained on desktop */}
      <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ height: '100%', maxHeight: '100vh', aspectRatio: '3/4', maxWidth: '100vw' }}>
        {/* Main Container */}
        <div className="relative w-full h-full perspective-1000">
          <motion.div
            className="relative w-full h-full"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
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
          </motion.div>

          {/* Invisible Tap Zones */}
          <div className="absolute inset-0 flex z-40 pointer-events-none">
            {/* Left Tap Zone (Backward) */}
            <div
              className="w-1/2 h-full pointer-events-auto cursor-w-resize"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            />
            {/* Right Tap Zone (Forward) */}
            <div
              className="w-1/2 h-full pointer-events-auto cursor-e-resize"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            />
          </div>

          {/* Location Button Overlay */}
          <AnimatePresence mode="wait">
            {pages[currentIndex]?.location && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute bottom-16 left-0 right-0 flex justify-center z-50 pointer-events-none"
              >
                <a
                  href={pages[currentIndex].location!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30,8,8,0.82) 0%, rgba(80,20,10,0.82) 100%)',
                    border: '1px solid rgba(212,175,55,0.55)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 18px rgba(212,175,55,0.25), 0 4px 20px rgba(0,0,0,0.5)',
                    textDecoration: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Pulsing pin icon */}
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full opacity-40"
                      style={{ background: '#D4AF37' }}
                      animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
                        fill="#D4AF37"
                      />
                    </svg>
                  </span>

                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: '#D4AF37', fontWeight: 600 }}>
                      {pages[currentIndex].location!.label}
                    </span>
                    <span className="text-[9px] text-white/60 truncate max-w-[160px]">
                      {pages[currentIndex].location!.venue}
                    </span>
                  </div>

                  {/* External link arrow */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 2, opacity: 0.5 }}>
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Animated Swipe Hint Overlay */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-end pb-20 pointer-events-none"
            >
              {/* Dark gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="relative flex flex-col items-center gap-3">
                {/* Swipe arrow animation */}
                <motion.div
                  className="flex items-center gap-1"
                  animate={{ x: [0, 18, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                >
                  {/* Hand / finger icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="26" fontSize="26" fill="white" style={{ filter: 'drop-shadow(0 0 6px rgba(255,200,100,0.8))' }}>👆</text>
                  </svg>
                  {/* Arrow */}
                  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10 H30 M22 2 L30 10 L22 18" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                {/* Hint text */}
                <motion.p
                  className="text-white text-sm font-semibold uppercase tracking-widest"
                  style={{ textShadow: '0 0 12px rgba(255,200,80,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                >
                  Swipe to next page
                </motion.p>

                {/* Dots progress indicator */}
                <div className="flex gap-2 mt-1">
                  {pages.map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: i === currentIndex ? '#FFD700' : 'rgba(255,255,255,0.3)',
                        transform: i === currentIndex ? 'scale(1.4)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-[9px] uppercase tracking-[0.3em] pointer-events-none">
          Tap or Swipe
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}} />
    </div>
  );
}
