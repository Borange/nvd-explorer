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
import { useEffect, useRef, useState } from 'react';
import { VulnerabilitiesListView } from '@/components/tables/VulnerabilitiesListView';
import { useNvdApi } from '@/hooks/useNvdApi';
import { createSearchParams, useSearchParams } from 'react-router';

export default function StartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('keywordSearch') || '',
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get('startIndex')) || 1,
  );
  const {
    loading,
    cveItems,
    errorMessage,
    errorType,
    totalResults,
    startIndex,
  } = useNvdApi(searchTerm, page);

  useEffect(() => {
    const params = searchTerm
      ? createSearchParams({
          keywordSearch: searchTerm,
          startIndex: String(page || 1),
        })
      : createSearchParams({ startIndex: String(page || 1) });

    setSearchParams(params);
  }, [searchTerm, setSearchParams, page]);

  return (
    <>
      <Box component="header" sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          National Vulnerability Database Explorer
        </Typography>
      </Box>
      <Grid component="main">
        <Grid
          size={12}
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            setSearchTerm(searchInput.current?.value as string);
            setPage(1);
          }}
          sx={{ mb: 4 }}
        >
          <TextField
            type="search"
            placeholder="Enter a search term"
            variant="standard"
            sx={{
              pr: 4,
              width: { xs: 'calc(100% - 40px)', sm: 400 },
            }}
            inputRef={searchInput}
            defaultValue={searchTerm}
          ></TextField>
          <Button
            variant="contained"
            size="large"
            endIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            type="submit"
            disabled={loading}
            sx={{
              transition: 'all 0.5s ease-in-out',
              position: { xs: 'absolute', sm: 'relative' },
              right: { xs: '0', sm: 'auto' },
              '&.Mui-disabled': {
                background: '#fff',
                color: '#3f50b5',
              },
            }}
          >
            <Typography
              sx={{
                overflow: 'hidden',
                width: { xs: 0, sm: 'auto' },
                opacity: { xs: 0, sm: 1 },
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Typography>
          </Button>
        </Grid>
        <Grid size={12}>
          {errorMessage ? (
            <Alert variant="standard" severity={errorType}>
              {errorMessage}
            </Alert>
          ) : (
            <Box
              sx={{
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s ease-in-out',
              }}
            >
              <VulnerabilitiesListView
                cveItems={cveItems}
                vulnerability={searchTerm}
                loading={loading}
              />
            </Box>
          )}
          <Stack
            spacing={2}
            sx={{ mt: 4, mb: 12, display: 'flex', alignItems: 'center' }}
          >
            {totalResults > 100 && (
              <Pagination
                aria-label="Pagination"
                count={Math.floor(totalResults / 100)}
                page={startIndex}
                onChange={(_, number) => {
                  setPage(number);
                }}
                color="primary"
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
