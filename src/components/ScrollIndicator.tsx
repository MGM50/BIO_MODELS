import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { LucideChevronRight, LucideLayers } from 'lucide-react';

interface Label {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}

interface Unit {
  name: string;
  labels: Label[];
}

interface Grade {
  grade: string;
  title: string;
  icon: React.ReactNode;
  units: Unit[];
}

interface ActiveSection {
  grade: string;
  unit: string;
}

interface ScrollIndicatorProps {
  grades: Grade[];
}

export default function ScrollIndicator({ grades }: ScrollIndicatorProps) {
  const [active, setActive] = useState<ActiveSection>({ grade: '09', unit: 'Unit 1: The Basis of Life' });
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
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

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const currentGradeData = grades.find(g => g.grade === active.grade);

  const scrollToUnit = (unitName: string) => {
    const id = `unit-${unitName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-end gap-6 pointer-events-auto"
        >
          {/* Main Indicator */}
          <div className="flex flex-col items-end">
            <motion.div
              key={active.grade}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[10px] font-mono text-accent/40 uppercase tracking-[0.4em] mb-1"
            >
              Biological Sector
            </motion.div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <motion.div
                  key={active.grade + '-title'}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-3xl font-black tracking-tighter text-glow-accent"
                >
                  G{active.grade}
                </motion.div>
                <motion.div
                  key={active.unit}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-[9px] font-bold uppercase tracking-widest text-text/60 flex items-center gap-2 max-w-[150px] text-right"
                >
                  <LucideChevronRight size={10} className="text-accent flex-shrink-0" />
                  {active.unit}
                </motion.div>
              </div>
              
              <div className="w-1.5 h-16 bg-accent/10 rounded-full relative overflow-hidden border border-accent/5">
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-accent shadow-[0_0_15px_var(--color-accent)]"
                  animate={{ height: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                />
              </div>
            </div>
          </div>

          {/* Unit Navigation */}
          {currentGradeData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-end gap-2 pr-6 border-r border-accent/10"
            >
              <div className="flex items-center gap-2 text-[8px] font-mono text-text/30 uppercase tracking-widest mb-2">
                <LucideLayers size={10} />
                Units
              </div>
              {currentGradeData.units.map((unit) => (
                <button
                  key={unit.name}
                  onClick={() => scrollToUnit(unit.name)}
                  className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 hover:text-accent text-right ${
                    active.unit === unit.name ? 'text-accent' : 'text-text/30'
                  }`}
                >
                  {unit.name.split(':')[0]}
                </button>
              ))}
            </motion.div>
          )}

          {/* Grade Navigation Dots */}
          <div className="flex flex-col gap-3 items-end mt-4">
            {['09', '10', '11', '12'].map((g) => (
              <button 
                key={g} 
                onClick={() => {
                  const element = document.getElementById(`grade-${g}`);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                {active.grade === g && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[8px] font-mono text-accent"
                  >
                    ACTIVE
                  </motion.span>
                )}
                <div 
                  className={`w-1.5 transition-all duration-700 rounded-full group-hover:bg-accent/50 ${
                    active.grade === g ? 'h-10 bg-accent shadow-[0_0_15px_var(--color-accent)]' : 'h-2 bg-text/10'
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
