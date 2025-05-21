// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useTheme } from '@/providers/theme-provider';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

// import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '@/providers/theme-provider';

const MainMiddleware = () => {
  const { theme: darkOrLight } = useTheme();
  const navigate = useNavigate();
  const [token] = useLocalStorage('token', null);

  useEffect(() => {
    // TODO: agar user bo'lsa ro'le ga qarab qayerga yo'naltirish kerakligini yozing agar user bo'lmasa qayerga yo'naltirish kerakligini yozing men bu yerda anniq path no ma'lum ekanligi uchun bir xil yozib qo'ya qoldim
    // navigate(user ? `/dashboard` : `/dashboard/users`);
    console.log(token);
    if (token === null || token === undefined) {
      navigate(`register`);
    } else {
      navigate(`dashboard/home`);
    }
  }, [navigate, token]);
  return (
    <div className="cw-screen h-screen w-full dark:text-white text-black ">
      <ConfigProvider
        theme={{
          algorithm:
            darkOrLight === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm
        }}
      >
        <Outlet />
      </ConfigProvider>
    </div>
  );
};

export default MainMiddleware;
