import React, { useEffect } from 'react';

const ContentSecurityLayer = ({ children }) => {
  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    const disableDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('dragstart', disableDragStart);
    
    document.body.classList.add('no-select');

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('dragstart', disableDragStart);
      document.body.classList.remove('no-select');
    };
  }, []);

  return <>{children}</>;
};

export default ContentSecurityLayer;