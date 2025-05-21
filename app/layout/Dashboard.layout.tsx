import { Outlet, NavLink } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/translation';
const DashboardLayout = () => {
  const t = useTranslation();
  const dispatcherNav = [
    {
      icon: Home,
      label: t({
        uz: 'Bosh sahifa',
        ru: 'Главная',
        en: 'Home'
      }),
      path: '/dashboard/home'
    },
    {
      icon: Settings,
      label: t({
        uz: 'Sozlamalar',
        ru: 'Настройки',
        en: 'Settings'
      }),
      path: '/dashboard/settings'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
      <main className="h-[calc(100v-4.5rem)] pb-20 overflow-y-auto p-4 noScroll ">
        <Outlet />
      </main>
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="h-18   bg-white dark:bg-black  fixed bottom-0 left-0 right-0 z-[101] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-center gap-2  h-full max-w-md mx-auto px-2 ">
          {dispatcherNav.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={() => `
                relative flex flex-col items-center justify-center
                transition-all duration-200 py-2 min-w-[80px]
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-blue-500 dark:bg-blue-600 rounded-xl "
                      transition={{ type: 'spring', duration: 0.8 }}
                    />
                  )}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center justify-center z-50 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <motion.span
                    className={`text-[8px] font-bold  z-50 mt-1 ${
                      isActive ? ' text-white' : 'text-gray-500'
                    }`}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default DashboardLayout;
