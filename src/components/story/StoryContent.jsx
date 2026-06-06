import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const StoryContent = forwardRef(({ content, onWordClick, fontSize }, ref) => {
  let wordCounter = 0;

  const renderStoryText = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      if (paragraph.trim() === '') {
         return <br key={pIndex} />;
      }
      return (
        <p key={pIndex} className="mb-4 last:mb-0 whitespace-pre-wrap">
          {paragraph.split(/(\s+|[.,!?;:"()[\]{}])/).map((token, tIndex) => {
            if (/^\s+$/.test(token)) {
              return token;
            }
            if (/^[.,!?;:"()[\]{}]+$/.test(token)) {
              return <span key={tIndex}>{token}</span>;
            }
            if (/[a-zA-Z]/.test(token)) {
              const cleanWord = token.toLowerCase().replace(/[.,!?;:"()[\]{}]/g, '');
              const wordIndex = wordCounter++;
              return (
                <span
                  key={tIndex}
                  className="word-token cursor-pointer transition-all duration-200 hover:bg-primary/10 rounded-sm px-0.5 py-0.5"
                  data-word={cleanWord}
                  data-original={token}
                  data-word-index={wordIndex}
                >
                  {token}
                </span>
              );
            }
            return <span key={tIndex}>{token}</span>;
          })}
        </p>
      );
    });
  };

  const calculatedFontSize = 16 + ((fontSize - 1) / 99) * 12;

  return (
    <div
      ref={ref}
      onClick={onWordClick}
      className={cn(
        'relative max-w-prose w-full mx-auto font-story text-foreground leading-relaxed text-left py-4 md:py-8'
      )}
      style={{
        fontSize: `${calculatedFontSize}px`,
        lineHeight: 1.8,
        letterSpacing: '0.01em',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'pan-y',
      }}
    >
      <div className="pointer-events-none absolute inset-0"></div>
      {renderStoryText(content)}
    </div>
  );
});

StoryContent.displayName = 'StoryContent';

export default StoryContent;