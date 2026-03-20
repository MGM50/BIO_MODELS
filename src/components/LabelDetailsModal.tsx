import { motion, AnimatePresence } from 'motion/react';
import { LucideX, LucideTag, LucideInfo, LucideMaximize2, LucideDownload, LucideShare2, LucideBookmark, LucideCheckCircle2, LucideCopy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Label {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}

interface LabelDetailsModalProps {
  label: Label | null;
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function LabelDetailsModal({ label, onClose }: LabelDetailsModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (label) {
      document.body.style.overflow = 'hidden';
      // Reset bookmark state for new label
      setIsBookmarked(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [label]);

  const handleDownload = () => {
    toast.success('Preparing high-resolution asset...', {
      description: `Downloading ${label?.title} in 4K resolution.`,
      icon: <LucideDownload className="w-4 h-4" />,
    });
    
    // Mock download
    setTimeout(() => {
      toast.success('Download complete!', {
        description: `${label?.id} has been saved to your archive.`,
        icon: <LucideCheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
    }, 2000);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!', {
        description: 'You can now share this biological asset with others.',
        icon: <LucideCopy className="w-4 h-4" />,
      });
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', {
      description: `${label?.title} ${isBookmarked ? 'removed from' : 'saved to'} your personal collection.`,
      icon: <LucideBookmark className={`w-4 h-4 ${!isBookmarked ? 'fill-accent text-accent' : ''}`} />,
    });
  };

  const handleCitation = () => {
    const citation = `Biology Explorer Archive (2026). "${label?.title}" [Visual Asset ${label?.id}]. Retrieved from ${window.location.origin}`;
    navigator.clipboard.writeText(citation).then(() => {
      toast.info('Citation copied!', {
        description: 'APA-style citation has been copied to your clipboard.',
        icon: <LucideInfo className="w-4 h-4" />,
      });
    });
  };

  const handleMaximize = () => {
    if (label?.imageUrl) {
      window.open(label.imageUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {label && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-12 overflow-hidden">
          {/* Immersive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/95 backdrop-blur-3xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
            </div>
            <div className="tech-grid absolute inset-0 opacity-5" />
          </motion.div>

          {/* Modal Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full h-full md:h-auto md:max-w-7xl md:aspect-[16/9] bg-surface md:border md:border-border md:rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
          >
            {/* Close Button - Floating */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-[210] p-4 rounded-full bg-bg/50 border border-border text-text/60 hover:text-accent hover:scale-110 hover:bg-bg/80 transition-all backdrop-blur-xl group"
            >
              <LucideX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Left Section: Immersive Visual */}
            <div className="relative w-full md:w-[60%] h-[50vh] md:h-full bg-black/5 overflow-hidden group">
              {/* Viewfinder UI */}
              <div className="absolute inset-8 border border-border pointer-events-none z-10">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/40" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/40" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent/40" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent/40" />
              </div>

              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full p-12 md:p-24"
              >
                <img
                  src={label.imageUrl}
                  alt={label.title}
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.2)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Image Overlay Controls */}
              <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-20">
                <div className="flex gap-4">
                  <button 
                    onClick={handleMaximize}
                    className="p-3 rounded-xl bg-bg/50 border border-border text-text/40 hover:text-accent hover:bg-bg/80 transition-all backdrop-blur-md"
                    title="View Fullscreen"
                  >
                    <LucideMaximize2 size={18} />
                  </button>
                  <button 
                    onClick={handleBookmark}
                    className={`p-3 rounded-xl bg-bg/50 border border-border transition-all backdrop-blur-md ${isBookmarked ? 'text-accent bg-accent/10' : 'text-text/40 hover:text-accent hover:bg-bg/80'}`}
                    title="Bookmark Asset"
                  >
                    <LucideBookmark size={18} className={isBookmarked ? 'fill-accent' : ''} />
                  </button>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">Live Analysis Active</span>
                </div>
              </div>

              {/* Decorative Title Overlap */}
              <div className="absolute top-12 left-12 pointer-events-none overflow-hidden hidden md:block">
                <motion.h1 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.03 }}
                  className="text-[12vw] font-black leading-none tracking-tighter uppercase whitespace-nowrap text-text"
                >
                  {label.title}
                </motion.h1>
              </div>
            </div>

            {/* Right Section: Editorial Content */}
            <div className="w-full md:w-[40%] h-full bg-surface p-8 md:p-16 flex flex-col overflow-y-auto custom-scrollbar relative">
              <motion.div variants={itemVariants} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-md bg-accent/10 text-accent font-mono text-[10px] font-bold tracking-widest uppercase border border-accent/20">
                    Asset ID: {label.id}
                  </span>
                  <div className="h-[1px] flex-1 bg-text/5" />
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9] text-text">
                  {label.title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 === 1 ? 'text-accent' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
                
                <p className="text-text/60 text-lg leading-relaxed font-medium mb-8">
                  {label.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {label.tags?.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-text/5 border border-text/10 text-[10px] font-bold text-text/60 uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Technical Data Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 gap-px bg-text/5 border border-text/5 rounded-2xl overflow-hidden mb-12">
                <div className="grid grid-cols-2 divide-x divide-text/5">
                  <div className="p-6 bg-surface hover:bg-text/[0.02] transition-colors group">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-text/20 mb-2 group-hover:text-accent/60 transition-colors">Archived Date</h4>
                    <p className="text-sm font-bold text-text/80">20.03.2026</p>
                  </div>
                  <div className="p-6 bg-surface hover:bg-text/[0.02] transition-colors group">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-text/20 mb-2 group-hover:text-accent/60 transition-colors">Data Source</h4>
                    <p className="text-sm font-bold text-text/80">Bio-Archive V4</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-text/5">
                  <div className="p-6 bg-surface hover:bg-text/[0.02] transition-colors group">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-text/20 mb-2 group-hover:text-accent/60 transition-colors">Resolution</h4>
                    <p className="text-sm font-bold text-text/80">4K Ultra-HD</p>
                  </div>
                  <div className="p-6 bg-surface hover:bg-text/[0.02] transition-colors group">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-text/20 mb-2 group-hover:text-accent/60 transition-colors">Format</h4>
                    <p className="text-sm font-bold text-text/80">Vector / SVG</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="mt-auto flex flex-col gap-4">
                <button 
                  onClick={handleDownload}
                  className="group relative w-full py-5 rounded-2xl bg-accent overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-3 text-bg font-black text-xs tracking-[0.2em] uppercase">
                    <LucideDownload size={18} />
                    Download High-Res Asset
                  </div>
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-text/5 border border-text/10 text-text/60 font-bold text-[10px] uppercase tracking-widest hover:bg-text/10 hover:text-text transition-all"
                  >
                    <LucideShare2 size={16} />
                    Share
                  </button>
                  <button 
                    onClick={handleCitation}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-text/5 border border-text/10 text-text/60 font-bold text-[10px] uppercase tracking-widest hover:bg-text/10 hover:text-text transition-all"
                  >
                    <LucideInfo size={16} />
                    Citation
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
