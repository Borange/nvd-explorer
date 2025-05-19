import type { CveItem } from '@/api/generated/nvdApiTypes';
import { nvdApiUtils, NvdError, type NvdErrorType } from '@/utils/nvdApiUtils';
import { useCallback, useEffect, useState } from 'react';

export type UseNvdApi = {
	cveItems: CveItem[];
	loading: boolean;
	errorMessage: string;
	errorType?: NvdErrorType;
	totalResults: number;
	startIndex: number;
};

export const useNvdApi = (searchTerm: string, page: number = 0): UseNvdApi => {
	const [cveItems, setCveItems] = useState<CveItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [totalResults, setTotalResults] = useState(0);
	const [startIndex, setStartIndex] = useState(1);
	const [errorType, setErrorType] = useState<NvdErrorType>();

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setErrorMessage('');
			setTotalResults(0);
			setStartIndex(0);
			window.scrollTo({ top: 0 });
			const result = await nvdApiUtils.getVulnerabilities(
				searchTerm
					? { keywordSearch: searchTerm, startIndex: page }
					: { startIndex: page },
			);
			setCveItems(result.items);
			setTotalResults(result.totalResults);
			setStartIndex(result.startIndex);
			setLoading(false);
		} catch (error) {
			setErrorMessage(
				error instanceof NvdError
					? error.message
					: 'Unexpected error happened. Contact support.',
			);
			setErrorType(error instanceof NvdError ? error.type : 'error');
			setLoading(false);
		}
	}, [searchTerm, page]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		cveItems,
		loading,
		errorType,
		errorMessage,
		totalResults,
		startIndex,
	};
};
