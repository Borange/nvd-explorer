import type { CveItem } from '@/api/generated/nvdApiTypes';
import type { JSONSchemaForNVDVulnerabilityDataAPIVersion222 as NvdRead } from '@/api/generated/nvdApiTypes';

type SearchParams = {
	keywordSearch?: string;
	startIndex: number;
};

class NvdApiUtils {
	paramsToString(params: SearchParams): string {
		if (!params) {
			return '';
		}

		return Object.entries(params)
			.map(([key, value], i) => {
				return i === 0 ? `&${key}=${value}` : `${key}=${value}`;
			})
			.join('&');
	}

	async loadAPi(params: SearchParams): Promise<NvdRead> {
		const response = await fetch(
			'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100' +
				this.paramsToString(params),
		);

		if (!response.ok) {
			console.error(
				'NvdApiUtils::loadAPI',
				`Could not Fetch: status: ${response.status}. Message: ${response.statusText}`,
			);
			throw new Error(response.statusText);
		}

		return response.json();
	}

	async getVulnerabilities(
		params: SearchParams,
	): Promise<{ items: CveItem[]; totalResults: number; startIndex: number }> {
		const response = await this.loadAPi(params);
		return {
			items: response.vulnerabilities.map((vulnerability) => vulnerability.cve),
			totalResults: response.totalResults,
			startIndex: response.startIndex,
		};
	}
}

export const nvdApiUtils = new NvdApiUtils();
