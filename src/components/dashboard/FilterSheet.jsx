import React, { useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const FilterSheet = ({ isOpen, onOpenChange, onFilterChange, filters, onResetFilters, stories }) => {
  const categories = useMemo(() => {
    if (!stories) return [];
    const uniqueCategories = [...new Set(stories.map(story => story.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [stories]);

  const handleFilter = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const showReset = filters.level !== 'all' || filters.category !== 'all' || filters.readTime !== 'all' || filters.rating !== 'all';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Hikayeleri Filtrele</SheetTitle>
          <SheetDescription>
            Aramanı daraltmak için aşağıdaki seçenekleri kullan.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="level">📊 Seviye</Label>
            <Select value={filters.level} onValueChange={(value) => handleFilter('level', value)}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Seviye seç" />
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">📚 Kategori</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilter('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="readTime">⏱️ Okuma Süresi</Label>
            <Select value={filters.readTime} onValueChange={(value) => handleFilter('readTime', value)}>
              <SelectTrigger id="readTime">
                <SelectValue placeholder="Okuma süresi seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Süreler</SelectItem>
                <SelectItem value="short">Kısa (10-15 dk)</SelectItem>
                <SelectItem value="medium">Orta (15-20 dk)</SelectItem>
                <SelectItem value="long">Uzun (20+ dk)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rating">⭐ Puan</Label>
            <Select value={filters.rating} onValueChange={(value) => handleFilter('rating', value)}>
              <SelectTrigger id="rating">
                <SelectValue placeholder="Puana göre sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Puanlar</SelectItem>
                <SelectItem value="4+">4+ Puan</SelectItem>
                <SelectItem value="3+">3+ Puan</SelectItem>
                <SelectItem value="2+">2+ Puan</SelectItem>
                <SelectItem value="1+">1+ Puan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-row gap-2">
          {showReset && (
            <Button variant="outline" onClick={() => { onResetFilters(); onOpenChange(false); }}>
              <X className="mr-2 h-4 w-4" />
              Filtreleri Temizle
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} className="w-full">Uygula</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;