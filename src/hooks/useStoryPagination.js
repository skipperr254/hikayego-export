import { useState, useCallback, useEffect } from 'react';
import { splitTextIntoPages } from '@/lib/utils';

export const useStoryPagination = (storySections, storyContent, initialPage = 0) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [direction, setDirection] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    let storyPages = [];
    if (storySections && storySections.length > 0) {
      storyPages = storySections.map(section => section.content);
    } else if (storyContent) {
      storyPages = splitTextIntoPages(storyContent, 1600);
    }
    
    setPages(storyPages);

    if (initialPage < storyPages.length) {
      setCurrentPage(initialPage);
    } else {
      setCurrentPage(0);
    }
  }, [storySections, storyContent, initialPage]);

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentPage(prevPage => {
      const newPage = prevPage + newDirection;
      if (newPage >= 0 && newPage < pages.length) {
        return newPage;
      }
      return prevPage;
    });
  }, [pages.length]);

  return {
    pages,
    currentPage,
    direction,
    paginate,
    setCurrentPage,
    fontSize,
    setFontSize,
  };
};