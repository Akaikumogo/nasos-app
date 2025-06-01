/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/Home/Home.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Card,
  Button,
  Statistic,
  Modal,
  Input,
  TimePicker,
  Form,
  Spin,
  message,
  Select
} from 'antd';
import { Clock, Droplet, Zap, Settings } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

// ----------------------------------------------------------------
// Translation Hook Stub (replace with your real i18n solution)
// ----------------------------------------------------------------
const useTranslation = () => {
  return (texts: { uz: string; ru: string; en: string }) => {
    return texts.en;
  };
};

// ----------------------------------------------------------------
// Types / Interfaces
// ----------------------------------------------------------------
interface User {
  username: string;
  password: string;
  waterDepth: number;
  waterHeight: number; // Desired height
  totalLitres: number;
  totalWater: number;
  totalElectricity: number;
  motorState: 'on' | 'off';
  timerRemaining: string; // "HH:mm"
  lastTimerTime?: string; // ISO string
  lastHeartbeat?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface UserPatchPayload {
  waterDepth?: number;
  totalWater?: number;
  waterHeight?: number;
  totalLitres?: number;
  totalElectricity?: number;
  motorState?: 'on' | 'off';
  timerRemaining?: string; // "HH:mm"
  lastTimerTime?: string; // ISO string
  lastHeartbeat?: string; // ISO string
}

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------
const USERNAME = '998991751037'; // Hardcoded username used in backend
const API_BASE = 'http://localhost:4958'; // Backend base URL

// ----------------------------------------------------------------
// API Helpers (Axios)
// ----------------------------------------------------------------
async function fetchUser(): Promise<User> {
  const response = await axios.get<User>(`${API_BASE}/users/${USERNAME}`);
  return response.data;
}

async function patchUserApi(payload: UserPatchPayload): Promise<User> {
  const response = await axios.patch<User>(
    `${API_BASE}/users/${USERNAME}`,
    payload
  );
  return response.data;
}

// ----------------------------------------------------------------
// Simple Clock Component (updates every second)
// ----------------------------------------------------------------
const Watch: React.FC = () => {
  const [now, setNow] = useState(dayjs());
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="text-xl font-mono">{now.format('HH:mm:ss')}</span>;
};

// ----------------------------------------------------------------
// Main HomeContent Component (uses React Query hooks)
// ----------------------------------------------------------------
const HomeContent: React.FC = () => {
  const t = useTranslation();
  const queryClient = useQueryClient();

  // Modals
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isHeightModalOpen, setIsHeightModalOpen] = useState(false);

  // TimePicker value
  const [timerValue, setTimerValue] = useState<Dayjs | null>(null);
  const [m3, setm3] = useState<boolean>(true);
  // Countdown seconds and display
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
  const [displayTimer, setDisplayTimer] = useState('00:00:00');

  // Height form
  const [heightForm] = Form.useForm();
  const [heightInput, setHeightInput] = useState<number | undefined>(undefined);

  // -----------------------------
  // 1) Fetch user data with useQuery
  // -----------------------------
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<User, Error>({
    queryKey: ['user', USERNAME],
    queryFn: fetchUser,
    refetchInterval: 5000
  });

  // Whenever user.timerRemaining changes, initialize countdownSeconds
  useEffect(() => {
    if (user) {
      const [h, m] = user.timerRemaining.split(':').map(Number);
      const totalSecs = h * 3600 + m * 60;
      setCountdownSeconds(totalSecs > 0 ? totalSecs : null);
      if (totalSecs > 0) {
        setDisplayTimer(
          dayjs().startOf('day').add(totalSecs, 'second').format('HH:mm:ss')
        );
      } else {
        setDisplayTimer('00:00:00');
      }
    }
  }, [user, user?.timerRemaining]);

  // Decrement countdownSeconds every second
  useEffect(() => {
    if (countdownSeconds === null) return;
    if (countdownSeconds <= 0) {
      refetch();
      setCountdownSeconds(null);
      return;
    }
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        if (next >= 0) {
          setDisplayTimer(
            dayjs().startOf('day').add(next, 'second').format('HH:mm:ss')
          );
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownSeconds]);

  // -----------------------------
  // 2) Patch mutation with useMutation
  // -----------------------------
  const patchMutation = useMutation<User, Error, UserPatchPayload>({
    mutationFn: patchUserApi,

    /**
     * When the mutation is successful, show a success message and
     * invalidate the "user" query so that it is refetched.
     */
    onSuccess: () => {
      message.success(t({ uz: 'Yangilandi', ru: 'Обновлено', en: 'Updated' }));
      queryClient.invalidateQueries({ queryKey: ['user', USERNAME] });
    },
    onError: (err: Error) => {
      message.error(`Update failed: ${err.message}`);
    }
  });

  // -----------------------------
  // 3) Loading / Error states
  // -----------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin
          size="large"
          tip={t({ uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' })}
        />
      </div>
    );
  }
  if (isError || !user) {
    return (
      <div className="p-4">
        <h2 className="text-center text-red-600">
          {t({
            uz: 'Maʼlumotlarni olishda xatolik',
            ru: 'Ошибка при получении данных',
            en: 'Error fetching data'
          })}
          : {error?.message}
        </h2>
      </div>
    );
  }

  // -----------------------------
  // 4) Handlers
  // -----------------------------
  const openTimerModal = () => setIsTimerModalOpen(true);
  const closeTimerModal = () => {
    setIsTimerModalOpen(false);
    setTimerValue(null);
  };

  const openHeightModal = () => setIsHeightModalOpen(true);
  const closeHeightModal = () => {
    setIsHeightModalOpen(false);
    heightForm.resetFields();
    setHeightInput(undefined);
  };

  // When user clicks “Save” in Timer Modal
  const handleTimerOk = () => {
    if (!timerValue) {
      message.warning(
        t({
          uz: 'Vaqt tanlanmadi',
          ru: 'Время не выбрано',
          en: 'No time selected'
        })
      );
      return;
    }
    // Check motor can start: waterHeight > waterDepth
    if (user.waterHeight <= user.waterDepth) {
      message.error(
        t({
          uz: 'Balandlik suv chuqurligidan katta bo‘lishi kerak',
          ru: 'Высота должна быть больше уровня воды',
          en: 'Height must exceed water depth'
        })
      );
      closeTimerModal();
      return;
    }
    const hhmm = timerValue.format('HH:mm');
    // Start motor + set timerRemaining
    patchMutation.mutate({ timerRemaining: hhmm, motorState: 'on' });
    closeTimerModal();
  };

  // When user clicks “Save” in Height Modal
  const handleHeightOk = () => {
    heightForm
      .validateFields()
      .then(() => {
        if (heightInput === undefined) return;
        patchMutation.mutate({ waterHeight: heightInput });
        closeHeightModal();
      })
      .catch(() => {
        // Validation errors shown by Form.Item
      });
  };

  // Toggle motor on/off manually
  const handleToggleMotor = () => {
    const newState: 'on' | 'off' = user.motorState === 'on' ? 'off' : 'on';
    patchMutation.mutate({ motorState: newState });
  };

  // Stop timer (set to "00:00" and motor off)
  const handleStopTimer = () => {
    patchMutation.mutate({ timerRemaining: '00:00', motorState: 'off' });
  };

  // Height input change
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHeightInput(Number(e.target.value));
  };

  // -----------------------------
  // 5) Render UI
  // -----------------------------
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <h1 className="text-center text-3xl font-semibold">
        {t({ uz: 'Bosh sahifa', ru: 'Главная', en: 'Main page' })}
      </h1>

      {/* Motor Status Card */}
      <Card className="shadow-lg" bodyStyle={{ padding: '1rem' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-600" size={20} />
            <h2 className="text-xl font-medium">
              {t({
                uz: 'Motor holati',
                ru: 'Состояние мотора',
                en: 'Motor Status'
              })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold capitalize">{user.motorState}</span>
            <span
              className={`w-3 h-3 rounded-full ${
                user.motorState === 'on' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Button size="small" onClick={handleToggleMotor}>
              {user.motorState === 'on'
                ? t({ uz: 'O‘chirish', ru: 'Выключить', en: 'Turn Off' })
                : t({ uz: 'Yoqish', ru: 'Включить', en: 'Turn On' })}
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Time Card */}
      <Card className="shadow-lg" bodyStyle={{ padding: '1rem' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={20} />
            <h2 className="text-xl font-medium">
              {t({ uz: 'Joriy vaqt', ru: 'Текущее время', en: 'Current time' })}
            </h2>
          </div>
          <Watch />
        </div>
      </Card>

      {/* Pump Timer Card */}
      <Card className="shadow-lg" bodyStyle={{ padding: '1rem' }}>
        <h2 className="text-lg font-medium mb-2">
          {t({
            uz: 'Nasos uchun timer',
            ru: 'Таймер насоса',
            en: 'Pump Timer'
          })}
        </h2>
        <div className="flex justify-between items-center">
          <div className="text-4xl font-bold">{displayTimer}</div>
          <div className="space-y-2">
            {user.motorState === 'on' ? (
              <Button type="primary" onClick={handleStopTimer}>
                {t({ uz: 'Stop', ru: 'Стоп', en: 'Stop Timer' })}
              </Button>
            ) : (
              <Button onClick={openTimerModal}>
                {t({ uz: 'Sozlash', ru: 'Настроить', en: 'Set Timer' })}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Water Information Card */}
      <Card
        className="shadow-lg"
        title={t({
          uz: "Suv ma'lumotlari",
          ru: 'Инфо по воде',
          en: 'Water Information'
        })}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Statistic
            title={
              <span className="flex items-center gap-1">
                <Zap className="text-yellow-500" size={16} />
                {t({ uz: 'Elektr sarfi', ru: 'Энергия', en: 'Electricity' })}
              </span>
            }
            value={user.totalElectricity}
            precision={2}
            suffix="kW"
          />
          <Statistic
            title={
              <span className="flex items-center gap-1">
                <Droplet className="text-blue-500" size={16} />
                {t({
                  uz: 'Mavjud suv',
                  ru: 'Остаток воды',
                  en: 'Available Water'
                })}
              </span>
            }
            value={user.waterDepth}
            suffix="cm"
          />
          <Statistic
            title={
              <span className="flex items-center gap-1">
                <Droplet className="text-red-500" size={16} />
                {t({ uz: 'Sarflangan suv', ru: 'Потрачено', en: 'Used Water' })}
              </span>
            }
            value={m3 ? user.totalLitres / 1000 : user.totalLitres}
            precision={2}
            suffix={
              <div className="flex items-start justify-end">
                <Select
                  className="w-[80px]"
                  variant="filled"
                  value={m3}
                  onChange={(value) => setm3(value)}
                  options={[
                    {
                      value: false,
                      label: 'L'
                    },
                    { value: true, label: 'm3' }
                  ]}
                />
              </div>
            }
          />
        </div>
      </Card>

      {/* Height Input Button */}
      <div className="text-center mt-4">
        <Button
          type="primary"
          onClick={openHeightModal}
          size="large"
          icon={<Settings size={16} />}
        >
          {t({
            uz: 'Balandlik kiritish',
            ru: 'Ввод высоты',
            en: 'Input Height'
          })}
        </Button>
      </div>

      {/* Timer Modal */}
      <Modal
        title={t({
          uz: 'Timer sozlash',
          ru: 'Настройка таймера',
          en: 'Set Timer'
        })}
        open={isTimerModalOpen}
        onOk={handleTimerOk}
        onCancel={closeTimerModal}
        okText={t({ uz: 'Saqlash', ru: 'Сохранить', en: 'Save' })}
        cancelText={t({ uz: 'Bekor', ru: 'Отмена', en: 'Cancel' })}
      >
        <TimePicker
          className="w-full"
          format="HH:mm"
          value={timerValue}
          onChange={(val) => setTimerValue(val)}
        />
        {user.waterHeight <= user.waterDepth && (
          <p className="mt-2 text-red-600">
            {t({
              uz: 'Diqqat: Balandlik suv chuqurligidan kichik yoki teng, motor boshlanmaydi.',
              ru: 'Внимание: Высота меньше или равна уровню воды, мотор не запустится.',
              en: 'Warning: Height ≤ water depth; motor will not start.'
            })}
          </p>
        )}
      </Modal>

      {/* Height Input Modal */}
      <Modal
        title={t({
          uz: 'Balandlik kiritish',
          ru: 'Ввод высоты',
          en: 'Input Height'
        })}
        open={isHeightModalOpen}
        onOk={handleHeightOk}
        onCancel={closeHeightModal}
        okText={t({ uz: 'Saqlash', ru: 'Сохранить', en: 'Save' })}
        cancelText={t({ uz: 'Bekor', ru: 'Отмена', en: 'Cancel' })}
      >
        <Form form={heightForm} layout="vertical">
          <Form.Item
            name="height"
            label={t({
              uz: 'Balandlik (cm)',
              ru: 'Высота (см)',
              en: 'Height (cm)'
            })}
            rules={[
              {
                required: true,
                message: t({
                  uz: 'Iltimos, qiymat kiriting',
                  ru: 'Пожалуйста, введите значение',
                  en: 'Please enter a value'
                })
              },
              {
                pattern: /^\d+$/,
                message: t({
                  uz: 'Faqat butun son kiriting',
                  ru: 'Введите целое число',
                  en: 'Enter a whole number'
                })
              }
            ]}
          >
            <Input
              value={heightInput}
              onChange={handleHeightChange}
              placeholder="0"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// ----------------------------------------------------------------
// Wrap HomeContent in QueryClientProvider in the page entrypoint
// ----------------------------------------------------------------
const queryClient = new QueryClient();

const HomePage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
};

export default HomePage;
