import React, { useState, useEffect, useRef } from 'react';
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
  const [showHint, setShowHint] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
    setShowHint(false);
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound();
    }
  };

  const prev = () => {
    setShowHint(false);
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

          {/* Interaction Zones */}
          <div className="absolute inset-0 flex z-40 pointer-events-none">
            {/* Left Zone - Navigate Back */}
            <div
              className="w-1/3 h-full pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            />
            {/* Right Zone - Navigate Next */}
            <div
              className="w-2/3 h-full pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            />
          </div>

          {/* Hint Overlay */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex pointer-events-none items-center justify-center"
              >
                {/* Left Side Hint */}
                <div className="flex-1 h-full flex items-center justify-center">
                  {currentIndex > 0 && (
                    <motion.div 
                      animate={{ x: [0, -10, 0] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </div>
                      <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Back</span>
                    </motion.div>
                  )}
                </div>

                {/* Right Side Hint */}
                <div className="flex-1 h-full flex items-center justify-center">
                  {currentIndex < pages.length - 1 && (
                    <motion.div 
                      animate={{ x: [0, 10, 0] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-14 h-14 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 backdrop-blur-md flex items-center justify-center relative">
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-[#D4AF37]"
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                      <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold drop-shadow-lg">Tap to Flip</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-[9px] uppercase tracking-[0.3em] pointer-events-none">
            Tap or Swipe
          </div>

          {/* All Pages Overview Button */}
          <motion.button
            className="absolute bottom-4 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(30,8,8,0.85) 0%, rgba(80,20,10,0.85) 100%)',
              border: '1px solid rgba(212,175,55,0.5)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 14px rgba(212,175,55,0.2), 0 4px 16px rgba(0,0,0,0.5)',
            }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
            onClick={(e) => { e.stopPropagation(); setShowOverview(true); }}
            title="Show all pages"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#D4AF37" opacity="0.9"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#D4AF37" opacity="0.9"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#D4AF37" opacity="0.9"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#D4AF37" opacity="0.9"/>
            </svg>
          </motion.button>

          {/* All Pages Overview Modal */}
          <AnimatePresence>
            {showOverview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-[60] flex flex-col"
                style={{
                  background: 'rgba(8,2,2,0.92)',
                  backdropFilter: 'blur(18px)',
                }}
                onClick={() => setShowOverview(false)}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <span
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: '#D4AF37', letterSpacing: '0.25em' }}
                  >
                    All Pages
                  </span>
                  <motion.button
                    className="flex items-center justify-center w-7 h-7 rounded-full"
                    style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(255,255,255,0.04)' }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => { e.stopPropagation(); setShowOverview(false); }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                </div>

                {/* Thumbnails Grid */}
                <div
                  className="flex-1 grid gap-3 px-4 pb-6 content-start"
                  style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {pages.map((page, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.88, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3, ease: 'easeOut' }}
                      className="relative rounded-xl overflow-hidden flex flex-col items-center"
                      style={{
                        border: i === currentIndex
                          ? '2px solid #D4AF37'
                          : '2px solid rgba(255,255,255,0.08)',
                        boxShadow: i === currentIndex
                          ? '0 0 16px rgba(212,175,55,0.35)'
                          : '0 2px 10px rgba(0,0,0,0.4)',
                        aspectRatio: '3/4',
                        background: '#1a0404',
                      }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setCurrentIndex(i);
                        playSound();
                        setShowOverview(false);
                      }}
                    >
                      <img
                        src={page.image}
                        alt={`Page ${i + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      {/* Page number badge */}
                      <div
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest"
                        style={{
                          background: i === currentIndex ? '#D4AF37' : 'rgba(0,0,0,0.55)',
                          color: i === currentIndex ? '#1a0404' : 'rgba(255,255,255,0.7)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        {i + 1}
                      </div>
                      {/* Active checkmark */}
                      {i === currentIndex && (
                        <div
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#D4AF37' }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="#1a0404" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
