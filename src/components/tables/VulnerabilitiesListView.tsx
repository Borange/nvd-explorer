import {
	Link,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import type { CveItem } from '@/api/generated/nvdApiTypes';
import type { JSX } from 'react';

export type Props = {
	cveItems: CveItem[];
};

export function VulnerabilitiesListView({ cveItems }: Props): JSX.Element {
	return (
		<TableContainer>
			<Table sx={{ minWidth: 320 }} aria-label="caption table">
				<caption>
					{cveItems.length ? 'Vulnerabilities ' : 'No vulnerabilities found'}
				</caption>
				<TableHead>
					<TableRow>
						<TableCell>Vulnerabilities</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Status</TableCell>
						<TableCell align="right">Last Modified</TableCell>
						<TableCell align="right">Published</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{cveItems.map((cve) => (
						<TableRow key={cve.id}>
							<TableCell component="th" scope="row" width={200}>
								<Link component={RouterLink} to={'/details/' + cve.id}>
									{cve.id}
								</Link>
							</TableCell>
							<TableCell>
								{cve.descriptions.find((desc) => desc.lang === 'en')?.value}
							</TableCell>
							<TableCell>{cve.vulnStatus}</TableCell>
							<TableCell align="right" width={150}>
								{new Date(cve.lastModified).toISOString().split('T')[0]}
							</TableCell>
							<TableCell align="right" width={150}>
								{new Date(cve.published).toISOString().split('T')[0]}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
