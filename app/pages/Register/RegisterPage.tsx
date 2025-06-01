/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from '@/hooks/translation';
import { useLang } from '@/providers/LangProvider';
import { useValidify } from '@/hooks/useValidify';
import { App, Button, Input, Select } from 'antd';
import ErrorText from '@/shared/ui/ErrorText';
import { formatPhoneNumber, unformatPhoneNumber } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toogle';
import useCapacitorStorage from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

// import { Eye, EyeOff, Lock, User } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ModeToggle } from '@/components/mode-toogle';

const LoginPage = () => {
  type loginPayload = {
    phoneNumber: string;
    password: string;
  };
  const { lang, setLang } = useLang();
  const t = useTranslation();
  const {
    state,
    handleChange,
    stateValidation,
    checkByField,
    setStateValidation,
    checkValidation
  } = useValidify<loginPayload, ['phoneNumber', 'password']>({
    requiredFields: ['phoneNumber', 'password'],
    rules: {
      phoneNumber: (value: string | undefined): boolean => {
        const phoneRegex = /^\+998\d{9}$/;
        return !phoneRegex.test(value || '');
      },
      password: (password) => !(password?.length > 0)
    },
    autoValidateOnChange: false
  });
  const { mutate } = useMutation({
    mutationFn: async (data: loginPayload) => {
      fetch('http://185.217.131.96:4958/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setToken(data.data);
            return data;
          } else {
            throw new Error(data.message);
          }
        });
    }
  });
  const { message } = App.useApp();
  const [_, setToken] = useCapacitorStorage<string | null>('token', null);
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col w-full items-center justify-center ">
      <div className="w-screen p-4 max-w-md mx-auto ">
        <h1 className="text-center text-2xl font-semibold">
          {t({ uz: 'Kirish', ru: 'Вход', en: 'Login' })}
        </h1>
        <div className="  ">
          <div className="my-2">
            <h1 className="text-left">
              {t({
                uz: 'Telefon Raqami',
                en: 'Phone number',
                ru: 'Номер телефона'
              })}
            </h1>
            <div>
              <Input
                className="mt-2"
                placeholder={t({
                  uz: 'Telefon Raqamni kirting',
                  en: 'Enter your phone number',
                  ru: 'Введите номер телефона'
                })}
                defaultValue={'+998'}
                value={formatPhoneNumber(state?.phoneNumber || '+998')}
                onChange={(e) => {
                  if (unformatPhoneNumber(e.target.value).length <= 13) {
                    handleChange(
                      'phoneNumber',
                      unformatPhoneNumber(e.target.value)
                    );
                  }
                }}
                onBlur={() => checkByField('phoneNumber')}
                onFocus={() =>
                  setStateValidation((p) => ({ ...p, phoneNumber: false }))
                }
                status={stateValidation?.phoneNumber ? 'error' : ''}
              />
              <ErrorText
                error={stateValidation?.phoneNumber}
                message={t({
                  uz: 'Telefon Raqami xato',
                  en: 'Phone number is wrong',
                  ru: 'Неправильный номер телефона'
                })}
              />
            </div>
          </div>
          <div className="mb-2">
            <h1 className="text-left">
              {t({
                uz: 'Parol',
                en: 'Password',
                ru: 'Пароль'
              })}
            </h1>
            <div>
              <Input.Password
                className="mt-1"
                placeholder={t({
                  uz: 'Parolni kirting',
                  en: 'Enter your password',
                  ru: 'Введите пароль'
                })}
                value={state?.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => checkByField('password')}
                onFocus={() =>
                  setStateValidation((p) => ({ ...p, password: false }))
                }
                status={stateValidation?.password ? 'error' : ''}
              />
              <ErrorText
                error={stateValidation?.password}
                message={t({
                  uz: 'Parol xato',
                  en: 'Password is wrong',
                  ru: 'Неправильный пароль'
                })}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            type="primary"
            disabled={stateValidation.password && stateValidation.phoneNumber}
            onClick={() =>
              checkValidation(() => {
                mutate(
                  {
                    phoneNumber: state.phoneNumber || '',
                    password: state.password || ''
                  },
                  {
                    onSuccess: () => {
                      message.success({
                        content: t({
                          uz: 'Kirish muvaffaqiyatli',
                          en: 'Login successful',
                          ru: 'Вход выполнен успешно'
                        })
                      });
                      setToken(state.phoneNumber || '');

                      navigate('/dashboard/home');
                    },
                    onError: (error) => {
                      message.error({
                        content:
                          t({
                            uz: 'Kirishda xatolik',
                            en: 'Login error',
                            ru: 'Ошибка входа'
                          }) + `: ${error.message}`
                      });
                    }
                  }
                );
              })
            }
          >
            {t({ uz: 'Kirish', ru: 'Вход', en: 'Login' })}
          </Button>
        </div>{' '}
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

export default LoginPage;
