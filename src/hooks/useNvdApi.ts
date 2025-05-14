import type { CveItem } from '@/api/generated/nvdApiTypes';
import { nvdApiUtils } from '@/utils/nvdApiUtils';
import { useCallback, useEffect, useState } from 'react';

export type UseNvdApi = {
	cveItems: CveItem[];
	loading: boolean;
	errorMessage: string;
	totalResults: number;
	startIndex: number;
};

export const useNvdApi = (searchTerm: string, start: number = 0): UseNvdApi => {
	const [cveItems, setCveItems] = useState<CveItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [totalResults, setTotalResults] = useState(0);
	const [startIndex, setStartIndex] = useState(1);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setErrorMessage('');
			window.scroll({ behavior: 'instant', top: 0 });
			const result = await nvdApiUtils.getVulnerabilities(
				searchTerm
					? { keywordSearch: searchTerm, startIndex: start }
					: { startIndex: start },
			);
			setCveItems(result.items);
			setTotalResults(result.totalResults);
			setStartIndex(result.startIndex);
			setLoading(false);
		} catch {
			setErrorMessage('An unexpected error happened. Please contact support.');
			setLoading(false);
		}
	}, [searchTerm, start]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { cveItems, loading, errorMessage, totalResults, startIndex };
};
