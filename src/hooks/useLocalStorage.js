import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        // Check if weekly goal needs reset
        if (key === 'weeklyStoryGoal' && parsedItem.timestamp) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            if (new Date().getTime() - parsedItem.timestamp > oneWeek) {
                // It's been more than a week, reset to initial value
                const newValue = { value: initialValue, timestamp: new Date().getTime() };
                window.localStorage.setItem(key, JSON.stringify(newValue));
                return newValue.value;
            }
        }
        return parsedItem.value !== undefined ? parsedItem.value : parsedItem;
      }
      // For new users or if item doesn't exist, set initial value with timestamp
      const initialItem = { value: initialValue, timestamp: new Date().getTime() };
      window.localStorage.setItem(key, JSON.stringify(initialItem));
      return initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const itemToStore = { value: valueToStore, timestamp: new Date().getTime() };
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(itemToStore));
    } catch (error) {
      console.log(error);
    }
  };

  // Listen for changes to this key in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          const parsedItem = JSON.parse(e.newValue);
          setStoredValue(parsedItem.value);
        } catch (error) {
          console.log(error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;