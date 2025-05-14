import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { Outlet } from 'react-router';

export default function MainLayout() {
	return (
		<>
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
		</>
	);
}
