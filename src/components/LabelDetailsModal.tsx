import { motion, AnimatePresence } from 'motion/react';
import { LucideX } from 'lucide-react';
import { useEffect } from 'react';
import { type Label } from '../types';

interface LabelDetailsModalProps {
  label: Label | null;
  relatedLabels?: Label[];
  theme: 'dark' | 'light';
  onClose: () => void;
  onSelectLabel?: (label: Label) => void;
}

export default function LabelDetailsModal({ label, relatedLabels = [], theme, onClose, onSelectLabel }: LabelDetailsModalProps) {
  const isLight = theme === 'light';

  useEffect(() => {
    if (label) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [label]);

  return (
    <AnimatePresence>
      {label && (
        <div className={`fixed inset-0 z-200 flex flex-col overflow-y-auto no-scrollbar transition-colors duration-500 ${isLight ? 'bg-white' : 'bg-black'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen w-full flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`fixed top-6 right-6 z-[210] p-3 rounded-full transition-all backdrop-blur-md group ${isLight ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              title="Close"
            >
              <LucideX size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Main Image Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-[80vh] flex items-center justify-center p-4 md:p-8"
            >
              <img
                src={label.imageUrl}
                alt={label.title}
                className="max-w-full max-h-full object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Info & Related Section */}
            <div className="w-full max-w-7xl mx-auto px-6 pb-20">
              <div className="mb-12">
                <h2 className={`text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase ${isLight ? 'text-black' : 'text-white'}`}>
                  {label.title}
                </h2>
                <p className={`text-lg max-w-3xl leading-relaxed ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                  {label.description}
                </p>
                {label.tags && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {label.tags.map(tag => (
                      <span key={tag} className={`px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest ${isLight ? 'bg-black/5 border-black/10 text-black/40' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {relatedLabels.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-accent">Related Visuals</h3>
                    <div className={`h-px flex-1 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar snap-x">
                    {relatedLabels.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectLabel?.(item)}
                        className={`shrink-0 w-48 aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all snap-start ${
                          item.id === label.id ? 'border-accent shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.3)]' : isLight ? 'border-black/5 hover:border-black/20' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
