import {
	Link,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import type { CveItem } from '@/api/generated/nvdApiTypes';
import { useEffect, useState, type JSX } from 'react';
import { formatIsoDate } from '@/utils/dateUtils';

export type Props = {
	cveItems: CveItem[];
	vulnerability: string;
	loading: boolean;
};

export function VulnerabilitiesListView({
	cveItems,
	vulnerability,
	loading = false,
}: Props): JSX.Element {
	const [captionText, setCaptionText] = useState('');

	useEffect(() => {
		if (loading) {
			setCaptionText('Loading items for table');
		} else if (cveItems.length) {
			setCaptionText(`Vulnerabilities table by searching "${vulnerability}"`);
		} else {
			setCaptionText('No vulnerabilities found');
		}
	}, [cveItems, loading, vulnerability]);

	return (
		<Table sx={{ minWidth: 800 }} aria-label="caption table" stickyHeader>
			<caption>{captionText}</caption>
			<TableHead>
				<TableRow>
					<TableCell>
						<b>Vulnerabilities</b>
					</TableCell>
					<TableCell>
						<b>Description</b>
					</TableCell>
					<TableCell>
						<b>Status</b>
					</TableCell>
					<TableCell align="right">
						<b>Last Modified</b>
					</TableCell>
					<TableCell align="right">
						<b>Published</b>
					</TableCell>
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
						<TableCell align="right" width={200}>
							{formatIsoDate(cve.lastModified)}
						</TableCell>
						<TableCell align="right" width={150}>
							{formatIsoDate(cve.published)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
