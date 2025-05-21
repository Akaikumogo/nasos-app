import DashboardLayout from '@/layout/Dashboard.layout';
import MainMiddleware from '@/middleware/MainMiddleware';
import Home from '@/pages/Home/Home';

import RegisterPage from '@/pages/Register/RegisterPage';
import Settings from '@/pages/Settings.tsx/Settings';

import { PageTransition } from '@/shared/Motion';

export const router = [
  {
    path: '/',
    element: <MainMiddleware />,
    children: [
      // TODO: Asosiy Router shu yerda yoziladi
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'settings',
            element: <Settings />
          },
          {
            path: 'home',
            element: <Home />
          },
          {
            path: '*',
            element: '404'
          }
        ].map((route) => ({
          ...route,
          element: <PageTransition>{route.element}</PageTransition>
        }))
      },
      {
        path: 'register',
        element: (
          <PageTransition>
            <RegisterPage />
          </PageTransition>
        )
      }
    ]
  }
];
