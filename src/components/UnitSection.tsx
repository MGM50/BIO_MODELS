import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { LucideExternalLink, LucideLayers } from 'lucide-react';

interface Label {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}

interface UnitSectionProps {
  grade: string;
  title: string;
  labels: Label[];
  id?: string;
  onLabelClick?: (label: Label) => void;
}

function ParallaxImage({ src, alt, scrollYProgress, isLarge }: { src: string, alt: string, scrollYProgress: any, isLarge: boolean }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.img
      style={{ y: springY }}
      src={src}
      alt={alt}
      className={`w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-110 parallax-img absolute top-0 left-0`}
      referrerPolicy="no-referrer"
    />
  );
}

export default function UnitSection({ grade, title, labels, id, onLabelClick }: UnitSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.98, 1]);

  return (
    <section id={id} ref={containerRef} className="unit-section-container min-h-screen py-32 px-6 md:px-12 lg:px-24 relative">
      <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-accent/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold tracking-[0.2em] uppercase">
                Grade {grade}
              </span>
              <div className="h-px w-16 bg-accent/20" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-glow-accent uppercase">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-text/40 font-mono text-[10px] tracking-widest">
            <LucideLayers size={14} className="text-accent" />
            <span>{labels.length} VISUAL ASSETS</span>
          </div>
        </div>

        {/* Dense Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {labels.map((label, index) => {
            return (
              <motion.div
                key={label.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 10) * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => onLabelClick?.(label)}
                className="glass-card group rounded-xl overflow-hidden flex flex-col cursor-pointer hover:border-accent/30 transition-all duration-500"
              >
                <div className="relative overflow-hidden aspect-square">
                  <ParallaxImage 
                    src={label.imageUrl} 
                    alt={label.title} 
                    scrollYProgress={scrollYProgress} 
                    isLarge={false} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent opacity-60" />
                  <div className="absolute top-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-2 rounded-full bg-accent text-bg shadow-[0_0_15px_var(--color-accent)]">
                      <LucideExternalLink size={14} />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {label.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[7px] font-mono font-bold uppercase tracking-widest text-accent/80 bg-accent/5 border border-accent/10 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-1">
                    {label.title}
                  </h3>
                  <p className="text-text/50 text-[10px] leading-tight mb-4 line-clamp-2 font-medium">
                    {label.description}
                  </p>
                  <div className="mt-auto pt-3 border-t border-accent/5 flex items-center justify-between">
                    <span className="text-[8px] font-mono text-text/20 tracking-tighter">{label.id}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onLabelClick?.(label);
                      }}
                      className="text-[8px] font-black text-accent hover:tracking-[0.1em] transition-all duration-300 uppercase tracking-widest flex items-center gap-1"
                    >
                      Details
                      <div className="w-2 h-px bg-accent/40" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
