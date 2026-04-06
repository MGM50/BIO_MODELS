import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import ThreeBackground from './components/ThreeBackground';
import UnitSection from './components/UnitSection';
import ScrollIndicator from './components/ScrollIndicator';
import LabelDetailsModal from './components/LabelDetailsModal';
import LegalModal from './components/LegalModal';
import { LucideArrowDown, LucideCpu, LucideGlobe, LucideAtom, LucideDna, LucideSun, LucideMoon, LucideSearch, LucideGithub, LucideTwitter, LucideMail } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { type Grade, type ActiveSection, type Label } from './types';
import { fetchCurriculum } from './services/api';

// Sound effect URL
const CLICK_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

const GRADE_ICONS: Record<string, React.ReactNode> = {
  "09": <LucideDna className="text-accent" />,
  "10": <LucideGlobe className="text-accent" />,
  "11": <LucideAtom className="text-accent" />,
  "12": <LucideCpu className="text-accent" />
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('biology-explorer-theme');
      return (saved as 'dark' | 'light') || 'light';
    }
    return 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [relatedLabels, setRelatedLabels] = useState<Label[]>([]);
  const [curriculum, setCurriculum] = useState<Grade[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveSection>({ 
    grade: '09', 
    unit: '' 
  });
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | 'license' | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCurriculum();
      setCurriculum(data);
      
      // Initialize active section if data exists
      if (data.length > 0 && data[0].units.length > 0) {
        setActiveSection({
          grade: data[0].grade,
          unit: data[0].units[0].name
        });
      }
    };
    loadData();
  }, []);

  const mergedGradesData = useMemo(() => {
    return curriculum.map(grade => ({
      ...grade,
      icon: GRADE_ICONS[grade.grade] || <LucideGlobe className="text-accent" />
    }));
  }, [curriculum]);

  const playClickSound = () => {
    const audio = new Audio(CLICK_SOUND);
    audio.volume = 0.2;
    audio.play().catch(() => console.log("Audio play blocked"));
  };

  const handleLabelClick = (label: Label, related: Label[] = []) => {
    playClickSound();
    setSelectedLabel(label);
    setRelatedLabels(related);
  };
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('biology-explorer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Detect if we are near the bottom to hide scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const threshold = document.documentElement.scrollHeight - window.innerHeight - 400;
      setIsFooterVisible(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return mergedGradesData;
    
    const query = debouncedSearch.toLowerCase();
    return mergedGradesData.map(grade => ({
      ...grade,
      units: grade.units.map(unit => ({
        ...unit,
        labels: unit.labels.filter(label => 
          label.title.toLowerCase().includes(query) || 
          label.description.toLowerCase().includes(query) ||
          (label.tags && label.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      })).filter(unit => unit.labels.length > 0)
    })).filter(grade => grade.units.length > 0);
  }, [debouncedSearch, mergedGradesData]);

  return (
    <main className={`relative selection:bg-accent selection:text-bg transition-colors duration-700 ${theme}`}>
      <Toaster position="bottom-right" theme={theme} />
      <div className="scanline" />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[100] shadow-[0_0_10px_var(--color-accent)]"
        style={{ scaleX }}
      />
      
      <ScrollIndicator 
        grades={filteredData} 
        active={activeSection}
        setActive={setActiveSection}
        hidden={isFooterVisible || !!selectedLabel || !!legalType}
      />
      <ThreeBackground theme={theme} paused={!!selectedLabel || !!legalType} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text/60">
              Biology Visual Archive v4.0
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
            BIOLOGY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/40">
              EXPLORER
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-text/40 text-sm md:text-base leading-relaxed font-medium">
            A high-fidelity digital archive of Biology textbook illustrations across Grades 9-12. 
            Engineered for clarity, precision, and immersive scientific learning.
          </p>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-accent/40"
        >
          <LucideArrowDown size={24} />
        </motion.div>
      </section>

      {/* Navigation & Search Bar */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-2 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto justify-start md:justify-start px-2 md:px-0">
            {mergedGradesData.map((g) => (
              <a 
                key={g.grade} 
                href={`#grade-${g.grade}`}
                onClick={() => setActiveSection({ grade: g.grade, unit: g.units[0]?.name || '' })}
                className={`group flex items-center gap-2 md:gap-3 whitespace-nowrap p-1.5 md:p-0 rounded-xl transition-all ${activeSection.grade === g.grade ? 'bg-accent/10 md:bg-transparent' : ''}`}
              >
                <div className={`p-1.5 md:p-2 rounded-lg transition-all ${activeSection.grade === g.grade ? 'bg-accent text-bg shadow-[0_0_15px_var(--color-accent)]' : 'bg-accent/5 border border-accent/10 text-accent group-hover:bg-accent group-hover:text-bg'}`}>
                  {g.icon}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[7px] md:text-[10px] font-mono transition-colors ${activeSection.grade === g.grade ? 'text-accent' : 'text-text/20 group-hover:text-accent'}`}>
                    SECTOR {g.grade}
                  </span>
                  <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${activeSection.grade === g.grade ? 'text-text' : 'text-text/40 group-hover:text-text'}`}>
                    Grade {g.grade}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto px-2 md:px-0">
            <div className="relative flex-1 md:w-64 lg:w-96 group">
              <LucideSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-accent/30 group-focus-within:text-accent transition-colors" size={14} />
              <input 
                type="text"
                placeholder="Search systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:pl-11 pr-4 py-2 md:py-2.5 rounded-xl bg-surface/50 border border-border text-xs md:text-sm focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[7px] md:text-[8px] font-mono text-accent/60 bg-accent/5 px-1.5 py-0.5 rounded">
                  {filteredData.reduce((acc, g) => acc + g.units.reduce((uAcc, u) => uAcc + u.labels.length, 0), 0)}
                </div>
              )}
            </div>

            {/* Theme Toggle - Integrated */}
            <button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-xl bg-surface border border-border text-accent hover:scale-105 transition-all shadow-sm backdrop-blur-md flex-shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <LucideSun size={16} /> : <LucideMoon size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredData.length > 0 ? (
            filteredData.map((grade) => (
              <section key={grade.grade} id={`grade-${grade.grade}`} className="relative py-24">
                <div className="grade-divider" />
                <div className="grade-number">{grade.grade}</div>
                
                <div className="max-w-7xl mx-auto px-6 mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                      {grade.icon}
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter">GRADE {grade.grade}</h2>
                      <p className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase">{grade.title}</p>
                    </div>
                  </div>
                </div>

                {grade.units.map((unit) => (
                  <UnitSection
                    key={unit.name}
                    id={`unit-${unit.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    grade={grade.grade}
                    title={unit.name}
                    labels={unit.labels}
                    onLabelClick={handleLabelClick}
                    data-unit-name={unit.name}
                    data-grade-num={grade.grade}
                  />
                ))}
              </section>
            ))
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-full bg-accent/5 border border-accent/10 text-accent mb-8 animate-pulse"
              >
                <LucideSearch size={64} />
              </motion.div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">NO BIOLOGICAL DATA FOUND</h2>
              <p className="text-text/40 max-w-md mx-auto leading-relaxed text-lg">
                Your search query "<span className="text-accent">{searchQuery}</span>" did not match any archived biological systems or units.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-10 px-10 py-4 rounded-full bg-accent text-bg font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform shadow-[0_0_30px_var(--color-accent)]"
              >
                Reset Search Parameters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-32 px-6 bg-surface border-t border-white/5 overflow-hidden">
        <div className="tech-grid absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div>
              <h3 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-2xl font-bold mb-2 text-glow-accent cursor-pointer hover:scale-105 transition-transform inline-block"
              >
                Biology Explorer
              </h3>
              <p className="text-accent font-mono text-[10px] mb-6 tracking-widest uppercase">Made by Mohammed 12C</p>
              <p className="text-text/40 text-sm max-w-sm leading-relaxed">
                The ultimate digital companion for biological excellence. 
                Bridging the gap between static textbooks and dynamic digital learning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-4">Curriculum</h4>
                <ul className="space-y-2 text-xs text-text/30">
                  {mergedGradesData.map((grade) => (
                    <li 
                      key={grade.grade}
                      onClick={() => {
                        document.getElementById(`grade-${grade.grade}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-text cursor-pointer transition-colors"
                    >
                      Grade {parseInt(grade.grade)}: {grade.title.split(' & ')[0]}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-4">Legal</h4>
                <ul className="space-y-2 text-xs text-text/30">
                  <li 
                    onClick={() => setLegalType('privacy')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Privacy Policy
                  </li>
                  <li 
                    onClick={() => setLegalType('terms')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Terms of Use
                  </li>
                  <li 
                    onClick={() => setLegalType('license')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    License
                  </li>
                  <li 
                    onClick={() => toast.info('Contact us at mameget1999@gmail.com')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Contact
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-mono text-text/20 uppercase tracking-widest">
                &copy; 2026 Biology Visual Repository. All rights reserved.
              </p>
              <p className="text-[8px] font-mono text-text/10 uppercase tracking-[0.3em]">
                Designed for Educational Excellence
              </p>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text/10 hover:text-accent transition-colors">
                <LucideGithub size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text/10 hover:text-accent transition-colors">
                <LucideTwitter size={18} />
              </a>
              <a href="mailto:mameget1999@gmail.com" className="text-text/10 hover:text-accent transition-colors">
                <LucideMail size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal 
        type={legalType} 
        theme={theme}
        onClose={() => setLegalType(null)} 
      />

      <LabelDetailsModal 
        label={selectedLabel} 
        relatedLabels={relatedLabels}
        theme={theme}
        onClose={() => {
          setSelectedLabel(null);
          setRelatedLabels([]);
        }} 
        onSelectLabel={(label) => {
          playClickSound();
          setSelectedLabel(label);
        }}
      />
    </main>
  );
}
