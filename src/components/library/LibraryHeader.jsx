import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, BookOpen, Feather, BrainCircuit, Dice5, SlidersHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FilterSheet from '@/components/dashboard/FilterSheet';

const AnimatedShape = ({ icon: Icon, className, duration, delay }) => (
    <motion.div
        className={`absolute text-white/10 ${className}`}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
            type: 'spring', 
            stiffness: 100, 
            damping: 10, 
            delay: delay 
        }}
    >
        <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
            <Icon className="h-full w-full" />
        </motion.div>
    </motion.div>
);

const ActionButton = ({ onClick, children, tooltipText, isDice = false }) => {
    const buttonVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const iconVariants = {
        rest: { rotate: 0, scale: 1 },
        hover: isDice 
            ? { rotate: [0, -15, 15, -15, 15, 0], transition: { duration: 0.4 } }
            : { scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } },
        tap: { scale: 0.9 }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.button
                    type="button"
                    onClick={onClick}
                    className="relative h-9 w-9 rounded-full
                               bg-gradient-to-br from-purple-500 to-indigo-600
                               text-white shadow-md
                               flex items-center justify-center group overflow-hidden"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                >
                    <motion.span
                        className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span className="relative z-10" variants={iconVariants}>
                        {children}
                    </motion.span>
                </motion.button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
};

const LibraryHeader = ({ onSearchChange, onFilterChange, filters, onResetFilters, currentSearchTerm, onRandomStoryClick, stories }) => {
    const { profile } = useAuth();
    const isMobile = useMediaQuery('(max-width: 767px)');
    const displayName = profile?.name?.split(' ')[0] || 'Gezgin';
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} 
                className="relative overflow-hidden rounded-2xl bg-primary/90 p-6 text-primary-foreground shadow-lg mb-8"
            >
                <div className="absolute inset-0 z-0">
                    <AnimatedShape icon={BookOpen} className="-left-4 -top-4 h-24 w-24" duration={12} delay={0.1} />
                    <AnimatedShape icon={Feather} className="-right-8 -bottom-8 h-32 w-32" duration={15} delay={0.3} />
                    <AnimatedShape icon={BrainCircuit} className="right-1/3 top-0 h-16 w-16" duration={10} delay={0.5} />
                    <AnimatedShape icon={Sparkles} className="left-1/4 bottom-0 h-20 w-20" duration={18} delay={0.7} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold">Yeteneklerini Geliştir, {displayName}!</h2>
                        <p className="mt-1 max-w-2xl text-lg text-primary-foreground/80">Yeni hikayeler keşfet ve öğrenmeye başla.</p>
                    </div>
                    
                    <div className="flex w-full flex-col md:flex-row items-center gap-2">
                        <div className="relative flex-grow w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 transition-colors duration-300 group-focus-within:text-primary" />
                            <Input
                                type="text"
                                placeholder="Hikaye ara..."
                                className="pl-10 pr-12 md:pr-24 w-full h-12 text-foreground bg-background/80 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                                onChange={(e) => onSearchChange(e.target.value)}
                                value={currentSearchTerm}
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                {isMobile ? (
                                    <ActionButton onClick={onRandomStoryClick} tooltipText="Rastgele Hikaye" isDice={true}>
                                        <Dice5 className="h-5 w-5" />
                                    </ActionButton>
                                ) : (
                                    <>
                                        <ActionButton onClick={onRandomStoryClick} tooltipText="Rastgele Hikaye" isDice={true}>
                                            <Dice5 className="h-5 w-5" />
                                        </ActionButton>
                                        <ActionButton onClick={() => setIsFilterSheetOpen(true)} tooltipText="Filtrele">
                                            <SlidersHorizontal className="h-5 w-5" />
                                        </ActionButton>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>
            <FilterSheet
                isOpen={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
                onFilterChange={onFilterChange}
                filters={filters}
                onResetFilters={onResetFilters}
                stories={stories}
            />
        </>
    );
};

export default LibraryHeader;