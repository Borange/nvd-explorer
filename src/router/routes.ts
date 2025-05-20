import StartPage from '@/pages/StartPage';
import DetailsPage from '@/pages/DetailsPage';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/layout/MainLayout';
import type { RouteObject } from 'react-router';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        Component: StartPage,
        index: true,
      },
      {
        Component: DetailsPage,
        path: '/details/:id',
      },
      {
        Component: NotFound,
        path: '*',
      },
    ],
  },
];

export const titles = [
  {
    path: '/',
    title: '',
  },
  {
    path: '/details',
    title: '',
  },
];
