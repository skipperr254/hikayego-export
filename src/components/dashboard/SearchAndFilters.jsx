import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Dice5 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SearchAndFilters = ({ onSearchChange, onFilterChange, filters, onResetFilters, currentSearchTerm, onRandomStoryClick, stories }) => {
  const categories = useMemo(() => {
    if (!stories) return [];
    const uniqueCategories = [...new Set(stories.map(story => story.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [stories]);

  const handleFilter = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const showReset = currentSearchTerm || filters.level !== 'all' || filters.category !== 'all' || filters.readTime !== 'all' || filters.rating !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex w-full flex-col md:flex-row items-center gap-2">
        <div className="relative flex-grow w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 transition-colors duration-300 group-focus-within:text-primary" />
          <Input
            type="text"
            placeholder="Hikaye ara..."
            className="pl-10 pr-14 w-full h-12 text-foreground bg-background/80 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            onChange={(e) => onSearchChange(e.target.value)}
            value={currentSearchTerm}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  className="relative h-9 w-9 rounded-full overflow-visible
                                     bg-gradient-to-br from-purple-500 to-indigo-600
                                     text-white shadow-md
                                     flex items-center justify-center
                                     hover:from-purple-600 hover:to-indigo-700
                                     active:scale-95 transition-all duration-200 ease-out"
                  onClick={onRandomStoryClick}
                  whileHover="hover"
                  whileTap="tap"
                  initial="initial"
                  animate="initial"
                >
                  <Dice5 className="h-5 w-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rastgele Hikaye</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute inset-0 rounded-lg border-2 border-transparent group-focus-within:border-primary pointer-events-none transition-all duration-300 -z-10 group-focus-within:animate-pulse-once"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <Select value={filters.level} onValueChange={(value) => handleFilter('level', value)}>
          <SelectTrigger className="bg-background/80 h-11">
            <SelectValue placeholder="Seviye" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Seviyeler</SelectItem>
            <SelectItem value="a1">A1</SelectItem>
            <SelectItem value="a2">A2</SelectItem>
            <SelectItem value="b1">B1</SelectItem>
            <SelectItem value="b2">B2</SelectItem>
            <SelectItem value="c1">C1</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.category} onValueChange={(value) => handleFilter('category', value)}>
          <SelectTrigger className="bg-background/80 h-11">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.readTime} onValueChange={(value) => handleFilter('readTime', value)}>
          <SelectTrigger className="bg-background/80 h-11">
            <SelectValue placeholder="Okuma Süresi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Süreler</SelectItem>
            <SelectItem value="short">Kısa (10-15 dk)</SelectItem>
            <SelectItem value="medium">Orta (15-20 dk)</SelectItem>
            <SelectItem value="long">Uzun (20+ dk)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.rating} onValueChange={(value) => handleFilter('rating', value)}>
          <SelectTrigger className="bg-background/80 h-11">
            <SelectValue placeholder="Puan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Puanlar</SelectItem>
            <SelectItem value="4+">4+ Puan</SelectItem>
            <SelectItem value="3+">3+ Puan</SelectItem>
            <SelectItem value="2+">2+ Puan</SelectItem>
            <SelectItem value="1+">1+ Puan</SelectItem>
          </SelectContent>
        </Select>
        {showReset && (
          <Button variant="ghost" onClick={onResetFilters} className="h-11 bg-background/80 hover:bg-background/90 text-muted-foreground hover:text-foreground">
            <X className="mr-2 h-4 w-4" />
            Temizle
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchAndFilters;