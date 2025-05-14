import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type UseNvdApi } from '@/hooks/useNvdApi';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '@/router/routes';
import type { JSONSchemaForCommonVulnerabilityScoringSystemVersion20 as VulnerabilityScoringSystem } from '@/api/generated/nvdApiTypes';

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

describe('Details page', () => {
	const setup = () => {
		window.history.pushState({}, 'Test page', '/details/test-id');
		return render(<RouterProvider router={createBrowserRouter(routes)} />);
	};

	test('Details page renders', () => {
		mockUseNvdApi.cveItems = [
			{
				id: 'test-id',
				vulnStatus: 'test-status',
				descriptions: [{ lang: 'en', value: 'a description' }],
				lastModified: '2025-04-04T05:04:51.193',
				published: '2025-04-03T05:03:51.193',
				references: [{ url: 'https://localhost.local' }],
				metrics: {
					cvssMetricV2: [
						{
							cvssData: {} as VulnerabilityScoringSystem,
							type: 'Primary',
							source: 'nvd@nist.gov',
							baseSeverity: 'HIGH',
							exploitabilityScore: 10,
							impactScore: 10,
						},
					],
				},
			},
		];

		setup();
		expect(
			screen.getByRole('link', { name: 'NVD Explorer' }),
		).toBeInTheDocument();
		expect(screen.getByText('Vulnerability test-id')).toBeInTheDocument();
		expect(screen.getByText('Status: test-status')).toBeInTheDocument();
		expect(screen.getByText('a description')).toBeInTheDocument();
		expect(screen.getByText('Published: 2025-04-03')).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: 'https://localhost.local' }),
		).toBeInTheDocument();
	});
});
