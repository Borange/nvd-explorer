import { renderHook, waitFor } from '@testing-library/react';
import { useNvdApi, type UseNvdApi } from '@/hooks/useNvdApi';
import '@testing-library/jest-dom';
import { NvdError, type NvdErrorType } from '@/utils/nvdApiUtils';

const mockNvdApiUtils = vi.hoisted(() => ({
	getVulnerabilities: vi.fn(),
	loadApi: vi.fn(),
	paramsToString: vi.fn(),
}));

vi.mock(import('@/utils/nvdApiUtils'), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		nvdApiUtils: mockNvdApiUtils,
	};
});

const verifyInitialState = (nvdApi: UseNvdApi) => {
	expect(nvdApi.cveItems).toHaveLength(0);
	expect(nvdApi.errorMessage).toEqual('');
	expect(nvdApi.loading).toEqual(true);
	expect(nvdApi.startIndex).toEqual(0);
	expect(nvdApi.totalResults).toEqual(0);
	expect(nvdApi.errorType).toBeUndefined();
};

const verifyErrorState = (nvdApi: UseNvdApi) => {
	expect(nvdApi.cveItems).toHaveLength(0);
	expect(nvdApi.loading).toEqual(false);
	expect(nvdApi.startIndex).toEqual(0);
	expect(nvdApi.totalResults).toEqual(0);
};

describe('useNvdApi', () => {
	beforeEach(() => {
		// Mock this as it is not supported js-dom
		// https://github.com/jsdom/jsdom/issues/1422
		window.scrollTo = vi.fn();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test('Make API call and return a valid response', async () => {
		mockNvdApiUtils.getVulnerabilities.mockResolvedValue({
			items: [
				{
					id: 'test-id',
					vulnStatus: 'test-status',
					descriptions: [{ lang: 'en', value: 'a description' }],
					lastModified: '2025-04-04T05:04:51.193',
					published: '2025-04-03T05:03:51.193',
					references: [{ url: 'https://localhost.local' }],
				},
			],
			totalResults: 1,
			startIndex: 1,
		});

		const { result } = renderHook(() => useNvdApi(''));
		verifyInitialState(result.current);

		await waitFor(() => {
			expect(result.current.cveItems).toHaveLength(1);
			expect(result.current.errorMessage).toEqual('');
			expect(result.current.loading).toEqual(false);
			expect(result.current.startIndex).toEqual(1);
			expect(result.current.totalResults).toEqual(1);
			expect(result.current.errorType).toBeUndefined();
		});
	});

	test('Make API call and return error message', async () => {
		mockNvdApiUtils.getVulnerabilities.mockRejectedValue(new Error('error'));

		const { result } = renderHook(() => useNvdApi(''));
		verifyInitialState(result.current);

		await waitFor(() => {
			expect(result.current.errorMessage).toEqual(
				'Unexpected error happened. Contact support.',
			);
			expect(result.current.errorType).toEqual('error');
			verifyErrorState(result.current);
		});
	});

	test.each([
		{ message: 'Keyword search too broad', type: 'info' },
		{ message: 'You are unauthorized', type: 'warning' },
		{ message: 'Internal server error', type: 'error' },
	])('Handle error in API call and return %s', async ({ message, type }) => {
		mockNvdApiUtils.getVulnerabilities.mockRejectedValue(
			new NvdError(message, type as NvdErrorType),
		);

		const { result } = renderHook(() => useNvdApi(''));
		verifyInitialState(result.current);

		await waitFor(() => {
			expect(result.current.errorMessage).toEqual(message);
			expect(result.current.errorType).toEqual(type);
			verifyErrorState(result.current);
		});
	});
});
