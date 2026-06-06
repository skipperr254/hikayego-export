import { supabase } from "@/lib/customSupabaseClient";

const createSeededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

const shuffleArray = (array, seededRandom) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    // swap currentIndex and randomIndex
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getDailyFreeStories = (allStories, isKidMode = false) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateSeed = today.getTime();
  const seededRandom = createSeededRandom(dateSeed);

  if (isKidMode) {
    // Kid Mode: 6 unlocked kid stories + 6 locked kid stories (with timer)
    const kidStories = allStories.filter((story) => story.is_for_kids);
    const shuffledKidStories = shuffleArray([...kidStories], seededRandom);

    const unlockedKidStories = shuffledKidStories.slice(0, 6);
    const lockedKidStories = shuffledKidStories.slice(6, 12);

    const allUnlockedIds = unlockedKidStories.map((s) => s.id);
    const allPreviewIds = lockedKidStories.map((s) => s.id);

    const remainingLockedStories = kidStories.filter(
      (s) => !allUnlockedIds.includes(s.id) && !allPreviewIds.includes(s.id)
    );

    const premiumPlaceholderStory =
      remainingLockedStories.length > 0
        ? shuffleArray([...remainingLockedStories], seededRandom)[0]
        : null;

    return {
      unlocked: allUnlockedIds,
      lockedForPreview: allPreviewIds,
      premiumPlaceholderStory: premiumPlaceholderStory,
    };
  }

  // Normal Mode: 12 unlocked (6 normal + 6 kid) + 12 locked (6 normal + 6 kid)

  // Separate normal and kid stories
  const a1Stories = allStories.filter(
    (story) => story.level === "a1" && !story.is_for_kids
  );
  const a2Stories = allStories.filter(
    (story) => story.level === "a2" && !story.is_for_kids
  );
  const kidStories = allStories.filter((story) => story.is_for_kids);

  // Shuffle each category
  const shuffledA1 = shuffleArray([...a1Stories], seededRandom);
  const shuffledA2 = shuffleArray([...a2Stories], seededRandom);
  const shuffledKids = shuffleArray([...kidStories], seededRandom);

  // Select unlocked stories: 3 A1 + 3 A2 + 6 kids = 12 total
  const unlockedA1 = shuffledA1.slice(0, 3);
  const unlockedA2 = shuffledA2.slice(0, 3);
  const unlockedKids = shuffledKids.slice(0, 6);

  // Select locked stories (with timer): 3 A1 + 3 A2 + 6 kids = 12 total
  const lockedA1 = shuffledA1.slice(3, 6);
  const lockedA2 = shuffledA2.slice(3, 6);
  const lockedKids = shuffledKids.slice(6, 12);

  // Combine unlocked and locked stories
  const unlocked = [...unlockedA1, ...unlockedA2, ...unlockedKids];
  const lockedForPreview = [...lockedA1, ...lockedA2, ...lockedKids];

  const allUnlockedIds = unlocked.map((s) => s.id);
  const allPreviewIds = lockedForPreview.map((s) => s.id);

  const remainingLockedStories = allStories.filter(
    (s) => !allUnlockedIds.includes(s.id) && !allPreviewIds.includes(s.id)
  );

  const premiumPlaceholderStory =
    remainingLockedStories.length > 0
      ? shuffleArray([...remainingLockedStories], seededRandom)[0]
      : null;

  return {
    unlocked: allUnlockedIds,
    lockedForPreview: allPreviewIds,
    premiumPlaceholderStory: premiumPlaceholderStory,
  };
};