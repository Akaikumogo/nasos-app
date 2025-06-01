// LangContext.tsx
import { createContext, useContext, useEffect } from 'react';
import useCapacitorStorage from '@/hooks/useLocalStorage';
import { Network } from '@capacitor/network';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LangContext = createContext<any>(null);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useCapacitorStorage('lang', 'uz');

  useEffect(() => {
    const tryRedirectToLiveServer = async () => {
      const status = await Network.getStatus();
      const isOnline = status.connected;
      const isLocal = !window.location.href.includes('185.217.131.96');

      if (isOnline && isLocal) {
        window.location.href = 'http://185.217.131.96:5173';
      }
    };

    tryRedirectToLiveServer();
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);
