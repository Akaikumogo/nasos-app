import { ModeToggle } from '@/components/mode-toogle';
import { useTranslation } from '@/hooks/translation';
import { useLang } from '@/providers/LangProvider';
import { Select } from 'antd';

const Settings = () => {
  const t = useTranslation();
  const { lang, setLang } = useLang();
  return (
    <div className="text-black dark:text-white">
      <h1 className="mt-2 text-center text-2xl">
        {t({ uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' })}
      </h1>
      <div className="mt-4">
        {' '}
        <div className="flex  items-center justify-center gap-2 mt-5">
          <Select
            className="w-full mt-2"
            options={[
              {
                value: 'en',
                label: (
                  <span className="flex items-center gap-2">
                    <img src="/en.png" alt="English" className="w-[25px]" />
                    English
                  </span>
                )
              },
              {
                value: 'uz',
                label: (
                  <span className="flex items-center gap-2">
                    <img src="/uz.png" alt="O'zbekcha" className="w-[25px]" />
                    O'zbekcha
                  </span>
                )
              },
              {
                value: 'ru',
                label: (
                  <span className="flex items-center gap-2">
                    <img src="/ru.png" alt="Русский" className="w-[25px]" />{' '}
                    Русский
                  </span>
                )
              }
            ]}
            value={lang}
            onChange={(value) => setLang(value)}
          />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Settings;
