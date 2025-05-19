import { render, screen } from '@testing-library/react';
import {
	VulnerabilitiesListView,
	type Props,
} from '@/components/tables/VulnerabilitiesListView';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router';

const verifyTableHeaders = (names: string[]): void => {
	for (const name of names) {
		expect(screen.getByRole('columnheader', { name })).toBeInTheDocument();
	}
};

const defaultProps: Props = {
	cveItems: [],
	loading: false,
	vulnerability: 'test',
};

describe('VulnerabilitiesListView', () => {
	const setup = (props: Props) => {
		return render(
			<BrowserRouter>
				<VulnerabilitiesListView
					cveItems={props.cveItems}
					loading={props.loading}
					vulnerability={props.vulnerability}
				/>
			</BrowserRouter>,
		);
	};

	test('Render table empty table', () => {
		setup({ ...defaultProps });

		verifyTableHeaders([
			'Vulnerabilities',
			'Status',
			'Description',
			'Last Modified',
			'Published',
		]);
	});

	test('Render table with results', () => {
		setup({
			...defaultProps,
			cveItems: [
				{
					id: 'test-id',
					vulnStatus: 'test-status',
					descriptions: [{ lang: 'en', value: 'a description' }],
					lastModified: '2025-04-04T05:04:51.193',
					published: '2025-04-03T05:03:51.193',
					references: [],
				},
			],
		});

		verifyTableHeaders([
			'Vulnerabilities',
			'Status',
			'Description',
			'Last Modified',
			'Published',
		]);

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
	});
});
