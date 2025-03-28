import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

function useCapacitorStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const item = await Preferences.get({ key });
        if (item.value) {
          setStoredValue(JSON.parse(item.value));
        }
      } catch (error) {
        console.error('Error loading storage:', error);
      }
    };

    loadStorage();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await Preferences.set({ key, value: JSON.stringify(valueToStore) });
    } catch (error) {
      console.error('Error setting storage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useCapacitorStorage;
