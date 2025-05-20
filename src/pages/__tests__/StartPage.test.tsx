import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNvdApi, type UseNvdApi } from '@/hooks/useNvdApi';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import StartPage from '@/pages/StartPage';

const mockUseNvdApi = vi.hoisted(
  () =>
    ({
      cveItems: [],
      loading: false,
      errorMessage: '',
      totalResults: 0,
      startIndex: 0,
    }) as UseNvdApi,
);

vi.mock('@/hooks/useNvdApi', () => ({
  useNvdApi: vi.fn(() => mockUseNvdApi),
}));

describe('Start page', () => {
  const setup = () => {
    return render(<StartPage />, { wrapper: BrowserRouter });
  };

  afterEach(() => {
    mockUseNvdApi.cveItems = [];
    mockUseNvdApi.loading = false;
    mockUseNvdApi.errorMessage = '';
    mockUseNvdApi.totalResults = 0;
    mockUseNvdApi.startIndex = 0;
  });

  test('Start page renders', () => {
    setup();
    expect(
      screen.getByText('National Vulnerability Database Explorer'),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.queryByTitle('Pagination')).not.toBeInTheDocument();
  });

  test('Show list of vulnerabilities', async () => {
    setup();

    await userEvent.type(screen.getByRole('searchbox'), 'test');

    mockUseNvdApi.cveItems = [
      {
        id: 'test-id',
        vulnStatus: 'test-status',
        descriptions: [{ lang: 'en', value: 'a description' }],
        lastModified: '2025-04-04T05:04:51.193',
        published: '2025-04-03T05:03:51.193',
        references: [],
      },
    ];

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(useNvdApi).toHaveBeenCalledWith('test', 1);
    expect(window.location.search).toEqual('?keywordSearch=test&startIndex=1');

    await userEvent.clear(screen.getByRole('searchbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(window.location.search).toEqual('?startIndex=1');

    expect(
      screen.getByRole('cell', { name: 'test-status' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'a description' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: '2025-04-04' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: '2025-04-03' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'test-id' }));

    expect(window.location.href).toContain('/details');
  });

  test('Show loading and hide loading', () => {
    mockUseNvdApi.loading = true;
    const { rerender } = setup();
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();

    mockUseNvdApi.loading = false;
    rerender(<StartPage />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  test('Show and hide error message', () => {
    mockUseNvdApi.errorMessage = 'error message';
    const { rerender } = setup();
    expect(screen.getByText('error message')).toBeInTheDocument();

    mockUseNvdApi.errorMessage = '';
    rerender(<StartPage />);
    expect(screen.queryByText('error message')).not.toBeInTheDocument();
  });

  test('Renders pagination', async () => {
    mockUseNvdApi.startIndex = 1;
    mockUseNvdApi.totalResults = 301;
    setup();

    await userEvent.type(screen.getByRole('searchbox'), 'many');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to page 2' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(window.location.search).toEqual('?keywordSearch=many&startIndex=3');
  });

  test('Pagination not rendered', () => {
    mockUseNvdApi.startIndex = 1;
    mockUseNvdApi.totalResults = 99;
    setup();

    expect(
      screen.queryByRole('button', { name: 'page 1' }),
    ).not.toBeInTheDocument();
  });
});
