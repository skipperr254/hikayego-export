import { useState, useEffect, useCallback } from 'react';

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  const updateDeviceType = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    setDeviceType({
      isMobile: width < 768,
      isTablet: width >= 768 && width <= 1024,
      isDesktop: width > 1024
    });
  }, []);

  useEffect(() => {
    updateDeviceType();

    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateDeviceType();
      }, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [updateDeviceType]);

  return deviceType;
}