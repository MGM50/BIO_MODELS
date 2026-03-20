import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import ThreeBackground from './components/ThreeBackground';
import UnitSection from './components/UnitSection';
import ScrollIndicator from './components/ScrollIndicator';
import LabelDetailsModal from './components/LabelDetailsModal';
import { LucideArrowDown, LucideCpu, LucideGlobe, LucideAtom, LucideDna, LucideSun, LucideMoon, LucideSearch } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// Sound effect URL
const CLICK_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

const GRADES_DATA = [
  {
    grade: "09",
    title: "Cell Biology & Ecology",
    icon: <LucideDna className="text-accent" />,
        units: [
      {
        name: "Unit 1: The Basis of Life",
        labels: [
          {
            id: "G9-U1-01",
            title: "Plant Cell Structure",
            description: "Examination of eukaryotic plant cells, highlighting the cell wall, chloroplasts, and large central vacuole.",
            imageUrl: "https://picsum.photos/seed/plantcell/1200/800",
            tags: ["CELLS", "BOTANY"]
          },
          {
            id: "G9-U1-02",
            title: "Animal Cell Anatomy",
            description: "Key organelles including mitochondria, ribosomes, and the nucleus in animal cells.",
            imageUrl: "https://picsum.photos/seed/animalcell/800/800",
            tags: ["CELLS", "ZOOLOGY"]
          },
          {
            id: "G9-U1-03",
            title: "Cell Membrane",
            description: "The fluid mosaic model showing the phospholipid bilayer and embedded proteins.",
            imageUrl: "https://picsum.photos/seed/membrane/800/800",
            tags: ["CELLS", "MOLECULAR"]
          },
          {
            id: "G9-U1-04",
            title: "Mitosis Stages",
            description: "Visualizing Prophase, Metaphase, Anaphase, and Telophase in somatic cells.",
            imageUrl: "https://picsum.photos/seed/mitosis/800/800",
            tags: ["CELLS", "DIVISION"]
          },
          {
            id: "G9-U1-05",
            title: "Prokaryotic Cells",
            description: "Simple cell structure without a nucleus, typical of bacteria and archaea.",
            imageUrl: "https://picsum.photos/seed/bacteria/800/800",
            tags: ["CELLS", "MICRO"]
          },
          {
            id: "G9-U1-06",
            title: "Endoplasmic Reticulum",
            description: "The network of membranes involved in protein and lipid synthesis.",
            imageUrl: "https://picsum.photos/seed/er/800/800",
            tags: ["CELLS", "ORGANELLES"]
          },
          {
            id: "G9-U1-07",
            title: "Golgi Apparatus",
            description: "Processing and packaging proteins for secretion.",
            imageUrl: "https://picsum.photos/seed/golgi/800/800",
            tags: ["CELLS", "PACKAGING"]
          },
          {
            id: "G9-U1-08",
            title: "Lysosomes",
            description: "Digestive enzymes for breaking down waste materials.",
            imageUrl: "https://picsum.photos/seed/lysosome/800/800",
            tags: ["CELLS", "WASTE"]
          },
          {
            id: "G9-U1-09",
            title: "Cytoskeleton",
            description: "Network of protein filaments that helps the cell maintain its shape.",
            imageUrl: "https://picsum.photos/seed/cytoskeleton/800/800",
            tags: ["CELLS", "STRUCTURE"]
          },
          {
            id: "G9-U1-10",
            title: "Vacuoles",
            description: "Storage sacs for water, nutrients, or waste products.",
            imageUrl: "https://picsum.photos/seed/vacuole/800/800",
            tags: ["CELLS", "STORAGE"]
          }
        ]
      },
      {
        name: "Unit 2: Ecology & Environment",
        labels: [
          {
            id: "G9-U2-01",
            title: "Energy Flow",
            description: "Visualizing food chains, webs, and the pyramid of energy.",
            imageUrl: "https://picsum.photos/seed/ecosystem/800/800",
            tags: ["ECOLOGY", "ENERGY"]
          },
          {
            id: "G9-U2-02",
            title: "Nitrogen Cycle",
            description: "The process of nitrogen fixation and denitrification.",
            imageUrl: "https://picsum.photos/seed/nitrogen/800/800",
            tags: ["ECOLOGY", "CYCLE"]
          },
          {
            id: "G9-U2-03",
            title: "Carbon Cycle",
            description: "The movement of carbon through the atmosphere and biosphere.",
            imageUrl: "https://picsum.photos/seed/carbon/800/800",
            tags: ["ECOLOGY", "CARBON"]
          },
          {
            id: "G9-U2-04",
            title: "Symbiosis",
            description: "Mutualism, commensalism, and parasitism interactions.",
            imageUrl: "https://picsum.photos/seed/symbiosis/800/800",
            tags: ["ECOLOGY", "INTERACTION"]
          },
          {
            id: "G9-U2-05",
            title: "Biomes",
            description: "Major ecological communities like rainforests and deserts.",
            imageUrl: "https://picsum.photos/seed/biome/800/800",
            tags: ["ECOLOGY", "BIODIVERSITY"]
          },
          {
            id: "G9-U2-06",
            title: "Water Cycle",
            description: "Evaporation, condensation, and precipitation processes.",
            imageUrl: "https://picsum.photos/seed/watercycle/800/800",
            tags: ["ECOLOGY", "WATER"]
          },
          {
            id: "G9-U2-07",
            title: "Succession",
            description: "Primary and secondary ecological succession in habitats.",
            imageUrl: "https://picsum.photos/seed/succession/800/800",
            tags: ["ECOLOGY", "HABITAT"]
          },
          {
            id: "G9-U2-08",
            title: "Population Growth",
            description: "Exponential and logistic growth models in species.",
            imageUrl: "https://picsum.photos/seed/growth/800/800",
            tags: ["ECOLOGY", "POPULATION"]
          }
        ]
      }
    ]
  },
  {
    grade: "10",
    title: "Human Physiology & Genetics",
    icon: <LucideGlobe className="text-accent" />,
    units: [
      {
        name: "Unit 1: Human Systems",
        labels: [
          {
            id: "G10-U1-01",
            title: "Circulatory System",
            description: "Detailed anatomy of the human heart and blood vessels.",
            imageUrl: "https://picsum.photos/seed/heart/1200/800",
            tags: ["ANATOMY", "HEALTH"]
          },
          {
            id: "G10-U1-02",
            title: "Respiratory Exchange",
            description: "Mechanism of gas exchange within the alveoli.",
            imageUrl: "https://picsum.photos/seed/lungs/800/800",
            tags: ["PHYSIOLOGY", "GASES"]
          },
          {
            id: "G10-U1-03",
            title: "Digestive Tract",
            description: "Journey of food through the stomach and intestines.",
            imageUrl: "https://picsum.photos/seed/digestive/800/800",
            tags: ["PHYSIOLOGY", "NUTRITION"]
          },
          {
            id: "G10-U1-04",
            title: "Nervous System",
            description: "Central and peripheral nervous systems, brain and spinal cord.",
            imageUrl: "https://picsum.photos/seed/nerves/800/800",
            tags: ["ANATOMY", "NEURO"]
          },
          {
            id: "G10-U1-05",
            title: "Endocrine System",
            description: "Hormonal regulation and the function of glands.",
            imageUrl: "https://picsum.photos/seed/hormones/800/800",
            tags: ["PHYSIOLOGY", "HORMONES"]
          },
          {
            id: "G10-U1-06",
            title: "Muscular System",
            description: "Skeletal, smooth, and cardiac muscles.",
            imageUrl: "https://picsum.photos/seed/muscles/800/800",
            tags: ["ANATOMY", "MOVEMENT"]
          },
          {
            id: "G10-U1-07",
            title: "Skeletal System",
            description: "Structure of bones and their role in support.",
            imageUrl: "https://picsum.photos/seed/skeleton/800/800",
            tags: ["ANATOMY", "SUPPORT"]
          },
          {
            id: "G10-U1-08",
            title: "Excretory System",
            description: "Kidney function and waste removal processes.",
            imageUrl: "https://picsum.photos/seed/kidney/800/800",
            tags: ["PHYSIOLOGY", "WASTE"]
          },
          {
            id: "G10-U1-09",
            title: "Immune System",
            description: "White blood cells and the body's defense mechanisms.",
            imageUrl: "https://picsum.photos/seed/immune/800/800",
            tags: ["PHYSIOLOGY", "DEFENSE"]
          },
          {
            id: "G10-U1-10",
            title: "Reproductive System",
            description: "Anatomy and physiology of human reproduction.",
            imageUrl: "https://picsum.photos/seed/repro/800/800",
            tags: ["ANATOMY", "REPRO"]
          }
        ]
      },
      {
        name: "Unit 2: Classical Genetics",
        labels: [
          {
            id: "G10-U2-01",
            title: "Mendelian Genetics",
            description: "Punnett squares and the laws of inheritance.",
            imageUrl: "https://picsum.photos/seed/genetics/800/800",
            tags: ["HEREDITY", "DNA"]
          },
          {
            id: "G10-U2-02",
            title: "Meiosis Phases",
            description: "Two-stage cell division resulting in haploid cells.",
            imageUrl: "https://picsum.photos/seed/meiosis/800/800",
            tags: ["CELLS", "REPRODUCTION"]
          },
          {
            id: "G10-U2-03",
            title: "DNA Structure",
            description: "Double helix model showing base pairing.",
            imageUrl: "https://picsum.photos/seed/dna-struct/800/800",
            tags: ["MOLECULAR", "DNA"]
          },
          {
            id: "G10-U2-04",
            title: "Mutations",
            description: "Changes in chromosome structure or number.",
            imageUrl: "https://picsum.photos/seed/mutation/800/800",
            tags: ["GENETICS", "HEALTH"]
          },
          {
            id: "G10-U2-05",
            title: "Sex-Linked Traits",
            description: "Inheritance patterns on X and Y chromosomes.",
            imageUrl: "https://picsum.photos/seed/sexlinked/800/800",
            tags: ["HEREDITY", "GENETICS"]
          },
          {
            id: "G10-U2-06",
            title: "Pedigree Charts",
            description: "Tracking traits through generations in a family.",
            imageUrl: "https://picsum.photos/seed/pedigree/800/800",
            tags: ["HEREDITY", "FAMILY"]
          },
          {
            id: "G10-U2-07",
            title: "Genetic Engineering",
            description: "Introduction to modifying genetic material.",
            imageUrl: "https://picsum.photos/seed/geneticeng/800/800",
            tags: ["GENETICS", "TECH"]
          }
        ]
      }
    ]
  },
  {
    grade: "11",
    title: "Molecular Biology & Biochemistry",
    icon: <LucideAtom className="text-accent" />,
    units: [
      {
        name: "Unit 1: Biological Molecules",
        labels: [
          {
            id: "G11-U1-01",
            title: "Enzyme Action",
            description: "Lock-and-key model of catalytic protein function.",
            imageUrl: "https://picsum.photos/seed/enzyme/1200/800",
            tags: ["BIOCHEM", "PROTEINS"]
          },
          {
            id: "G11-U1-02",
            title: "Protein Folding",
            description: "Primary to quaternary structures of proteins.",
            imageUrl: "https://picsum.photos/seed/protein/800/800",
            tags: ["BIOCHEM", "STRUCTURE"]
          },
          {
            id: "G11-U1-03",
            title: "Lipid Bilayer",
            description: "Structure of phospholipids in cell membranes.",
            imageUrl: "https://picsum.photos/seed/lipids/800/800",
            tags: ["BIOCHEM", "CELLS"]
          },
          {
            id: "G11-U1-04",
            title: "Carbohydrates",
            description: "Monosaccharides to polysaccharides like starch.",
            imageUrl: "https://picsum.photos/seed/carbs/800/800",
            tags: ["BIOCHEM", "ENERGY"]
          },
          {
            id: "G11-U1-05",
            title: "Nucleic Acids",
            description: "Chemical components of DNA and RNA.",
            imageUrl: "https://picsum.photos/seed/nucleic/800/800",
            tags: ["BIOCHEM", "DNA"]
          },
          {
            id: "G11-U1-06",
            title: "Vitamins & Minerals",
            description: "Essential micronutrients for biological function.",
            imageUrl: "https://picsum.photos/seed/vitamins/800/800",
            tags: ["BIOCHEM", "NUTRITION"]
          },
          {
            id: "G11-U1-07",
            title: "Water Properties",
            description: "Hydrogen bonding and its biological importance.",
            imageUrl: "https://picsum.photos/seed/water/800/800",
            tags: ["BIOCHEM", "WATER"]
          }
        ]
      },
      {
        name: "Unit 2: Metabolic Processes",
        labels: [
          {
            id: "G11-U2-01",
            title: "Photosynthesis",
            description: "Light reactions and the Calvin Cycle.",
            imageUrl: "https://picsum.photos/seed/photosynthesis/800/800",
            tags: ["ENERGY", "PLANTS"]
          },
          {
            id: "G11-U2-02",
            title: "Cellular Respiration",
            description: "Glycolysis, Krebs Cycle, and ETC.",
            imageUrl: "https://picsum.photos/seed/respiration/800/800",
            tags: ["ENERGY", "METABOLISM"]
          },
          {
            id: "G11-U2-03",
            title: "ATP Synthesis",
            description: "Role of ATP synthase in energy production.",
            imageUrl: "https://picsum.photos/seed/atp/800/800",
            tags: ["ENERGY", "BIOCHEM"]
          },
          {
            id: "G11-U2-04",
            title: "Fermentation",
            description: "Anaerobic respiration in yeast and muscles.",
            imageUrl: "https://picsum.photos/seed/fermentation/800/800",
            tags: ["ENERGY", "METABOLISM"]
          },
          {
            id: "G11-U2-05",
            title: "Metabolic Regulation",
            description: "Control through feedback inhibition.",
            imageUrl: "https://picsum.photos/seed/regulation/800/800",
            tags: ["METABOLISM", "CONTROL"]
          },
          {
            id: "G11-U2-06",
            title: "Anabolism vs Catabolism",
            description: "Building up vs breaking down molecules.",
            imageUrl: "https://picsum.photos/seed/metabolism/800/800",
            tags: ["ENERGY", "METABOLISM"]
          }
        ]
      }
    ]
  },
  {
    grade: "12",
    title: "Advanced Biotechnology & Evolution",
    icon: <LucideCpu className="text-accent" />,
    units: [
      {
        name: "Unit 1: Modern Genetics",
        labels: [
          {
            id: "G12-U1-01",
            title: "CRISPR-Cas9",
            description: "Revolutionary system for precise genome editing.",
            imageUrl: "https://picsum.photos/seed/crispr/1200/800",
            tags: ["BIOTECH", "GENOMICS"]
          },
          {
            id: "G12-U1-02",
            title: "Electrophoresis",
            description: "Separating DNA fragments by size.",
            imageUrl: "https://picsum.photos/seed/dna-gel/800/800",
            tags: ["BIOTECH", "LAB"]
          },
          {
            id: "G12-U1-03",
            title: "PCR",
            description: "Amplifying specific DNA sequences.",
            imageUrl: "https://picsum.photos/seed/pcr/800/800",
            tags: ["BIOTECH", "LAB"]
          },
          {
            id: "G12-U1-04",
            title: "Recombinant DNA",
            description: "Combining DNA from different sources.",
            imageUrl: "https://picsum.photos/seed/recombinant/800/800",
            tags: ["BIOTECH", "GENETICS"]
          },
          {
            id: "G12-U1-05",
            title: "Stem Cells",
            description: "Potential in regenerative medicine.",
            imageUrl: "https://picsum.photos/seed/stemcell/800/800",
            tags: ["BIOTECH", "HEALTH"]
          },
          {
            id: "G12-U1-06",
            title: "DNA Sequencing",
            description: "Determining the order of nucleotides.",
            imageUrl: "https://picsum.photos/seed/sequencing/800/800",
            tags: ["BIOTECH", "GENOMICS"]
          },
          {
            id: "G12-U1-07",
            title: "Cloning",
            description: "Creating genetically identical copies.",
            imageUrl: "https://picsum.photos/seed/cloning/800/800",
            tags: ["BIOTECH", "GENETICS"]
          }
        ]
      },
      {
        name: "Unit 2: Evolutionary Biology",
        labels: [
          {
            id: "G12-U2-01",
            title: "Phylogeny",
            description: "Mapping evolutionary relationships.",
            imageUrl: "https://picsum.photos/seed/evolution/800/800",
            tags: ["EVOLUTION", "TAXONOMY"]
          },
          {
            id: "G12-U2-02",
            title: "Natural Selection",
            description: "Darwin's theory of adaptation.",
            imageUrl: "https://picsum.photos/seed/darwin/800/800",
            tags: ["EVOLUTION", "ADAPTATION"]
          },
          {
            id: "G12-U2-03",
            title: "Speciation",
            description: "Formation of new and distinct species.",
            imageUrl: "https://picsum.photos/seed/species/800/800",
            tags: ["EVOLUTION", "BIODIVERSITY"]
          },
          {
            id: "G12-U2-04",
            title: "Evolution Evidence",
            description: "Fossil records and molecular biology.",
            imageUrl: "https://picsum.photos/seed/evidence/800/800",
            tags: ["EVOLUTION", "SCIENCE"]
          },
          {
            id: "G12-U2-05",
            title: "Population Genetics",
            description: "Hardy-Weinberg principle and variation.",
            imageUrl: "https://picsum.photos/seed/population/800/800",
            tags: ["EVOLUTION", "GENETICS"]
          },
          {
            id: "G12-U2-06",
            title: "Coevolution",
            description: "Species evolving in response to each other.",
            imageUrl: "https://picsum.photos/seed/coevolution/800/800",
            tags: ["EVOLUTION", "INTERACTION"]
          },
          {
            id: "G12-U2-07",
            title: "Human Evolution",
            description: "The evolutionary history of primates and humans.",
            imageUrl: "https://picsum.photos/seed/humanevo/800/800",
            tags: ["EVOLUTION", "ANTHRO"]
          }
        ]
      }
    ]
  }
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<any>(null);

  const playClickSound = () => {
    const audio = new Audio(CLICK_SOUND);
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio play blocked"));
  };

  const handleLabelClick = (label: any) => {
    playClickSound();
    setSelectedLabel(label);
  };
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const filteredData = useMemo(() => {
    if (!searchQuery) return GRADES_DATA;
    
    const query = searchQuery.toLowerCase();
    return GRADES_DATA.map(grade => ({
      ...grade,
      units: grade.units.map(unit => ({
        ...unit,
        labels: unit.labels.filter(label => 
          label.title.toLowerCase().includes(query) || 
          label.description.toLowerCase().includes(query) ||
          label.tags.some(tag => tag.toLowerCase().includes(query))
        )
      })).filter(unit => unit.labels.length > 0)
    })).filter(grade => grade.units.length > 0);
  }, [searchQuery]);

  return (
    <main className={`relative selection:bg-accent selection:text-bg transition-colors duration-700 ${theme}`}>
      <Toaster position="bottom-right" theme={theme} />
      <div className="scanline" />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[100] shadow-[0_0_10px_var(--color-accent)]"
        style={{ scaleX }}
      />
      
      <ScrollIndicator grades={GRADES_DATA} />
      <ThreeBackground theme={theme} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="z-10 text-center px-6"
        >
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
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-accent/40"
        >
          <LucideArrowDown size={24} />
        </motion.div>
      </section>

      {/* Navigation & Search Bar */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto">
            {GRADES_DATA.map((g) => (
              <a 
                key={g.grade} 
                href={`#grade-${g.grade}`}
                className="group flex items-center gap-2 md:gap-3 whitespace-nowrap"
              >
                <div className="p-1.5 md:p-2 rounded-lg bg-accent/5 border border-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-all">
                  {g.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[10px] font-mono text-text/20 group-hover:text-accent transition-colors">
                    SECTOR {g.grade}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text/40 group-hover:text-text transition-colors">
                    Grade {g.grade}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 lg:w-96 group">
              <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/30 group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface/50 border border-border text-sm focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono text-accent/60 bg-accent/5 px-1.5 py-0.5 rounded">
                  {filteredData.reduce((acc, g) => acc + g.units.reduce((uAcc, u) => uAcc + u.labels.length, 0), 0)}
                </div>
              )}
            </div>

            {/* Theme Toggle - Integrated */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface border border-border text-accent hover:scale-105 transition-all shadow-sm backdrop-blur-md flex-shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <LucideSun size={18} /> : <LucideMoon size={18} />}
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

                {grade.units.map((unit, idx) => (
                  <UnitSection
                    key={unit.name}
                    id={`unit-${unit.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    grade={grade.grade}
                    title={unit.name}
                    labels={unit.labels}
                    onLabelClick={handleLabelClick}
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
              <h3 className="text-2xl font-bold mb-2 text-glow-accent">Biology Explorer</h3>
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
                  <li 
                    onClick={() => document.getElementById('grade-09')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Grade 9: Foundations
                  </li>
                  <li 
                    onClick={() => document.getElementById('grade-10')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Grade 10: Physiology
                  </li>
                  <li 
                    onClick={() => document.getElementById('grade-11')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Grade 11: Molecular
                  </li>
                  <li 
                    onClick={() => document.getElementById('grade-12')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Grade 12: Biotech
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-4">Legal</h4>
                <ul className="space-y-2 text-xs text-text/30">
                  <li 
                    onClick={() => toast.info('Privacy Policy is currently under review.')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Privacy Policy
                  </li>
                  <li 
                    onClick={() => toast.info('Terms of Use are available upon request.')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    Terms of Use
                  </li>
                  <li 
                    onClick={() => toast.info('All content is licensed for educational use.')}
                    className="hover:text-text cursor-pointer transition-colors"
                  >
                    License
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
            <p className="text-[10px] font-mono text-text/20 uppercase tracking-widest">
              &copy; 2026 Biology Visual Repository. All rights reserved.
            </p>
            <div className="flex gap-6">
              <LucideCpu size={16} className="text-text/10" />
              <LucideGlobe size={16} className="text-text/10" />
              <LucideAtom size={16} className="text-text/10" />
            </div>
          </div>
        </div>
      </footer>
      <LabelDetailsModal 
        label={selectedLabel} 
        onClose={() => setSelectedLabel(null)} 
      />
    </main>
  );
}
