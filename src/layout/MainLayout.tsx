import {
	Box,
	Container,
	createTheme,
	CssBaseline,
	responsiveFontSizes,
	ThemeProvider,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Outlet } from 'react-router';

const mainTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
	palette: {
		primary: {
			light: '#757ce8',
			main: '#3f50b5',
			dark: '#002884',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#f44336',
			dark: '#ba000d',
			contrastText: '#000',
		},
	},
});

export default function MainLayout() {
	const location = useLocation();
	const [title, setTitle] = useState<string>('');

	useEffect(() => {
		if (location.pathname === '/') {
			setTitle('National Vulnerability Database Explorer');
		} else if (location.pathname.includes('/details')) {
			setTitle(
				'National Vulnerability Database Explorer | Details | ' +
					location.pathname.split('/').pop(),
			);
		}
	}, [location]);

	return (
		<ThemeProvider theme={responsiveFontSizes(mainTheme)}>
			<title>{title}</title>
			<CssBaseline />
			<Container>
				<Outlet />
			</Container>
			<Box component="footer">
				<Typography variant="body2" align="center">
					This product uses data from the NVD API but is not endorsed or
					certified by the NVD.
				</Typography>
			</Box>
		</ThemeProvider>
	);
}
