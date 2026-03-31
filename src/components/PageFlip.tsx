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
  stiffness: number;
  damping: number;
}

const Page: React.FC<PageProps> = ({ children, index, currentIndex, total, stiffness, damping }) => {
  const isCurrent = index === currentIndex;
  const isPast = index < currentIndex;
  const isFuture = index > currentIndex;

  // 3D Flip Logic
  // We want the page to flip from right to left (like a book)
  // But the request says "vertical pages", usually meaning portrait orientation.
  // A vertical flip or a horizontal flip? "Page-flip" usually implies horizontal (book-like).
  // I'll implement a horizontal flip that feels like a high-end card.

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
        stiffness: stiffness,
        damping: damping,
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
  const [stiffness, setStiffness] = useState(40);
  const [damping, setDamping] = useState(15);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pages = [
    {
      image: pageImage1, // local asset replacement for page 1
      bg: "bg-[#3d0303]"
    },
    {
      image: pageImage2, // local asset replacement for page 2
      bg: "bg-[#3d0303]"
    },
    {
      image: pageImage3, // local asset replacement for page 3
      bg: "bg-[#3d0303]"
    },
    {
      image: pageImage4, // local asset replacement for page 4
      bg: "bg-[#3d0303]"
    }
  ];

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const next = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound();
    } else {
      // Loop back to start if at the end? Or just stay.
      // User said "tap slide option", maybe they want to loop.
      // Let's just stay for now.
    }
  };

  const prev = () => {
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
      <div className="relative w-full h-full md:h-[95vh] md:aspect-[9/16] md:w-auto overflow-hidden bg-[#1a1a1a]">
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
                stiffness={stiffness}
                damping={damping}
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
        </div>

        {/* Animation Controls Toggle */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 z-50">
          <button 
            onClick={() => setShowControls(!showControls)}
            className="text-[9px] text-white/20 uppercase tracking-widest hover:text-white/60 transition-colors"
          >
            {showControls ? 'Hide Settings' : 'Settings'}
          </button>

          {/* Controls Panel */}
          <AnimatePresence>
            {showControls && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-black/60 backdrop-blur-xl p-5 border border-white/10 w-[240px] space-y-5 shadow-2xl"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-white/60 uppercase tracking-wider">
                    <span>Speed</span>
                    <span className="text-white">{stiffness}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    value={stiffness} 
                    onChange={(e) => setStiffness(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-white/60 uppercase tracking-wider">
                    <span>Intensity</span>
                    <span className="text-white">{damping}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={damping} 
                    onChange={(e) => setDamping(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/10 text-[8px] uppercase tracking-[0.3em] pointer-events-none">
          Tap or Swipe
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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
