import React, { useState, useEffect } from 'react';

function getBrowserVisibilityProp() {
  if (typeof document.hidden !== "undefined") {
    return "visibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    return "msVisibilityState";
  } else if (typeof document.webkitHidden !== "undefined") {
    return "webkitVisibilityState";
  }
  return null;
}

function getIsDocumentHidden(visibilityProp) {
    if(!visibilityProp) return false;
    return document[visibilityProp] === 'hidden';
}

export function usePageVisibility() {
  const visibilityProp = getBrowserVisibilityProp();
  const [isVisible, setIsVisible] = useState(visibilityProp ? !getIsDocumentHidden(visibilityProp) : true);

  useEffect(() => {
    if (!visibilityProp) return;

    const handleChange = () => {
      setIsVisible(!getIsDocumentHidden(visibilityProp));
    };

    const visibilityChange = visibilityProp.replace(/state/i, 'change').toLowerCase();

    document.addEventListener(visibilityChange, handleChange);
    return () => {
      document.removeEventListener(visibilityChange, handleChange);
    };
  }, [visibilityProp]);

  return isVisible;
}