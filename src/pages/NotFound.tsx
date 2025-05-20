import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link as RouterLink } from 'react-router';

export default function NotFound() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        height: '90vh',
      }}
    >
      <CssBaseline />
      <Box component="header">
        <Typography
          variant="h1"
          component="h1"
          sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
          404{' '}
          <WarningAmberIcon
            sx={{
              width: { xs: 50, sm: 70, md: 90 },
              height: { xs: 50, sm: 70, md: 90 },
              marginLeft: 2,
            }}
          />
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Page not found
        </Typography>
      </Box>
      <Grid component="main">
        <Typography variant="body1">
          Page you where looking for does not exits. <br />
          Go back to{' '}
          <Link component={RouterLink} to={'/'}>
            start page
          </Link>
          .
        </Typography>
      </Grid>
    </Container>
  );
}
