import StartPage from '@/pages/StartPage';
import DetailsPage from '@/pages/DetailsPage';
import MainLayout from '@/layout/MainLayout';

export const routes = [
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
		],
	},
];
