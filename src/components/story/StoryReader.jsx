import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import StoryContent from "@/components/story/StoryContent";
import PremiumModal from "@/components/story/PremiumModal";
import ImmersiveReaderHeader from "@/components/story/reader/ImmersiveReaderHeader";
import ReaderControls from "@/components/story/reader/ReaderControls";
import AssistantPanel from "@/components/story/reader/AssistantPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getTranslation, preloadTranslations } from "@/lib/dictionary";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { supabase } from "@/lib/customSupabaseClient";
import { getDailyFreeStories } from "@/utils/dailyStorySelector";
import { cn } from "@/lib/utils";
import { useStoryPagination } from "@/hooks/useStoryPagination";
import { useStoryInteraction } from "@/hooks/useStoryInteraction";
import { useWordnikPronunciation } from "@/hooks/useWordnikPronunciation";
import { useWordInfo } from "@/hooks/useWordInfo";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const pageVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const StoryReader = ({
  story,
  storySections,
  isSaved,
  isRead,
  onToggleSave,
  onToggleRead,
  initialPage,
  initialHighlight,
}) => {
  const { user, canAccessPremiumFeatures, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isKidAccount = profile?.is_kid_account || false;

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalContent, setPremiumModalContent] = useState({
    title: "",
    description: "",
  });
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEyeComfortMode, setIsEyeComfortMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isHighlightActive, setIsHighlightActive] = useState(false);

  const [selectedWord, setSelectedWord] = useState(null);
  const [translationInfo, setTranslationInfo] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const { playPronunciation, isPronouncing, pronunciationError } = useWordnikPronunciation();
  const { wordInfo, isFetchingInfo, infoError, fetchWordInfo, clearWordInfo } = useWordInfo();

  const pageContainerRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const dragControls = useDragControls();

  const { pages, currentPage, direction, paginate, fontSize, setFontSize } =
    useStoryPagination(storySections, story?.content, initialPage);

  const {
    handleListen,
    cleanupSpeech,
    speechRate,
    setSpeechRate,
    setStoryContentElement,
    ...speechState
  } = useSpeechSynthesis();

  const triggerPremiumModal = useCallback((title, description) => {
    setPremiumModalContent({ title, description });
    setShowPremiumModal(true);
  }, []);

  const {
    isCurrentWordSaved,
    isCheckingSaveStatus,
    isSavingWord,
    handleSaveWord,
    saveProgress,
    handleMarkPosition,
  } = useStoryInteraction(
    user,
    story,
    selectedWord,
    toast,
    triggerPremiumModal,
    currentPage,
    pageContainerRef
  );

  const handleWordClick = useCallback(
    async (e) => {
      e.stopPropagation();
      const clickedElement = e.target;
      if (!clickedElement.classList.contains("word-token")) return;

      if (!canAccessPremiumFeatures) {
        triggerPremiumModal(
          "Sınırsız Kelime Çevirisi",
          "Hikaye okurken tüm kelimeleri anında çevirmek ve anlamlarını öğrenmek için Premium'a geçin."
        );
        return;
      }

      if (pageContainerRef.current) {
        pageContainerRef.current
          .querySelectorAll(".selected-word")
          .forEach((el) => el.classList.remove("selected-word"));
      }

      clickedElement.classList.add("selected-word");

      const wordToFetch = clickedElement.getAttribute("data-word");
      setSelectedWord(wordToFetch);
      setTranslationInfo(null);
      clearWordInfo();
      setIsTranslating(true);
      if (!isAssistantOpen) setIsAssistantOpen(true);

      fetchWordInfo(wordToFetch);

      try {
        const translationData = await getTranslation(wordToFetch);
        setTranslationInfo(translationData);
      } catch (error) {
        console.error("Word data fetching error:", error);
        setTranslationInfo({ translation: "Çeviri alınamadı.", error: true });
      } finally {
        setIsTranslating(false);
      }
    },
    [canAccessPremiumFeatures, isAssistantOpen, triggerPremiumModal, fetchWordInfo, clearWordInfo]
  );

  const handlePageClick = useCallback(
    (e) => {
      if (isAssistantOpen && !e.target.closest("[data-assistant-panel]")) {
        setIsAssistantOpen(false);
      }
    },
    [isAssistantOpen]
  );

  useEffect(() => {
    if (pages.length > 0) {
      const allWords = pages.join(" ").match(/\b(\w+)\b/g) || [];
      if (allWords.length > 0) preloadTranslations([...new Set(allWords)]);
    }
  }, [pages]);

  const paginateWithCleanup = useCallback(
    (newDirection) => {
      cleanupSpeech();
      paginate(newDirection);
    },
    [cleanupSpeech, paginate]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") paginateWithCleanup(1);
      else if (e.key === "ArrowLeft") paginateWithCleanup(-1);
      else if (e.key === "ArrowUp" && pageContainerRef.current) {
        e.preventDefault();
        pageContainerRef.current.scrollBy({ top: -80, behavior: "smooth" });
      } else if (e.key === "ArrowDown" && pageContainerRef.current) {
        e.preventDefault();
        pageContainerRef.current.scrollBy({ top: 80, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginateWithCleanup]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
      saveProgress();
      cleanupSpeech();
      if (highlightTimeoutRef.current)
        clearTimeout(highlightTimeoutRef.current);
    };
  }, [cleanupSpeech, saveProgress]);

  const clearHighlight = useCallback(() => {
    if (pageContainerRef.current) {
      const highlightedEl = pageContainerRef.current.querySelector(
        ".marked-word-highlight"
      );
      if (highlightedEl)
        highlightedEl.classList.remove("marked-word-highlight");
    }
    setIsHighlightActive(false);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (initialHighlight !== null) {
      setTimeout(() => {
        if (pageContainerRef.current) {
          const wordElement = pageContainerRef.current.querySelector(
            `[data-word-index="${initialHighlight}"]`
          );
          if (wordElement) {
            wordElement.scrollIntoView({ behavior: "smooth", block: "center" });
            wordElement.classList.add("marked-word-highlight");
            setIsHighlightActive(true);
            toast({
              title: "Kaldığınız yerden devam ediyorsunuz!",
              description: "Hikayede en son işaretlediğiniz konuma geldiniz.",
            });
            highlightTimeoutRef.current = setTimeout(clearHighlight, 15000);
          }
        }
        try {
          const progress = JSON.parse(
            localStorage.getItem(`story_progress_${user.id}_${story.id}`) ||
            "{}"
          );
          const newProgress = { ...progress, show_highlight: false };
          localStorage.setItem(
            `story_progress_${user.id}_${story.id}`,
            JSON.stringify(newProgress)
          );
        } catch (e) {
          console.error("Failed to update progress in localStorage", e);
        }
      }, 200);
    }
  }, [initialHighlight, user, story, toast, clearHighlight]);

  useEffect(() => {
    const contentElement = pageContainerRef.current;
    if (!contentElement || !isHighlightActive) return;

    const handleInteraction = () => clearHighlight();
    contentElement.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, {
      once: true,
      capture: true,
    });

    return () => {
      if (contentElement)
        contentElement.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction, {
        capture: true,
      });
    };
  }, [isHighlightActive, clearHighlight]);

  useEffect(() => {
    cleanupSpeech();
  }, [currentPage, cleanupSpeech]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!story || !user) return;
      if (canAccessPremiumFeatures) return;

      try {
        const { data: allStories, error } = await supabase
          .from("stories")
          .select("id, level, is_for_kids")
          .order('id', { ascending: true });

        if (error) throw error;

        // Filter stories based on kid mode before getting daily free stories
        const storiesToProcess = isKidAccount
          ? allStories.filter(s => s.is_for_kids)
          : allStories;

        const { unlocked } = getDailyFreeStories(storiesToProcess, isKidAccount);

        if (!unlocked.includes(story.id)) {
          navigate("/dashboard");
          toast({
            title: "Premium Gerekli",
            description: "Bu hikayeye erişmek için Premium üye olmalısınız.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking story access:", error);
        navigate("/dashboard");
      }
    };

    checkAccess();
  }, [story, user, navigate, toast, canAccessPremiumFeatures]);

  useEffect(() => {
    if (pageContainerRef.current) {
      setStoryContentElement(pageContainerRef.current);
    }
    return () => {
      setStoryContentElement(null);
    };
  }, [currentPage, setStoryContentElement]);

  const handleToggleSave = () => onToggleSave(triggerPremiumModal);

  const onListen = () => {
    if (!canAccessPremiumFeatures) {
      triggerPremiumModal(
        "Sesli Okuma",
        "Hikayeleri sesli dinlemek bir Premium özelliktir."
      );
      return;
    }

    if (!pages[currentPage]) return;

    const currentSection = storySections[currentPage] || {
      content: pages[currentPage],
    };

    handleListen(currentSection);
  };

  const handleToggleAssistant = () => {
    if (!canAccessPremiumFeatures) {
      triggerPremiumModal(
        "Kelime Asistanı",
        "Kelime çevirisi, telaffuz ve kaydetme gibi özellikler için Premium'a geçin."
      );
      return;
    }
    setIsAssistantOpen((prev) => !prev);
  };
  const toggleEyeComfortMode = () => setIsEyeComfortMode((prev) => !prev);
  const handleBack = () => setShowExitConfirm(true);

  return (
    <>
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => navigate("/subscription")}
        title={premiumModalContent.title}
        description={premiumModalContent.description}
      />

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ayrılmak istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Okuma ekranından ayrılırsanız ilerlemeniz kaydedilmeyebilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/dashboard")}>
              Ayrıl
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className={cn(
          "fixed inset-0 text-foreground overflow-hidden transition-colors duration-500",
          isEyeComfortMode ? "theme-eye-comfort" : ""
        )}
      >
        <ImmersiveReaderHeader
          story={story}
          isSaved={isSaved}
          isRead={isRead}
          {...speechState}
          onBack={handleBack}
          onListen={onListen}
          onToggleSave={handleToggleSave}
          onToggleRead={onToggleRead}
          isEyeComfortMode={isEyeComfortMode}
          onToggleEyeComfortMode={toggleEyeComfortMode}
        />

        <main
          className='relative h-full w-full'
          onPointerDown={(e) => dragControls.start(e)}
          onClick={handlePageClick}
        >
          <div className='absolute inset-x-0 top-16 md:top-20 bottom-16 md:bottom-20 overflow-hidden'>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                ref={pageContainerRef}
                className='absolute inset-0 flex items-start justify-center px-4 overflow-y-auto'
                custom={direction}
                variants={pageVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag='x'
                dragControls={dragControls}
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  if (Math.abs(offset.y) > Math.abs(offset.x) * 1.5) return;
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) paginateWithCleanup(1);
                  else if (swipe > swipeConfidenceThreshold)
                    paginateWithCleanup(-1);
                }}
              >
                <StoryContent
                  content={pages[currentPage] || ""}
                  onWordClick={handleWordClick}
                  fontSize={fontSize}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <ReaderControls
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={paginateWithCleanup}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onToggleAssistant={handleToggleAssistant}
          speechRate={speechRate}
          onSpeechRateChange={setSpeechRate}
        />

        <AssistantPanel
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          selectedWord={selectedWord}
          translationInfo={translationInfo}
          wordInfo={wordInfo}
          isTranslating={isTranslating}
          isFetchingInfo={isFetchingInfo}
          infoError={infoError}
          onPronounce={playPronunciation}
          isPronouncingWord={isPronouncing}
          onSaveWord={handleSaveWord}
          onMarkPosition={handleMarkPosition}
          isWordSaved={isCurrentWordSaved}
          isCheckingSaveStatus={isCheckingSaveStatus}
          isSavingWord={isSavingWord}
        />
      </div>
    </>
  );
};

export default StoryReader;