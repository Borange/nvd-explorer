import type { CveItem } from '@/api/generated/nvdApiTypes';
import type { JSONSchemaForNVDVulnerabilityDataAPIVersion222 as NvdRead } from '@/api/generated/nvdApiTypes';

export type SearchParams = {
  keywordSearch?: string;
  startIndex?: number;
};

export type NvdErrorType = 'info' | 'warning' | 'error';

export class NvdError extends Error {
  readonly type: NvdErrorType;

  constructor(message: string, type: NvdErrorType = 'error') {
    super(message);
    this.type = type ?? null;
  }
}

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

  async loadApi(params: SearchParams): Promise<NvdRead> {
    const response = await fetch(
      'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100' +
        this.paramsToString(params),
    );

    if (!response.ok) {
      console.error(
        'NvdApiUtils::loadAPI',
        `Could not Fetch: status: ${response.status}. Message: ${response.statusText}`,
      );
      if (response.status === 404) {
        throw new NvdError('Could not find ' + params.keywordSearch, 'info');
      } else if (response.status >= 400 && response.status < 500) {
        throw new NvdError(
          'Could not use the expected search term. Try again later. If problem exists, please contact support',
          'warning',
        );
      }
      throw new NvdError(
        'An unexpected error happened. Please contact support.',
      );
    }

    return response.json();
  }

  async getVulnerabilities(
    params: SearchParams,
  ): Promise<{ items: CveItem[]; totalResults: number; startIndex: number }> {
    const response = await this.loadApi(params);
    return {
      items: response.vulnerabilities.map((vulnerability) => vulnerability.cve),
      totalResults: response.totalResults,
      startIndex: response.startIndex,
    };
  }
}

export const nvdApiUtils = new NvdApiUtils();
