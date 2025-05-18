import { nvdApiUtils, type SearchParams } from '@/utils/nvdApiUtils';
import type { JSONSchemaForNVDVulnerabilityDataAPIVersion222 as NvdRead } from '@/api/generated/nvdApiTypes';

describe('paramsToString', () => {
	test('returns parameter string', () => {
		expect(
			nvdApiUtils.paramsToString({ startIndex: 1, keywordSearch: 'test' }),
		).equals('&startIndex=1&keywordSearch=test');

		expect(nvdApiUtils.paramsToString({ startIndex: 1 })).equals(
			'&startIndex=1',
		);

		expect(nvdApiUtils.paramsToString({ keywordSearch: 'test' })).equals(
			'&keywordSearch=test',
		);
	});

	test.each([null, undefined, false])(
		'returns empty string with value of %s',
		(testCase) => {
			expect(nvdApiUtils.paramsToString(testCase as unknown as SearchParams));
		},
	);
});

describe('loadApi', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test('return data when api request was successful', async () => {
		window.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({ version: '2.0' } as NvdRead),
		});

		const response = await nvdApiUtils.loadAPi({ keywordSearch: 'test' });
		expect(response).toEqual({ version: '2.0' });
	});

	test('throws error if a request had an error', async () => {
		window.fetch = vi.fn().mockResolvedValue({
			ok: false,
			statusText: 'error',
			status: 500,
		});
		await expect(
			nvdApiUtils.loadAPi({ keywordSearch: 'test' }),
		).rejects.toThrow('error');
	});
});

describe('getVulnerabilities', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test('loads and provide vulnerabilities and pagination information from the API', async () => {
		window.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({
				startIndex: 1,
				totalResults: 1,
				resultsPerPage: 1,
				vulnerabilities: [{ cve: {} }],
			} as NvdRead),
		});

		expect(await nvdApiUtils.getVulnerabilities({})).toEqual({
			items: [{}],
			startIndex: 1,
			totalResults: 1,
		});
	});

	test('throws error if request gone bad', async () => {
		window.fetch = vi.fn().mockResolvedValue({
			ok: false,
			statusText: 'error',
			status: 500,
		});
		await expect(
			nvdApiUtils.loadAPi({ keywordSearch: 'test' }),
		).rejects.toThrow('error');
	});
});
