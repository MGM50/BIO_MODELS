import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { useState, useEffect } from 'react';
import { LucideChevronRight, LucideLayers } from 'lucide-react';
import { type Grade, type ActiveSection } from '../types';

interface ScrollIndicatorProps {
  grades: Grade[];
  active: ActiveSection;
  setActive: (active: ActiveSection) => void;
  hidden?: boolean;
}

export default function ScrollIndicator({ grades, active, setActive, hidden }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.05 && !isVisible) setIsVisible(true);
    if (latest <= 0.05 && isVisible) setIsVisible(false);
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -45% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const gradeId = entry.target.closest('section[id^="grade-"]')?.id.replace('grade-', '');
          const unitTitle = entry.target.querySelector('h2')?.textContent;
          
          if (gradeId && unitTitle) {
            setActive({ grade: gradeId, unit: unitTitle });
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const unitSections = document.querySelectorAll('.unit-section-container');
    unitSections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [grades, setActive]);

  const currentGradeData = grades.find(g => g.grade === active.grade);

  const scrollToUnit = (unitName: string) => {
    const id = `unit-${unitName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActive({ grade: active.grade, unit: unitName });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !hidden && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end gap-4 md:gap-6 pointer-events-auto"
        >
          {/* Main Indicator */}
          <div className="flex flex-col items-end">
            <motion.div
              key={active.grade}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="hidden md:block text-[10px] font-mono text-accent/40 uppercase tracking-[0.4em] mb-1"
            >
              Biological Sector
            </motion.div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-end">
                <motion.div
                  key={active.grade + '-title'}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl md:text-3xl font-black tracking-tighter text-glow-accent"
                >
                  G{active.grade}
                </motion.div>
                <motion.div
                  key={active.unit}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-text/60 flex items-center gap-1 md:gap-2 max-w-[100px] md:max-w-[150px] text-right"
                >
                  <LucideChevronRight size={10} className="text-accent flex-shrink-0" />
                  <span className="truncate md:whitespace-normal">{active.unit}</span>
                </motion.div>
              </div>
              
              <div className="w-1 md:w-1.5 h-12 md:h-16 bg-accent/10 rounded-full relative overflow-hidden border border-accent/5">
                <motion.div 
                   className="absolute top-0 left-0 w-full bg-accent shadow-[0_0_15px_var(--color-accent)] origin-top"
                   style={{ scaleY: scrollYProgress }}
                />
              </div>
            </div>
          </div>

          {/* Unit Navigation - Improved for mobile */}
          {currentGradeData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-end gap-1.5 md:gap-2 pr-4 md:pr-6 border-r border-accent/10"
            >
              <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-mono text-text/30 uppercase tracking-widest mb-1 md:mb-2">
                <LucideLayers size={10} />
                <span className="hidden md:inline">Units</span>
              </div>
              {currentGradeData.units.map((unit, uIdx) => (
                <button
                  key={unit.name}
                  onClick={() => scrollToUnit(unit.name)}
                  className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-all duration-300 hover:text-accent text-right ${
                    active.unit === unit.name ? 'text-accent' : 'text-text/30'
                  }`}
                >
                  <span className="md:hidden">U{uIdx + 1}</span>
                  <span className="hidden md:inline">{unit.name.split(':')[0]}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Grade Navigation Dots */}
          <div className="flex flex-col gap-2 md:gap-3 items-end mt-2 md:mt-4">
            {grades.map((gData) => (
              <div 
                key={gData.grade} 
                className="flex items-center gap-2 md:gap-3 group"
              >
                {active.grade === gData.grade && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden md:block text-[8px] font-mono text-accent"
                  >
                    ACTIVE
                  </motion.span>
                )}
                <div 
                  className={`w-1 md:w-1.5 transition-all duration-700 rounded-full ${
                    active.grade === gData.grade ? 'h-6 md:h-10 bg-accent shadow-[0_0_15px_var(--color-accent)]' : 'h-1.5 md:h-2 bg-text/10'
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
