import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Layers, Copy, Puzzle, Keyboard,
  ChevronRight, ChevronLeft, Loader2, Download, Trash2, Edit2,
  Star, FolderPlus, ListPlus, FileText, X,
  Volume2, CheckCircle2, AlertCircle, MoreVertical, CheckSquare
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useActivitiesData } from '@/hooks/useActivitiesData';
import { supabase } from '@/lib/customSupabaseClient';
import Seo from '@/components/Seo';
import ErrorBoundary from '@/components/ErrorBoundary';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWordnikPronunciation } from '@/hooks/useWordnikPronunciation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PremiumAccessModal from '@/components/modals/PremiumAccessModal';
import { cn } from '@/lib/utils';

const WORDS_PER_PAGE = 24;
const BULK_ADD_LIMIT = 50;
const MAX_CHARS_PER_LINE = 500;
const MAX_CATEGORIES = 100;
const COOLDOWN_SECONDS = 30;

const CATEGORY_COLORS = [
  'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800/50 dark:text-blue-400',
  'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800/50 dark:text-purple-400',
  'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800/50 dark:text-emerald-400',
  'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800/50 dark:text-amber-400',
  'bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800/50 dark:text-pink-400',
  'bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:border-cyan-800/50 dark:text-cyan-400',
  'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800/50 dark:text-rose-400',
  'bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800/50 dark:text-indigo-400',
];

const CATEGORY_PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#64748b',
];

const modes = [
  { id: 'flashcards', name: 'Flashcards', path: '/activities/flashcards', icon: Layers, color: 'text-blue-500', bg: 'bg-[#E9EEFF] dark:bg-[#E9EEFF]/20' },
  { id: 'quiz', name: 'Quiz / Öğren', path: '/quiz/setup', icon: Puzzle, color: 'text-purple-500', bg: 'bg-[#F1E8FF] dark:bg-[#F1E8FF]/20' },
  { id: 'matching', name: 'Eşleştirme', path: '/activities/matching-game', icon: Copy, color: 'text-orange-500', bg: 'bg-[#FFE9DD] dark:bg-[#FFE9DD]/20' },
  { id: 'wordle', name: 'Wordle', path: '/wordle', icon: Keyboard, color: 'text-green-500', bg: 'bg-[#E6FFF4] dark:bg-[#E6FFF4]/20' }
];

const CardDoodle = ({ type }) => {
  const doodles = {
    flashcards: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2B2F38" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 opacity-[0.12] pointer-events-none">
        <rect x="4" y="10" width="12" height="8" rx="1" />
        <path d="M8 7h12a1 1 0 0 1 1 1v8" />
        <path d="M12 4h8a1 1 0 0 1 1 1v6" />
      </svg>
    ),
    quiz: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2B2F38" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 opacity-[0.12] pointer-events-none">
        <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" /><path d="M12 15a4 4 0 1 0-4-4" /><path d="M4 8l1 1" /><path d="M19 8l-1 1" /><path d="M4 16l1-1" /><path d="M19 16l-1-1" />
      </svg>
    ),
    matching: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2B2F38" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 opacity-[0.12] pointer-events-none">
        <circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" />
      </svg>
    ),
    wordle: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2B2F38" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 opacity-[0.12] pointer-events-none">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M15 3v18" /><path d="M3 9h18" /><path d="M3 15h18" />
      </svg>
    )
  };
  return doodles[type] || null;
};

const ResponsiveModal = ({ isOpen, setIsOpen, title, description, children, footer, compact }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={`${compact ? 'sm:max-w-md' : 'sm:max-w-md'} rounded-[2rem] p-8 z-[100]`}>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-black break-words overflow-hidden text-ellipsis">{title}</DialogTitle>
            {description && <DialogDescription className="text-base mt-1">{description}</DialogDescription>}
          </DialogHeader>
          <div className="py-2">{children}</div>
          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 mt-4">
            {footer}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" onOpenAutoFocus={(e) => e.preventDefault()} className="rounded-t-[2rem] p-6 pt-6 pb-10 max-h-[90vh] overflow-y-auto z-[100]">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-black break-words overflow-hidden text-ellipsis">{title}</SheetTitle>
          {description && <SheetDescription className="text-base mt-1">{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-2">{children}</div>
        <div className="flex flex-col gap-3 mt-8">
          {footer}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ActivitiesPage = () => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { playPronunciation } = useWordnikPronunciation();
  const [pronouncingWord, setPronouncingWord] = useState(null);
  const handleWordPronounce = useCallback(async (word) => {
    setPronouncingWord(word);
    await playPronunciation(word);
    setPronouncingWord(null);
  }, [playPronunciation]);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const { words, setWords, categories, setCategories, loading, error } = useActivitiesData(user, canAccessPremiumFeatures);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWords, setSelectedWords] = useState([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState(CATEGORY_PRESET_COLORS[8]);
  const [isCreatingList, setIsCreatingList] = useState(false);

  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [newWordData, setNewWordData] = useState({ word: '', translation: '', category_id: 'none' });
  const [isAddingWord, setIsAddingWord] = useState(false);

  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [bulkAddText, setBulkAddText] = useState('');
  const [bulkAddCategory, setBulkAddCategory] = useState('none');
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkAddCooldown, setBulkAddCooldown] = useState(0);

  const [isBulkTransferOpen, setIsBulkTransferOpen] = useState(false);
  const [bulkTransferCategory, setBulkTransferCategory] = useState('none');
  const [isBulkTransferring, setIsBulkTransferring] = useState(false);

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [editingWord, setEditingWord] = useState(null);
  const [isEditWordOpen, setIsEditWordOpen] = useState(false);
  const [isUpdatingWord, setIsUpdatingWord] = useState(false);

  const [wordToDelete, setWordToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const carouselRef = useRef(null);
  const isScrolling = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [foxLoaded, setFoxLoaded] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuClickTimer = useRef(null);

  // Helper to completely clean up lingering generic radix UI lock styles
  const cleanupModals = useCallback(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-locked');
    }, 200);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat === 'uncategorized' ? 'uncategorized' : cat);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (bulkAddCooldown > 0) {
      const timer = setTimeout(() => setBulkAddCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [bulkAddCooldown]);

  const handleMenuClick = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (menuClickTimer.current) {
      clearTimeout(menuClickTimer.current);
    }

    menuClickTimer.current = setTimeout(() => {
      setOpenMenuId(prev => prev === id ? null : id);
    }, 50);
  }, []);

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

    const itemWidth = 200;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveModeIndex(Math.min(index, modes.length - 1));
  }, []);

  useEffect(() => {
    handleCarouselScroll();
    window.addEventListener('resize', handleCarouselScroll);
    return () => window.removeEventListener('resize', handleCarouselScroll);
  }, [handleCarouselScroll]);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current || isScrolling.current) return;

    if (direction === 'left' && !canScrollLeft) return;
    if (direction === 'right' && !canScrollRight) return;

    isScrolling.current = true;
    const scrollAmount = direction === 'left' ? -200 : 200;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(() => {
      isScrolling.current = false;
      handleCarouselScroll();
    }, 400);
  };

  const handlePremiumAction = useCallback((actionFn) => {
    if (!canAccessPremiumFeatures) {
      setIsPremiumModalOpen(true);
      setIsMobileMenuOpen(false);
    } else {
      actionFn();
      setIsMobileMenuOpen(false);
    }
  }, [canAccessPremiumFeatures]);

  const updateCategoryUrl = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSelectedWords([]);
    const params = new URLSearchParams(location.search);
    if (category === 'all') params.delete('category');
    else params.set('category', category);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [navigate, location.pathname, location.search]);

  const filteredWords = useMemo(() => {
    if (!words) return [];
    return words.filter(word => {
      const matchSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (word.translation && word.translation.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'all' ? true
        : selectedCategory === 'uncategorized' ? !word.category_id
          : word.category_id === parseInt(selectedCategory);
      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (a.is_starred && !b.is_starred) return -1;
      if (!a.is_starred && b.is_starred) return 1;
      return new Date(b.added_at) - new Date(a.added_at);
    });
  }, [words, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredWords.length / WORDS_PER_PAGE);
  const paginatedWords = filteredWords.slice((currentPage - 1) * WORDS_PER_PAGE, currentPage * WORDS_PER_PAGE);

  const toggleWordSelection = (id) => {
    setSelectedWords(prev => prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedWords(paginatedWords.map(w => w.id));
    } else {
      setSelectedWords([]);
    }
  };

  const handleCreateList = async () => {
    if (categories.length >= MAX_CATEGORIES) {
      toast({ title: "Limit Aşıldı", description: `En fazla ${MAX_CATEGORIES} liste oluşturabilirsiniz.`, variant: "destructive" });
      return;
    }
    if (!newListName.trim() || newListName.trim().length < 2) {
      toast({ title: "Geçersiz Ad", description: "Liste adı en az 2 karakter olmalıdır.", variant: "destructive" });
      return;
    }
    setIsCreatingList(true);
    try {
      const { data, error } = await supabase
        .from('word_categories')
        .insert({ user_id: user.id, name: newListName.trim(), color: newListColor })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [data, ...prev]);
      toast({ title: "Başarılı", description: "Liste başarıyla oluşturuldu!" });
      setNewListName('');
      setNewListColor(CATEGORY_PRESET_COLORS[8]);
      setIsCreateListOpen(false);
      updateCategoryUrl(data.id.toString());
    } catch (err) {
      toast({ title: "Hata", description: err.message || "Liste oluşturulurken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await supabase.from('user_saved_words').update({ category_id: null }).eq('category_id', categoryToDelete.id);
      const { error } = await supabase.from('word_categories').delete().eq('id', categoryToDelete.id);
      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setWords(prev => prev.map(w => w.category_id === categoryToDelete.id ? { ...w, category_id: null } : w));

      if (selectedCategory === categoryToDelete.id.toString()) updateCategoryUrl('all');
      toast({ title: "Başarılı", description: "Kategori başarıyla silindi." });
    } catch (err) {
      toast({ title: "Hata", description: "Kategori silinirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setCategoryToDelete(null);
      cleanupModals();
    }
  };

  const handleAddWord = async () => {
    const { word, translation, category_id } = newWordData;
    if (!word.trim() || !translation.trim()) {
      toast({ title: "Eksik Bilgi", description: "Kelime ve çevirisi zorunludur.", variant: "destructive" });
      return;
    }

    setIsAddingWord(true);
    try {
      const { data: existing } = await supabase
        .from('user_saved_words')
        .select('id')
        .eq('user_id', user.id)
        .ilike('word', word.trim())
        .maybeSingle();

      if (existing) {
        toast({ title: "Zaten Mevcut", description: "Bu kelime zaten eklenmiş.", variant: "destructive" });
        setIsAddingWord(false);
        return;
      }

      const insertData = {
        user_id: user.id,
        word: word.trim(),
        translation: translation.trim(),
        category_id: category_id === 'none' ? null : parseInt(category_id),
        correct_count: 0,
        incorrect_count: 0,
        is_starred: false,
        is_learned: false
      };

      const { data, error } = await supabase.from('user_saved_words').insert(insertData).select().single();
      if (error) throw error;

      setWords(prev => [data, ...prev]);
      toast({ title: "Başarılı", description: "Kelime eklendi!" });
      setNewWordData({ word: '', translation: '', category_id: selectedCategory !== 'all' && selectedCategory !== 'uncategorized' ? selectedCategory : 'none' });
      setIsAddWordOpen(false);
    } catch (err) {
      toast({ title: "Hata", description: "Kelime eklenemedi.", variant: "destructive" });
    } finally {
      setIsAddingWord(false);
    }
  };

  const openEditModal = (word) => {
    setEditingWord({ ...word });
    setIsEditWordOpen(true);
    setOpenMenuId(null);
  };

  const handleUpdateWord = async () => {
    if (!editingWord.word.trim() || !editingWord.translation.trim()) {
      toast({ title: "Eksik Bilgi", description: "Kelime ve çevirisi boş olamaz.", variant: "destructive" });
      return;
    }
    setIsUpdatingWord(true);
    try {
      const updateData = {
        word: editingWord.word.trim(),
        translation: editingWord.translation.trim(),
        category_id: editingWord.category_id === 'none' ? null : (editingWord.category_id ? parseInt(editingWord.category_id) : null),
      };

      const { error } = await supabase.from('user_saved_words').update(updateData).eq('id', editingWord.id);
      if (error) throw error;

      setWords(prev => prev.map(w => w.id === editingWord.id ? { ...w, ...updateData } : w));
      toast({ title: "Başarılı", description: "Kelime başarıyla güncellendi." });
      setIsEditWordOpen(false);
      setSelectedWords([]);
    } catch (err) {
      toast({ title: "Hata", description: "Kelime güncellenemedi.", variant: "destructive" });
    } finally {
      setIsUpdatingWord(false);
    }
  };

  const handleDeleteWord = async () => {
    if (!wordToDelete) return;
    try {
      const { error } = await supabase.from('user_saved_words').delete().eq('id', wordToDelete);
      if (error) throw error;
      setWords(prev => prev.filter(w => w.id !== wordToDelete));
      setSelectedWords(prev => prev.filter(id => id !== wordToDelete));
      toast({ title: "Silindi", description: "Kelime başarıyla silindi." });
    } catch (err) {
      toast({ title: "Hata", description: "Silme işlemi başarısız.", variant: "destructive" });
    } finally {
      setWordToDelete(null);
      cleanupModals();
    }
  };

  const handleToggleStar = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from('user_saved_words').update({ is_starred: !currentStatus }).eq('id', id);
      if (error) throw error;
      setWords(prev => prev.map(w => w.id === id ? { ...w, is_starred: !currentStatus } : w));
    } catch (err) {
      toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" });
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkAddText.trim()) return;
    if (bulkAddCooldown > 0) return;

    setIsBulkAdding(true);
    try {
      const rawLines = bulkAddText.split('\n');

      if (rawLines.length > BULK_ADD_LIMIT) {
        toast({
          title: "Limit Aşıldı",
          description: `Tek seferde en fazla ${BULK_ADD_LIMIT} kelime ekleyebilirsiniz. Lütfen listenizi bölün.`,
          variant: "destructive"
        });
        setIsBulkAdding(false);
        return;
      }

      const wordsToAdd = [];
      const existingWords = new Set(words.map(w => w.word.toLowerCase()));
      let duplicateCount = 0;
      let invalidLengthCount = 0;

      for (const line of rawLines) {
        if (line.length > MAX_CHARS_PER_LINE) {
          invalidLengthCount++;
          continue;
        }

        const parts = line.split(/[,;\t]|\s{2,}| - | \/ /).map(p => p.trim()).filter(Boolean);

        if (parts.length >= 2) {
          const englishWord = parts[0].replace(/[^\w\s-]/g, '').slice(0, 25);
          const translation = parts[1].replace(/[<>]/g, '').slice(0, 35);

          if (!englishWord || !translation) continue;

          if (existingWords.has(englishWord.toLowerCase())) {
            duplicateCount++;
            continue;
          }

          wordsToAdd.push({
            user_id: user.id,
            word: englishWord,
            translation: translation,
            category_id: bulkAddCategory === 'none' ? null : parseInt(bulkAddCategory),
            correct_count: 0, incorrect_count: 0, is_starred: false, is_learned: false
          });

          existingWords.add(englishWord.toLowerCase());
        }
      }

      if (wordsToAdd.length === 0) {
        let msg = "Geçerli kelime bulunamadı. Lütfen 'ingilizce, türkçe' formatını kullanın.";
        if (duplicateCount > 0) msg = `${duplicateCount} kelime zaten listenizde mevcut. Yeni kelime bulunamadı.`;
        if (invalidLengthCount > 0) msg = "Kelime girişleri çok uzun (Max 500 karakter).";

        toast({ title: "İşlem Yapılmadı", description: msg, variant: "destructive" });
        setIsBulkAdding(false);
        return;
      }

      const { data, error } = await supabase.from('user_saved_words').insert(wordsToAdd).select();
      if (error) throw error;

      setWords(prev => [...data, ...prev]);

      let successMsg = `${data.length} kelime topluca eklendi!`;
      if (duplicateCount > 0) successMsg += ` (${duplicateCount} kelime atlandı.)`;

      toast({ title: "Başarılı", description: successMsg });
      setBulkAddText('');
      setIsBulkAddOpen(false);
      setBulkAddCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      toast({ title: "Hata", description: "Toplu ekleme sırasında bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsBulkAdding(false);
    }
  };

  const handleBulkTransfer = async () => {
    if (selectedWords.length === 0) return;
    setIsBulkTransferring(true);
    try {
      const targetCategoryId = bulkTransferCategory === 'none' ? null : parseInt(bulkTransferCategory);

      const { error } = await supabase
        .from('user_saved_words')
        .update({ category_id: targetCategoryId })
        .in('id', selectedWords)
        .eq('user_id', user.id);

      if (error) throw error;

      setWords(prev => prev.map(w => selectedWords.includes(w.id) ? { ...w, category_id: targetCategoryId } : w));
      toast({ title: "Başarılı", description: `${selectedWords.length} kelime başarıyla taşındı.` });
      setIsBulkTransferOpen(false);
      setSelectedWords([]);
    } catch (err) {
      toast({ title: "Hata", description: "Kelimeler taşınırken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsBulkTransferring(false);
      cleanupModals();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedWords.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const { error } = await supabase.from('user_saved_words').delete().in('id', selectedWords);
      if (error) throw error;

      setWords(prev => prev.filter(w => !selectedWords.includes(w.id)));
      toast({ title: "Başarılı", description: "Seçili kelimeler başarıyla silindi." });
      setIsBulkDeleteOpen(false);
      setSelectedWords([]);
    } catch (err) {
      toast({ title: "Hata", description: "Kelimeler silinirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsBulkDeleting(false);
      cleanupModals();
    }
  };

  const handleDownloadCSV = () => {
    if (!isDesktop) return;
    if (filteredWords.length === 0) {
      toast({ title: "Boş Liste", description: "İndirilecek kelime bulunamadı.", variant: "destructive" });
      return;
    }

    const headers = ["İngilizce", "Türkçe", "Kategori", "Eklenme Tarihi", "Durum"];
    const rows = filteredWords.map(w => {
      const cat = categories.find(c => c.id === w.category_id);
      const catName = cat ? cat.name : 'Kategorisiz';
      const status = w.is_learned ? 'Öğrenildi' : w.is_starred ? 'Favori' : 'Öğreniliyor';
      const date = new Date(w.added_at).toLocaleDateString('tr-TR');
      const escape = (text) => `"${(text || '').replace(/"/g, '""')}"`;
      return [escape(w.word), escape(w.translation), escape(catName), escape(date), escape(status)].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split('T')[0];
    const listName = getCategoryName(selectedCategory).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${listName}_${dateStr}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Başarılı", description: "Kelimeler başarıyla indirildi." });
  };

  const getCategoryName = (id) => {
    if (id === 'all') return 'Tüm Kelimeler';
    if (id === 'uncategorized') return 'Kategorisiz';
    const cat = categories?.find(c => c.id.toString() === id.toString());
    return cat ? cat.name : 'Tüm Kelimeler';
  };

  const getCategoryColor = (id) => {
    if (!id) return 'bg-secondary text-secondary-foreground border-border';
    return CATEGORY_COLORS[id % CATEGORY_COLORS.length];
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Kelimeleriniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <div className="text-center bg-destructive/10 p-8 rounded-3xl border border-destructive/20 max-w-md">
          <p className="text-destructive font-bold mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="h-12 min-w-[120px]">Sayfayı Yenile</Button>
        </div>
      </div>
    );
  }

  const isAllPaginatedSelected = paginatedWords.length > 0 && selectedWords.length >= paginatedWords.length && paginatedWords.every(w => selectedWords.includes(w.id));

  return (
    <ErrorBoundary>
      <Seo title="Aktiviteler & Kelimelerim | HikayeGO" description="Kaydettiğiniz kelimeleri yönetin ve aktivitelerle pratik yapın." />
      <TooltipProvider>
        <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans relative pb-28 lg:pb-0">

          <style>{`
            @keyframes shine {
              0% { transform: translateX(-200%) skewX(-20deg); }
              100% { transform: translateX(200%) skewX(-20deg); }
            }
            .shine-effect {
              position: relative;
              overflow: hidden;
            }
            @media (min-width: 1024px) {
              .shine-effect:hover::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
                animation: shine 1.5s ease-in-out;
                pointer-events: none;
                z-index: 20;
              }
            }
            .doodle-bg-container {
               position: absolute;
               inset: 0;
               pointer-events: none;
               overflow: hidden;
               opacity: 0.15;
            }
            .doodle-bg {
               position: absolute;
               inset: 0;
               background-image: url('https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/b6301ca504304241b82102d60aedd0e5.png');
               background-size: 250px;
               background-repeat: repeat;
               background-position: center;
               animation: float-bg 60s linear infinite;
            }
            @keyframes float-bg {
               0% { background-position: 0 0; }
               100% { background-position: -250px 250px; }
            }
          `}</style>

          {/* HEADER SECTION */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm overflow-visible transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background/50 to-secondary/20 pointer-events-none" />

            <div className="doodle-bg-container z-0">
              <div className="doodle-bg" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">

                {/* Left: Title & Mascot */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 relative">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                      className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0"
                    >
                      {!foxLoaded && (
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                      )}
                      <img
                        src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/fd9d43c4b6c1e7b8cdda06e4eb4e1bf6.png"
                        alt="Fox Mascot"
                        loading="eager"
                        fetchPriority="high"
                        className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-300 ${foxLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setFoxLoaded(true)}
                      />
                    </motion.div>
                    <div>
                      <h1 className="font-black text-xl sm:text-2xl tracking-tight leading-none text-foreground drop-shadow-sm">Aktiviteler</h1>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">{words.length} kelime kaydedildi</p>
                    </div>
                  </div>
                </div>

                {/* Center/Right: Desktop Actions (Minimalist) */}
                <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto flex-1 justify-end relative z-50">
                  <Button variant="ghost" size="sm" className="rounded-xl h-10 font-medium transition-all hover:bg-secondary bg-transparent border-transparent" onClick={() => handlePremiumAction(() => setIsCreateListOpen(true))}>
                    <FolderPlus className="w-4 h-4 mr-2 opacity-70" /> Yeni Liste
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl h-10 font-medium transition-all hover:bg-secondary bg-transparent border-transparent" onClick={() => handlePremiumAction(() => setIsBulkAddOpen(true))}>
                    <ListPlus className="w-4 h-4 mr-2 opacity-70" /> Toplu Ekle
                  </Button>
                  <div className="w-px h-5 bg-border/60 mx-1" />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="sm" variant="secondary" className="rounded-xl h-10 font-medium transition-all hover:bg-secondary/80 border border-border/50 shadow-sm" onClick={() => handlePremiumAction(() => setIsAddWordOpen(true))}>
                      <Plus className="w-4 h-4 mr-2" /> Kelime Ekle
                    </Button>
                  </motion.div>
                </div>

              </div>
            </div>
          </div>

          {/* MINIMALIST FLOATING ACTION BUTTON FOR MOBILE */}
          <div className="sm:hidden fixed bottom-24 right-4 z-[90] flex flex-col items-end gap-3" ref={mobileMenuRef}>
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 bg-background/95 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-xl mb-1 origin-bottom-right"
                >
                  <button
                    onClick={() => handlePremiumAction(() => setIsAddWordOpen(true))}
                    className="flex items-center justify-end gap-3 w-full p-2 rounded-xl hover:bg-secondary transition-all text-right group"
                  >
                    <span className="text-[13px] font-bold text-foreground">Tekli Ekle</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => handlePremiumAction(() => setIsBulkAddOpen(true))}
                    className="flex items-center justify-end gap-3 w-full p-2 rounded-xl hover:bg-secondary transition-all text-right group"
                  >
                    <span className="text-[13px] font-bold text-foreground">Toplu Ekle</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ListPlus className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => handlePremiumAction(() => setIsCreateListOpen(true))}
                    className="flex items-center justify-end gap-3 w-full p-2 rounded-xl hover:bg-secondary transition-all text-right group"
                  >
                    <span className="text-[13px] font-bold text-foreground">Yeni Liste</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FolderPlus className="w-4 h-4" />
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-12 h-12 rounded-full shadow-[0_4px_15px_-3px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 border
                ${isMobileMenuOpen
                  ? 'bg-secondary border-border text-foreground'
                  : 'bg-primary text-primary-foreground border-primary'
                }`}
            >
              <Plus className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`} />
            </motion.button>
          </div>

          {/* MODES SELECTION STRIP */}
          <div className="bg-secondary/20 border-b border-border relative z-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Carousel Wrapper */}
                <div
                  className="w-full group flex items-center gap-1 sm:gap-2 relative"
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                >
                  <button
                    onClick={() => scrollCarousel('left')}
                    disabled={!canScrollLeft}
                    className={cn(
                      "shrink-0 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background transition-all touch-friendly",
                      canScrollLeft ? "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default pointer-events-none"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div
                    ref={carouselRef}
                    onScroll={handleCarouselScroll}
                    className="flex-1 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory flex gap-3 pb-2 pt-1 px-1"
                  >
                    {modes.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => navigate(`${mode.path}?category=${selectedCategory}`)}
                          className={`shine-effect snap-center shrink-0 group/card relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 shadow-sm overflow-hidden min-w-[160px] md:min-w-max h-14 ${mode.bg}`}
                        >
                          <CardDoodle type={mode.id} />
                          <div className={`relative z-10 p-2 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300`}>
                            <Icon className={`w-5 h-5 ${mode.color}`} />
                          </div>
                          <span className="relative z-10 font-bold text-sm whitespace-nowrap text-foreground/90 group-hover/card:text-foreground transition-colors duration-300">
                            {mode.name} <span className="hidden sm:inline">Pratiği</span>
                          </span>
                          <ChevronRight className="relative z-10 w-4 h-4 text-muted-foreground/50 group-hover/card:text-primary transition-all duration-300 ml-auto opacity-0 group-hover/card:opacity-100 -translate-x-2 group-hover/card:translate-x-0" />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => scrollCarousel('right')}
                    disabled={!canScrollRight}
                    className={cn(
                      "shrink-0 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background transition-all touch-friendly",
                      canScrollRight ? "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer" : "opacity-0 cursor-default pointer-events-none"
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="md:hidden flex justify-center gap-1 mt-2">
                  {modes.map((mode, idx) => (
                    <div
                      key={`dot-${mode.id}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeModeIndex ? 'w-4 bg-primary' : 'w-1.5 bg-border'}`}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-0">

            {/* SIDEBAR */}
            <aside className="hidden lg:flex w-72 flex-col shrink-0 gap-6">
              <div className="bg-card rounded-3xl border border-border p-5 shadow-sm sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg tracking-tight">Kategoriler <span className="text-xs text-muted-foreground font-medium ml-1">({categories.length}/{MAX_CATEGORIES})</span></h2>
                  <button onClick={() => handlePremiumAction(() => setIsCreateListOpen(true))} className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => updateCategoryUrl('all')}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> Tüm Kelimeler</span>
                    <Badge variant={selectedCategory === 'all' ? "secondary" : "outline"} className="text-xs bg-background/20">{words.length}</Badge>
                  </button>

                  <button
                    onClick={() => updateCategoryUrl('uncategorized')}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === 'uncategorized' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Kategorisiz</span>
                    <Badge variant={selectedCategory === 'uncategorized' ? "secondary" : "outline"} className="text-xs bg-background/20">{words.filter(w => !w.category_id).length}</Badge>
                  </button>

                  <div className="my-3 border-t border-border" />

                  <div className="max-h-[50vh] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {categories.map(cat => {
                      const count = words.filter(w => w.category_id === cat.id).length;
                      const isActive = selectedCategory === cat.id.toString();

                      return (
                        <div key={cat.id} className="group flex items-center justify-between relative">
                          <button
                            onClick={() => updateCategoryUrl(cat.id.toString())}
                            className={`flex-1 flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span
                                className={`w-2.5 h-2.5 rounded-full shrink-0`}
                                style={{ backgroundColor: cat.color || '#a855f7' }}
                              />
                              <span className="truncate break-words overflow-hidden text-ellipsis">{cat.name}</span>
                            </span>
                            <span className="text-xs opacity-70 ml-2">{count}</span>
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); setCategoryToDelete(cat); }}
                            className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 text-destructive bg-background rounded-lg shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                    {categories.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4 italic">Henüz liste oluşturulmamış.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    variant="secondary"
                    className="w-full justify-start rounded-xl text-sm font-semibold group h-11 transition-all duration-200"
                    onClick={handleDownloadCSV}
                  >
                    <Download className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                    Kelimeleri İndir
                  </Button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Mobile Controls */}
              <div className="lg:hidden flex flex-row items-center gap-2 mb-3">
                <div className="flex-1">
                  <Select value={selectedCategory} onValueChange={updateCategoryUrl}>
                    <SelectTrigger className="w-full bg-card h-11 rounded-xl border-border shadow-sm font-semibold">
                      <SelectValue placeholder="Kategori Seç" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-[300px] overflow-y-auto custom-scrollbar">
                      <SelectItem value="all">Tüm Kelimeler</SelectItem>
                      <SelectItem value="uncategorized">Kategorisiz</SelectItem>
                      {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory === 'all' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-11 w-11 rounded-xl shrink-0 p-0 transition-colors",
                          !isDesktop ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "hover:bg-secondary"
                        )}
                        onClick={isDesktop ? handleDownloadCSV : undefined}
                      >
                        <Download className="w-5 h-5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isDesktop ? "Kelimeleri İndir" : "Masaüstü cihazlarda kullanılabilir"}
                    </TooltipContent>
                  </Tooltip>
                ) : selectedCategory !== 'uncategorized' ? (
                  <Button
                    variant="outline"
                    className="h-11 w-11 rounded-xl shrink-0 p-0 text-destructive hover:bg-destructive/10 border-destructive/20 transition-colors"
                    onClick={() => {
                      const cat = categories.find(c => c.id.toString() === selectedCategory);
                      if (cat) setCategoryToDelete(cat);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                ) : null}
              </div>

              {/* Header & Search & Bulk Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <div className="hidden sm:block">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{getCategoryName(selectedCategory)}</h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{filteredWords.length} kelime listeleniyor</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  {paginatedWords.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isAllPaginatedSelected ? "default" : "outline"}
                          size="icon"
                          onClick={() => handleSelectAll(!isAllPaginatedSelected)}
                          className={cn("h-11 w-11 shrink-0 rounded-2xl transition-all shadow-sm", isAllPaginatedSelected ? "bg-primary text-primary-foreground shadow-md" : "")}
                        >
                          <CheckSquare className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Tümünü Seç / Kaldır</TooltipContent>
                    </Tooltip>
                  )}
                  <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Kelime veya çeviri ara..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedWords([]); }}
                      className="w-full pl-10 pr-10 h-11 sm:h-12 rounded-2xl bg-card border-border shadow-sm focus:border-primary transition-all duration-200 text-sm font-medium"
                    />
                    {searchTerm && (
                      <button onClick={() => { setSearchTerm(''); setSelectedWords([]); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Word Grid */}
              {paginatedWords.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    <AnimatePresence mode="popLayout">
                      {paginatedWords.map(word => {
                        const cat = categories.find(c => c.id === word.category_id);
                        const catName = cat?.name;
                        const colorClass = getCategoryColor(cat?.id);

                        const totalAttempts = word.correct_count + word.incorrect_count;
                        const targetAttempts = 5;
                        const percentage = totalAttempts === 0 ? 0 : Math.min(100, (word.correct_count / targetAttempts) * 100);
                        const radius = 10;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference - (percentage / 100) * circumference;
                        const isFullyLearned = percentage >= 100 || word.is_learned;
                        const isSelected = selectedWords.includes(word.id);

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            key={`word-${word.id}`}
                            onClick={() => toggleWordSelection(word.id)}
                            className={cn(
                              "group relative bg-card border p-3.5 sm:p-5 rounded-2xl shadow-sm transition-all duration-300 flex flex-col gap-3 cursor-pointer",
                              isSelected ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border/60 hover:border-primary/30 hover:shadow-lg"
                            )}
                          >
                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleWordSelection(word.id)}
                                className={cn(isSelected && "opacity-100")}
                              />
                            </div>
                            <div className="flex items-start justify-between gap-3 pl-6">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-0.5">
                                  <h3 className="font-bold text-base sm:text-lg text-foreground break-words overflow-hidden text-ellipsis whitespace-normal leading-tight">
                                    {word.word}
                                  </h3>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleWordPronounce(word.word); }}
                                    disabled={pronouncingWord === word.word}
                                    className="p-1.5 -ml-1 mt-[-2px] shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Dinle"
                                  >
                                    {pronouncingWord === word.word ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                                  </button>
                                </div>
                                <p className="text-sm sm:text-[15px] text-muted-foreground font-medium break-words overflow-hidden text-ellipsis whitespace-normal mt-1 leading-snug">
                                  {word.translation}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleToggleStar(word.id, word.is_starred); }}
                                  className={`p-2 rounded-full transition-all duration-200 ${word.is_starred ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-muted-foreground/30 hover:text-yellow-500 hover:bg-secondary'}`}
                                >
                                  <Star className={`w-5 h-5 ${word.is_starred ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-3">
                              <div className="flex-1 flex items-center gap-3">
                                {catName ? (
                                  <Badge variant="outline" className={`text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[120px] border ${colorClass}`}>
                                    {catName}
                                  </Badge>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground/50 font-medium px-1">Kategorisiz</span>
                                )}

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center justify-center cursor-help group/progress" onClick={(e) => e.stopPropagation()}>
                                      {isFullyLearned ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm group-hover/progress:scale-110 transition-transform" />
                                      ) : (
                                        <svg className="w-6 h-6 -rotate-90 transform group-hover/progress:scale-110 transition-transform" viewBox="0 0 24 24">
                                          <circle className="text-secondary" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="12" cy="12" />
                                          <circle
                                            className="text-emerald-500 transition-all duration-500 ease-out"
                                            strokeWidth="3"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r={radius}
                                            cx="12"
                                            cy="12"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="font-medium text-xs">
                                    <p>{isFullyLearned ? "Öğrenildi!" : `${word.correct_count}/${targetAttempts} aktivite tamamlandı`}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Doğru: {word.correct_count} | Yanlış: {word.incorrect_count}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>

                              <div className="flex items-center gap-1">
                                <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openEditModal(word); }}
                                    className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors duration-200"
                                    title="Düzenle"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setWordToDelete(word.id); }}
                                    className="p-2 rounded-lg bg-secondary hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors duration-200"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div
                                  className="lg:hidden"
                                  onClick={(e) => e.stopPropagation()}
                                  onPointerDown={(e) => e.stopPropagation()}
                                >
                                  <DropdownMenu open={openMenuId === word.id} onOpenChange={(isOpen) => setOpenMenuId(isOpen ? word.id : null)}>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground"
                                        onClick={(e) => handleMenuClick(e, word.id)}
                                        onPointerDown={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 rounded-xl z-[100]">
                                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => openEditModal(word), 0); }} className="gap-2 cursor-pointer"><Edit2 className="w-4 h-4" /> Düzenle</DropdownMenuItem>
                                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => setWordToDelete(word.id), 0); }} className="text-destructive gap-2 cursor-pointer focus:text-destructive"><Trash2 className="w-4 h-4" /> Sil</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center pb-24 sm:pb-0">
                      <Pagination>
                        <PaginationContent className="bg-card px-2 py-1 rounded-2xl border border-border shadow-sm">
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-secondary transition-colors'}
                              text="Önceki"
                            />
                          </PaginationItem>
                          <PaginationItem className="hidden sm:inline-block">
                            <span className="text-sm font-medium px-4 text-muted-foreground">
                              Sayfa {currentPage} / {totalPages}
                            </span>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-secondary transition-colors'}
                              text="Sonraki"
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 mt-4 min-h-[300px]">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm border border-border mb-6">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Kelime Bulunamadı</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-8">
                    {searchTerm ? "Arama kriterlerinize uygun kelime bulunamadı. Farklı bir arama yapmayı deneyin." : "Bu kategoride henüz kelime yok. Hemen yeni kelimeler ekleyerek öğrenmeye başlayın!"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => handlePremiumAction(() => setIsAddWordOpen(true))} className="rounded-xl h-12 px-6 font-bold shadow-sm transition-transform hover:scale-105">
                      <Plus className="w-5 h-5 mr-2" /> Yeni Kelime Ekle
                    </Button>
                    {searchTerm && (
                      <Button variant="outline" onClick={() => { setSearchTerm(''); updateCategoryUrl('all'); }} className="rounded-xl h-12 px-6 font-bold">
                        Aramayı Temizle
                      </Button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* BULK ACTION BAR */}
        <AnimatePresence>
          {selectedWords.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="fixed bottom-24 lg:bottom-10 lg:top-auto left-0 right-0 mx-auto z-[100] bg-foreground text-background px-4 py-3 sm:px-6 sm:py-3 rounded-full shadow-2xl flex items-center justify-between gap-3 sm:gap-4 w-[90vw] max-w-[400px] sm:w-max sm:max-w-none sm:justify-center border border-border/20 backdrop-blur-xl"
            >
              <span className="font-bold text-sm sm:text-base whitespace-nowrap">{selectedWords.length} Seçildi</span>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button size="sm" variant="secondary" onClick={() => setIsBulkTransferOpen(true)} className="rounded-xl h-9 text-xs sm:text-sm font-bold bg-background text-foreground hover:bg-background/90 px-3">
                  Taşı
                </Button>
                <Button size="icon" variant="destructive" onClick={() => setIsBulkDeleteOpen(true)} className="rounded-full h-9 w-9">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-5 bg-background/20 mx-1 sm:mx-2" />
                <Button size="icon" variant="ghost" onClick={() => setSelectedWords([])} className="rounded-full h-9 w-9 hover:bg-background/20 text-background">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODALS */}
        <PremiumAccessModal
          isOpen={isPremiumModalOpen}
          onClose={setIsPremiumModalOpen}
        />

        <ResponsiveModal
          isOpen={isCreateListOpen}
          setIsOpen={(open) => { setIsCreateListOpen(open); if (!open) cleanupModals(); }}
          title="Yeni Liste Oluştur"
          description={`Kelimelerinizi organize etmek için yeni bir kategori oluşturun. (${categories.length}/${MAX_CATEGORIES})`}
          footer={
            <>
              <Button variant="ghost" onClick={() => { setIsCreateListOpen(false); cleanupModals(); }} className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</Button>
              <Button onClick={handleCreateList} disabled={isCreatingList || categories.length >= MAX_CATEGORIES} className="w-full sm:w-auto h-12 rounded-xl font-bold shadow-md">
                {isCreatingList ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Oluştur'}
              </Button>
            </>
          }
        >
          <div className="space-y-6 py-2">
            {categories.length >= MAX_CATEGORIES && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                Maksimum 100 liste oluşturma sınırına ulaştınız.
              </div>
            )}
            <div>
              <Label htmlFor="list-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Liste Adı</Label>
              <Input
                id="list-name"
                value={newListName}
                maxLength={25}
                autoFocus={false}
                onChange={(e) => setNewListName(e.target.value.slice(0, 25))}
                placeholder="Örn: Seyahat Kelimeleri..."
                className="h-12 rounded-xl bg-secondary/50 text-base px-4 border-transparent focus:bg-background focus:border-primary transition-all duration-200"
                disabled={categories.length >= MAX_CATEGORIES}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
              />
            </div>
            <div>
              <Label htmlFor="list-color" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Renk Seç</Label>
              <div className="flex flex-wrap gap-3">
                {CATEGORY_PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    disabled={categories.length >= MAX_CATEGORIES}
                    onClick={() => setNewListColor(color)}
                    className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${newListColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {newListColor === color && <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ResponsiveModal>

        <ResponsiveModal
          isOpen={isBulkTransferOpen}
          setIsOpen={(open) => { setIsBulkTransferOpen(open); if (!open) cleanupModals(); }}
          title="Kelimeleri Taşı"
          description={`${selectedWords.length} kelimeyi yeni bir listeye taşıyorsunuz.`}
          footer={
            <>
              <Button variant="ghost" onClick={() => { setIsBulkTransferOpen(false); cleanupModals(); }} className="w-full sm:w-auto h-11 rounded-xl font-bold">İptal</Button>
              <Button onClick={handleBulkTransfer} disabled={isBulkTransferring} className="w-full sm:w-auto h-11 rounded-xl font-bold bg-primary text-primary-foreground">
                {isBulkTransferring ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Taşı'}
              </Button>
            </>
          }
        >
          <div className="py-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Hedef Kategori Seçin</Label>
            <Select value={bulkTransferCategory} onValueChange={setBulkTransferCategory}>
              <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all duration-200">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[300px] overflow-y-auto custom-scrollbar">
                <SelectItem value="none">Kategorisiz</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </ResponsiveModal>

        <ResponsiveModal
          isOpen={isAddWordOpen}
          setIsOpen={(open) => { setIsAddWordOpen(open); if (!open) cleanupModals(); }}
          title="Kelime Ekle"
          description="Sözlüğünüze yeni bir kelime ve çevirisini ekleyin."
          footer={
            <>
              <Button variant="ghost" onClick={() => { setIsAddWordOpen(false); cleanupModals(); }} className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</Button>
              <Button onClick={handleAddWord} disabled={isAddingWord} className="w-full sm:w-auto h-12 rounded-xl font-bold shadow-md">
                {isAddingWord ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kaydet'}
              </Button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">İngilizce Kelime</Label>
              <Input
                value={newWordData.word}
                maxLength={25}
                autoFocus={false}
                onChange={(e) => setNewWordData(prev => ({ ...prev, word: e.target.value.slice(0, 25) }))}
                placeholder="coincidence"
                className="h-12 rounded-xl bg-secondary/50 text-base px-4 border-transparent focus:bg-background focus:border-primary transition-all duration-200"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Türkçe Çeviri</Label>
              <div className="relative">
                <Input
                  value={newWordData.translation}
                  maxLength={35}
                  autoFocus={false}
                  onChange={(e) => setNewWordData(prev => ({ ...prev, translation: e.target.value.slice(0, 35) }))}
                  placeholder="tesadüf"
                  className="h-12 rounded-xl bg-secondary/50 text-base pl-4 pr-14 border-transparent focus:bg-background focus:border-primary transition-all duration-200"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                  {newWordData.translation.length}/35
                </span>
              </div>
            </div>
            {categories.length > 0 && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Kategori Seç (Opsiyonel)</Label>
                <Select value={newWordData.category_id} onValueChange={(val) => setNewWordData(prev => ({ ...prev, category_id: val }))}>
                  <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all duration-200">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-[300px] overflow-y-auto custom-scrollbar">
                    <SelectItem value="none">Kategorisiz</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </ResponsiveModal>

        <ResponsiveModal
          isOpen={isEditWordOpen}
          setIsOpen={(open) => {
            setIsEditWordOpen(open);
            if (!open) {
              setTimeout(() => setEditingWord(null), 300);
              cleanupModals();
            }
          }}
          title="Kelimeyi Düzenle"
          footer={
            <>
              <Button variant="ghost" onClick={() => { setIsEditWordOpen(false); cleanupModals(); }} className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</Button>
              <Button onClick={handleUpdateWord} disabled={isUpdatingWord} className="w-full sm:w-auto h-12 rounded-xl font-bold shadow-md bg-primary text-primary-foreground">
                {isUpdatingWord ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kaydet'}
              </Button>
            </>
          }
        >
          {editingWord && (
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">İngilizce Kelime</Label>
                <Input
                  value={editingWord.word}
                  maxLength={25}
                  autoFocus={false}
                  onChange={(e) => setEditingWord(prev => ({ ...prev, word: e.target.value.slice(0, 25) }))}
                  className="h-12 rounded-xl bg-secondary/50 text-base px-4 border-transparent focus:bg-background focus:border-primary transition-all duration-200"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Türkçe Çeviri</Label>
                <div className="relative">
                  <Input
                    value={editingWord.translation}
                    maxLength={35}
                    autoFocus={false}
                    onChange={(e) => setEditingWord(prev => ({ ...prev, translation: e.target.value.slice(0, 35) }))}
                    className="h-12 rounded-xl bg-secondary/50 text-base pl-4 pr-14 border-transparent focus:bg-background focus:border-primary transition-all duration-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateWord()}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
                    {editingWord.translation.length}/35
                  </span>
                </div>
              </div>
              {categories.length > 0 && (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Kategori</Label>
                  <Select
                    value={editingWord.category_id ? editingWord.category_id.toString() : 'none'}
                    onValueChange={(val) => setEditingWord(prev => ({ ...prev, category_id: val }))}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all duration-200">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] max-h-[300px] overflow-y-auto custom-scrollbar">
                      <SelectItem value="none">Kategorisiz</SelectItem>
                      {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal
          isOpen={isBulkAddOpen}
          setIsOpen={(open) => { setIsBulkAddOpen(open); if (!open) cleanupModals(); }}
          title="Toplu Kelime Ekle"
          description="Farklı bir yerden kopyaladığınız kelimeleri hızlıca listenize aktarın."
          compact
          footer={
            <>
              <Button variant="ghost" onClick={() => { setIsBulkAddOpen(false); cleanupModals(); }} className="w-full sm:w-auto h-11 rounded-xl font-bold">İptal</Button>
              <Button onClick={handleBulkAdd} disabled={isBulkAdding || !bulkAddText.trim() || bulkAddCooldown > 0} className="w-full sm:w-auto h-11 rounded-xl font-bold shadow-md bg-primary text-primary-foreground">
                {isBulkAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : bulkAddCooldown > 0 ? `Bekleyin ${bulkAddCooldown}s` : 'Kelimeleri Aktar'}
              </Button>
            </>
          }
        >
          <div className="py-2 space-y-4">
            {bulkAddCooldown > 0 && (
              <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                Spam koruması: Lütfen yeni bir toplu ekleme için biraz bekleyin.
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Kelimeleri Yapıştırın
                </Label>
                <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">Max {BULK_ADD_LIMIT}</span>
              </div>
              <div className="relative">
                <Textarea
                  value={bulkAddText}
                  onChange={(e) => setBulkAddText(e.target.value)}
                  autoFocus={false}
                  placeholder={`Örnek:\n\napple, elma\nbook - kitap\nhouse\tev`}
                  className="min-h-[160px] rounded-xl bg-secondary/30 border-transparent focus:bg-background focus:border-primary p-4 text-sm resize-y font-mono transition-all duration-200"
                  disabled={bulkAddCooldown > 0}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Her satıra bir kelime. (Maks {MAX_CHARS_PER_LINE} karakter)
              </p>
            </div>

            {categories.length > 0 && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Hedef Kategori</Label>
                <Select value={bulkAddCategory} onValueChange={setBulkAddCategory} disabled={bulkAddCooldown > 0}>
                  <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all duration-200">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-[300px] overflow-y-auto custom-scrollbar">
                    <SelectItem value="none">Kategorisiz</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </ResponsiveModal>

        {/* Delete Single Word Dialog */}
        <AlertDialog open={!!wordToDelete} onOpenChange={(open) => { if (!open) { setWordToDelete(null); cleanupModals(); } }}>
          <AlertDialogContent className="w-[90vw] max-w-md mx-auto rounded-[2rem] p-6 sm:p-8 text-center z-[150]">
            <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black text-center mb-2">Kelimeyi Sil?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base">
                Bu kelimeyi listenizden kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-3 mt-6">
              <AlertDialogCancel className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteWord} className="w-full sm:w-auto h-12 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md">
                Evet, Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Bulk Words Dialog */}
        <AlertDialog open={isBulkDeleteOpen} onOpenChange={(open) => { setIsBulkDeleteOpen(open); if (!open) cleanupModals(); }}>
          <AlertDialogContent className="w-[90vw] max-w-md mx-auto rounded-[2rem] p-6 sm:p-8 text-center z-[150]">
            <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black text-center mb-2">Toplu Kelime Silme</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base">
                Seçili <span className="font-bold text-foreground">{selectedWords.length}</span> kelimeyi listenizden kalıcı olarak silmek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-3 mt-6">
              <AlertDialogCancel className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} disabled={isBulkDeleting} className="w-full sm:w-auto h-12 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md">
                {isBulkDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Evet, Sil'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => { if (!open) { setCategoryToDelete(null); cleanupModals(); } }}>
          <AlertDialogContent className="w-[90vw] max-w-md mx-auto rounded-[2rem] p-6 sm:p-8 text-center z-[150]">
            <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black text-center mb-2">Kategoriyi Sil?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base break-words overflow-hidden text-ellipsis">
                <span className="font-bold text-foreground">"{categoryToDelete?.name}"</span> kategorisini silmek istediğinize emin misiniz? İçindeki kelimeler silinmeyecek.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-3 mt-6">
              <AlertDialogCancel className="w-full sm:w-auto h-12 rounded-xl font-bold">İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="w-full sm:w-auto h-12 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md">
                Kategoriyi Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default ActivitiesPage;