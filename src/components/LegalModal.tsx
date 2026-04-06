import { motion, AnimatePresence } from 'motion/react';
import { LucideX, LucideShield, LucideFileText, LucideScale } from 'lucide-react';
import { useEffect } from 'react';

type LegalType = 'privacy' | 'terms' | 'license' | null;

interface LegalModalProps {
  type: LegalType;
  theme: 'dark' | 'light';
  onClose: () => void;
}

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    icon: <LucideShield className="text-accent" size={32} />,
    content: `
      <h3 class="text-xl font-bold mb-4 text-accent">1. Data Collection</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        The Biology Visual Archive is an educational platform. We do not collect personal identification information (PII) from our users. Any search queries or interactions within the application are processed locally or used solely to improve the user experience during the current session.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">2. Cookies and Local Storage</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        We may use local storage to save your preferences, such as your theme choice (Dark/Light mode). This data remains on your device and is not transmitted to our servers.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">3. Third-Party Services</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        Our application may link to external educational resources or use CDNs for assets. These third-party services have their own privacy policies, and we are not responsible for their content or practices.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">4. Educational Use</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        This platform is designed for students and educators. We prioritize a safe, ad-free environment for learning.
      </p>
    `
  },
  terms: {
    title: 'Terms of Use',
    icon: <LucideFileText className="text-accent" size={32} />,
    content: `
      <h3 class="text-xl font-bold mb-4 text-accent">1. Acceptance of Terms</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        By accessing the Biology Visual Archive, you agree to use the platform for educational purposes only. Unauthorized commercial use of the repository is strictly prohibited.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">2. Intellectual Property</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        All biological illustrations, diagrams, and descriptions are part of the Visual Archive. While we encourage educational sharing, the underlying code and design of the platform remain the property of the developers.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">3. Accuracy of Information</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        While we strive for scientific accuracy, the content is provided "as is" for educational reference. We recommend cross-referencing with official textbooks for critical academic assessments.
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">4. User Conduct</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        Users must not attempt to disrupt the service, inject malicious code, or scrape data from the repository.
      </p>
    `
  },
  license: {
    title: 'License Information',
    icon: <LucideScale className="text-accent" size={32} />,
    content: `
      <h3 class="text-xl font-bold mb-4 text-accent">Educational Commons License</h3>
      <p class="mb-6 text-text/60 leading-relaxed">
        The Biology Visual Archive is licensed under a custom Educational Commons License. 
      </p>

      <h3 class="text-xl font-bold mb-4 text-accent">Permitted Use:</h3>
      <ul class="list-disc list-inside mb-6 text-text/60 space-y-2">
        <li>Classroom presentations and lectures.</li>
        <li>Student study and research projects.</li>
        <li>Non-commercial educational blogs or websites with attribution.</li>
      </ul>

      <h3 class="text-xl font-bold mb-4 text-accent">Restricted Use:</h3>
      <ul class="list-disc list-inside mb-6 text-text/60 space-y-2">
        <li>Resale of any visual assets or descriptions.</li>
        <li>Use in paid educational courses without explicit permission.</li>
        <li>Modification of images for commercial distribution.</li>
      </ul>

      <p class="mt-8 text-text/40 italic text-sm">
        &copy; 2026 Biology Visual Repository. All rights reserved. For licensing inquiries, please contact the administrator.
      </p>
    `
  }
};

export default function LegalModal({ type, theme, onClose }: LegalModalProps) {
  const isLight = theme === 'light';

  useEffect(() => {
    if (type) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [type]);

  const data = type ? LEGAL_CONTENT[type] : null;

  return (
    <AnimatePresence>
      {type && data && (
        <div className={`fixed inset-0 z-[200] flex flex-col overflow-y-auto no-scrollbar transition-colors duration-500 ${isLight ? 'bg-white' : 'bg-black'}`}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative min-h-screen w-full flex flex-col"
          >
            {/* Header / Navigation */}
            <div className={`sticky top-0 z-[210] p-6 md:p-8 border-b backdrop-blur-xl flex items-center justify-between ${isLight ? 'bg-white/80 border-black/5' : 'bg-black/80 border-white/5'}`}>
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`p-4 rounded-2xl ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                  {data.icon}
                </div>
                <div>
                  <h2 className={`text-2xl md:text-4xl font-black tracking-tighter ${isLight ? 'text-black' : 'text-white'}`}>{data.title}</h2>
                  <p className="text-[10px] font-mono text-accent uppercase tracking-[0.3em]">Legal Document v1.0</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={`p-4 rounded-full transition-all group ${isLight ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
              >
                <LucideX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24">
              <div 
                className={`prose max-w-none ${isLight ? 'prose-slate' : 'prose-invert'}`}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
              
              <div className={`mt-24 pt-12 border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col gap-2">
                    <p className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-black/20' : 'text-white/20'}`}>
                      &copy; 2026 Biology Visual Repository
                    </p>
                    <p className={`text-[8px] font-mono uppercase tracking-[0.4em] ${isLight ? 'text-black/10' : 'text-white/10'}`}>
                      Verified Scientific Archive
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-12 py-4 rounded-full bg-accent text-bg font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.3)]"
                  >
                    Return to Archive
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
