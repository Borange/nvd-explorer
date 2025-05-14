import SearchIcon from '@mui/icons-material/Search';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Grid,
	Pagination,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { VulnerabilitiesListView } from '@/components/tables/VulnerabilitiesListView';
import { useNvdApi } from '@/hooks/useNvdApi';

export default function StartPage() {
	const searchInput = useRef<HTMLInputElement>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [page, setPage] = useState<number>(1);
	const { loading, cveItems, errorMessage, totalResults, startIndex } =
		useNvdApi(searchTerm, page);

	return (
		<>
			<Box component="header" sx={{ mb: 4, mt: 4 }}>
				<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
					NVD Explorer
				</Typography>
			</Box>
			<Grid component="main">
				<Grid
					size={12}
					component="form"
					onSubmit={(event) => {
						event.preventDefault();
						setSearchTerm(searchInput.current?.value as string);
					}}
					sx={{ mb: 4 }}
				>
					<TextField
						type="search"
						placeholder="Enter a search term"
						variant="standard"
						sx={{ pr: 4, width: 400 }}
						inputRef={searchInput}
					></TextField>
					<Button
						variant="contained"
						size="large"
						endIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
						type="submit"
						disabled={loading}
					>
						Search
					</Button>
				</Grid>
				<Grid size={12}>
					{errorMessage ? (
						<Alert variant="standard" severity="error">
							{errorMessage}
						</Alert>
					) : (
						<Box
							sx={{
								opacity: loading ? 0.5 : 1,
								transition: 'opacity 0.2s ease-in-out',
							}}
						>
							<VulnerabilitiesListView cveItems={cveItems} />
						</Box>
					)}
					<Stack
						spacing={2}
						sx={{ mt: 4, mb: 12, display: 'flex', alignItems: 'center' }}
					>
						{totalResults > 0 && (
							<Pagination
								aria-label="Pagination"
								count={Math.floor(totalResults / 100)}
								page={startIndex}
								onChange={(_, number) => {
									setPage(number);
								}}
							/>
						)}
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
