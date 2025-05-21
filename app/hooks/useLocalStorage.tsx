import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

/**
 * React hook to use local storage with the capacitor preferences plugin.
 *
 * @example
 * const [token, setToken] = useCapacitorStorage('token', '');
 * setToken('new token');
 *
 * @param key The key to store the value under.
 * @param initialValue The value to return if the key is not set.
 * @returns An array where the first element is the stored value and the second element is a function to set a new value.
 */
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
