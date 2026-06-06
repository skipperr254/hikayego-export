import React from 'react';
import LessonCard from './LessonCard';

const LessonList = ({ lessons, selectedLessonId, onLessonClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          isSelected={selectedLessonId === lesson.id}
          onClick={() => onLessonClick(lesson)}
        />
      ))}
    </div>
  );
};

export default LessonList;