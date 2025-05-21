import { useState } from 'react';
import { Card, Button, Statistic, Modal, Input, TimePicker, Form } from 'antd';
import { Clock, Droplet, Zap, Settings } from 'lucide-react';
import Watch from '@/components/Watch';
import { useTranslation } from '@/hooks/translation';

const Home = () => {
  const t = useTranslation();

  const [isSetTimerModalOpen, setIsSetTimerModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [timerValue, setTimerValue] = useState(null); // TimePicker uchun
  const [form] = Form.useForm();

  const showTimerModal = () => setIsSetTimerModalOpen(true);
  const showInputModal = () => setIsInputModalOpen(true);

  const handleTimerOk = () => {
    if (timerValue) {
      console.log('Timer set to:', timerValue?.format('HH:mm:ss'));
    } else {
      console.log('No timer value set');
    }
    setIsSetTimerModalOpen(false);
  };

  const handleInputOk = () => {
    form.validateFields().then((values) => {
      console.log('Input Data:', values);
      setIsInputModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="p-2">
      <h1 className="text-center text-3xl font-semibold mb-6">
        {t({ uz: 'Bosh sahifa', ru: 'Главная', en: 'Main page' })}
      </h1>

      {/* Joriy Vaqt */}
      <div className="my-2 w-full">
        <Card className="shadow-md w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" />
              <h2 className="text-xl font-semibold">
                {t({
                  uz: 'Joriy Vaqt',
                  ru: 'Текущее время',
                  en: 'Current time'
                })}
              </h2>
            </div>
            <Watch />
          </div>
        </Card>
      </div>

      {/* Timer */}
      <div className="my-2 w-full">
        <Card className="shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            {t({
              uz: 'Nasos uchun vaqt timeri',
              ru: 'Таймер для насоса',
              en: 'Pump Timer'
            })}
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div className="text-5xl font-bold">0:00</div>
            <div className="flex flex-col gap-2">
              <Button type="primary">
                {t({ uz: 'Boshlash', ru: 'Старт', en: 'Start Timer' })}
              </Button>
              <Button onClick={showTimerModal}>
                {t({ uz: 'Sozlash', ru: 'Настроить', en: 'Set Timer' })}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Suv Ma'lumotlari */}
      <div className="my-2 w-full">
        <Card
          title={t({
            uz: "Suv Ma'lumotlari",
            ru: 'Инфо по воде',
            en: 'Water Information'
          })}
          className="shadow-md w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <Zap className="text-yellow-500" />
                  {t({ uz: 'Elektr sarfi', ru: 'Энергия', en: 'Electricity' })}
                </span>
              }
              value="0"
              suffix="kW"
            />
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <Droplet className="text-blue-500" />
                  {t({
                    uz: 'Mavjud Suv',
                    ru: 'Остаток воды',
                    en: 'Available Water'
                  })}
                </span>
              }
              value="200"
              suffix="l"
            />
            <Statistic
              title={
                <span className="flex items-center gap-2">
                  <Droplet className="text-red-500" />
                  {t({
                    uz: 'Sarflangan Suv',
                    ru: 'Потрачено',
                    en: 'Used Water'
                  })}
                </span>
              }
              value="0.022222"
              precision={6}
            />
          </div>
        </Card>
      </div>

      {/* Parametrlar */}
      <div className="text-center mt-6">
        <Button
          className="w-full"
          type="primary"
          icon={<Settings className="mt-1" />}
          size="large"
          onClick={showInputModal}
        >
          {t({ uz: "Ma'lumot kiritish", ru: 'Ввод данных', en: 'Input Data' })}
        </Button>
      </div>

      {/* Timer Modal */}
      <Modal
        title={t({
          uz: 'Timer sozlash',
          ru: 'Настройка таймера',
          en: 'Set Timer'
        })}
        open={isSetTimerModalOpen}
        onOk={handleTimerOk}
        onCancel={() => setIsSetTimerModalOpen(false)}
        okText={t({ uz: 'Saqlash', ru: 'Сохранить', en: 'Save' })}
        cancelText={t({ uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' })}
      >
        <TimePicker
          className="w-full"
          onChange={(value) => setTimerValue(value)}
          value={timerValue}
          format="HH:mm:ss"
        />
      </Modal>

      {/* Input Data Modal */}
      <Modal
        title={t({
          uz: 'Maʼlumot kiritish',
          ru: 'Ввод данных',
          en: 'Input Data'
        })}
        open={isInputModalOpen}
        onOk={handleInputOk}
        onCancel={() => setIsInputModalOpen(false)}
        okText={t({ uz: 'Saqlash', ru: 'Сохранить', en: 'Save' })}
        cancelText={t({ uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' })}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="bandlik"
            label={t({
              uz: 'Bandlik son qiymatini kiriting',
              ru: 'Введите значение бендлика',
              en: 'Enter the value of the bandlik'
            })}
            rules={[{ required: true, message: 'Majburiy maydon' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
