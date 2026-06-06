import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function splitTextIntoPages(text, charactersPerPage) {
  const words = text.split(/\s+/);
  const pages = [];
  let currentPage = [];
  let currentPageLength = 0;

  for (const word of words) {
    if (
      currentPageLength + word.length + (currentPage.length > 0 ? 1 : 0) >
      charactersPerPage
    ) {
      pages.push(currentPage.join(" "));
      currentPage = [];
      currentPageLength = 0;
    }
    if (currentPage.length > 0) {
      currentPage.push(" ");
      currentPageLength++;
    }
    currentPage.push(word);
    currentPageLength += word.length;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join(""));
  }

  return pages;
}

/**
 * Split a story's content into sections for TTS generation.
 *
 * Strategy:
 *  1. Split on double-newlines (paragraph boundaries).
 *  2. Greedily merge consecutive paragraphs into a section while the total
 *     length stays ≤ maxChars.
 *  3. When a single paragraph exceeds maxChars, fall back to word-boundary
 *     splitting for that paragraph alone.
 *
 * Returns an array of section content strings (each ready to send to TTS).
 */
export function splitStoryIntoSections(text, maxChars = 1500) {
  if (!text || !text.trim()) return [];

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const sections = [];
  let currentParagraphs = [];
  let currentLength = 0;

  const flushCurrent = () => {
    if (currentParagraphs.length > 0) {
      sections.push(currentParagraphs.join("\n\n"));
      currentParagraphs = [];
      currentLength = 0;
    }
  };

  const splitParagraphByWords = (paragraph) => {
    const words = paragraph.split(/\s+/);
    let chunk = [];
    let chunkLength = 0;

    for (const word of words) {
      const addLength = chunkLength > 0 ? 1 + word.length : word.length;
      if (chunkLength + addLength > maxChars && chunk.length > 0) {
        sections.push(chunk.join(" "));
        chunk = [];
        chunkLength = 0;
      }
      chunk.push(word);
      chunkLength += chunkLength > 0 ? 1 + word.length : word.length;
    }

    if (chunk.length > 0) {
      sections.push(chunk.join(" "));
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChars) {
      // This single paragraph is larger than the limit — flush what we have,
      // then split the big paragraph by words.
      flushCurrent();
      splitParagraphByWords(paragraph);
      continue;
    }

    const joiner = currentParagraphs.length > 0 ? "\n\n" : "";
    const projectedLength = currentLength + joiner.length + paragraph.length;

    if (projectedLength > maxChars && currentParagraphs.length > 0) {
      flushCurrent();
    }

    currentParagraphs.push(paragraph);
    currentLength += (currentParagraphs.length > 1 ? 2 : 0) + paragraph.length;
  }

  flushCurrent();
  return sections;
}