import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  GlobalStyles,
  Link,
  responsiveFontSizes,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Outlet } from 'react-router';

const genericGlobalStyles = (
  <GlobalStyles
    styles={() => ({
      html: { overflowY: 'scroll' },
    })}
  />
);

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
      {genericGlobalStyles}
      <Container sx={{ marginBottom: 12 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#fff',
          position: 'fixed',
          width: '100%',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid #eef',
          padding: 2,
        }}
      >
        <Typography variant="body2" align="center">
          This product uses data from the{' '}
          <Link
            href="https://nvd.nist.gov/developers/vulnerabilities"
            title="NVD API, opens in a new window"
          >
            NVD API
          </Link>{' '}
          but is not endorsed or certified by the NVD.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
