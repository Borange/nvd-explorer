import { renderHook, waitFor } from '@testing-library/react';
import { useNvdApi } from '@/hooks/useNvdApi';
import '@testing-library/jest-dom';

const mockNvdApiUtils = vi.hoisted(() => ({
	getVulnerabilities: vi.fn(),
}));

vi.mock('@/utils/nvdApiUtils', () => ({
	nvdApiUtils: mockNvdApiUtils,
}));

describe('useNvdApi', () => {
	const windowScroll = window.scroll; // Mock this as it is not supported js-dom

	beforeAll(() => {
		window.scroll = vi.fn();
	});

	afterAll(() => {
		window.scroll = windowScroll;
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
		expect(result.current.cveItems).toHaveLength(0);
		expect(result.current.errorMessage).toEqual('');
		expect(result.current.loading).toEqual(true);
		expect(result.current.startIndex).toEqual(1);
		expect(result.current.totalResults).toEqual(0);

		await waitFor(() => {
			expect(result.current.cveItems).toHaveLength(1);
			expect(result.current.errorMessage).toEqual('');
			expect(result.current.loading).toEqual(false);
			expect(result.current.startIndex).toEqual(1);
			expect(result.current.totalResults).toEqual(1);
		});
	});

	test('Make API call and return error message', async () => {
		mockNvdApiUtils.getVulnerabilities.mockRejectedValue(new Error('error'));

		const { result } = renderHook(() => useNvdApi(''));
		expect(result.current.cveItems).toHaveLength(0);
		expect(result.current.errorMessage).toEqual('');
		expect(result.current.loading).toEqual(true);
		expect(result.current.startIndex).toEqual(1);
		expect(result.current.totalResults).toEqual(0);

		await waitFor(() => {
			expect(result.current.cveItems).toHaveLength(0);
			expect(result.current.errorMessage).toEqual(
				'An unexpected error happened. Please contact support.',
			);
			expect(result.current.loading).toEqual(false);
			expect(result.current.startIndex).toEqual(1);
			expect(result.current.totalResults).toEqual(0);
		});
	});
});
