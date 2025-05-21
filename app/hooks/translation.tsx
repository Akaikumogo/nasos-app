import { useLang } from '@/providers/LangProvider';

export const useTranslation = () => {
  const { lang } = useLang();
  return (dict: Record<'uz' | 'ru' | 'en', string>) =>
    dict[lang as keyof typeof dict];
};
