// LangContext.tsx
import { createContext, useContext } from 'react';
import useCapacitorStorage from '@/hooks/useLocalStorage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LangContext = createContext<any>(null);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useCapacitorStorage('lang', 'uz');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);
