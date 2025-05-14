import { useNvdApi } from '@/hooks/useNvdApi';
import {
	Box,
	Breadcrumbs,
	Grid,
	Link,
	List,
	ListItem,
	Typography,
} from '@mui/material';
import { useLocation, useParams } from 'react-router';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function DetailsPage() {
	const params = useParams<{ id: string }>();
	const { cveItems, loading } = useNvdApi(params.id as string);
	const [cve] = cveItems;

	const location = useLocation();

	const breadcrumbs = location.pathname.includes('details')
		? [
				<Link underline="hover" key="1" color="inherit" href="/">
					NVD Explorer
				</Link>,
				<Typography key="2" sx={{ color: 'text.primary' }}>
					{params.id}
				</Typography>,
			]
		: [];

	return (
		<>
			<Box component="header" sx={{ mb: 4, mt: 4 }}>
				<Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
					{breadcrumbs}
				</Breadcrumbs>
				<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
					Vulnerability {params.id}
				</Typography>
			</Box>
			{loading ? (
				<>Loading</>
			) : (
				<>
					<Grid component="main">
						<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
							Status: {cve?.vulnStatus}
						</Typography>

						<Typography variant="body1" sx={{ mb: 2 }}>
							{cve?.descriptions.find((item) => item.lang === 'en')?.value}
						</Typography>

						<Typography
							variant="caption"
							component="time"
							dateTime={cve?.published}
							sx={{ pb: 2, textAlign: 'right' }}
						>
							Published:{' '}
							{cve?.published
								? new Date(cve?.published).toISOString().split('T')[0]
								: '-'}
						</Typography>

						{cve?.metrics?.cvssMetricV2 && (
							<>
								<Typography variant="h6" component="h3" sx={{ mt: 4 }}>
									Metrics
								</Typography>

								<List dense={true} sx={{ listStyleType: 'disc' }}>
									{cve?.metrics?.cvssMetricV2?.map((metric, index) => {
										return (
											<ListItem
												key={index}
												sx={{
													display: 'list-item',
													listStylePosition: 'inside',
												}}
											>
												{metric.type} {metric.source} {metric.baseSeverity}{' '}
												{metric.exploitabilityScore} / {metric.impactScore}
											</ListItem>
										);
									})}
								</List>
							</>
						)}

						{cve?.vendorComments && (
							<>
								<Typography variant="h6" component="h3" sx={{ mt: 4 }}>
									Vendor comments
								</Typography>
								<List dense={true} sx={{ listStyleType: 'disc' }}>
									{cve?.vendorComments.map((vendorComment, index) => {
										return (
											<ListItem
												key={index}
												sx={{
													display: 'list-item',
													listStylePosition: 'inside',
												}}
											>
												<Typography variant="h6">
													{vendorComment.organization}
												</Typography>
												<Typography variant="body1">
													{vendorComment.comment}
												</Typography>
												<Typography variant="body1" component="time">
													{vendorComment.lastModified}
												</Typography>
											</ListItem>
										);
									})}
								</List>
							</>
						)}

						<Typography variant="h6" component="h3" sx={{ mt: 4 }}>
							References
						</Typography>
						<List dense={true} sx={{ listStyleType: 'disc' }}>
							{cve?.references.map((link, index) => {
								return (
									<ListItem
										key={index}
										sx={{ display: 'list-item', listStylePosition: 'inside' }}
									>
										<Link
											component="a"
											href={link.url}
											target="_blank"
											title={`${link.url} opens in a new window`}
										>
											{link.url}
											<OpenInNewIcon
												color="primary"
												sx={{
													ml: 1,
													position: 'relative',
													transform: 'translateY(25%)',
												}}
											/>
										</Link>
									</ListItem>
								);
							})}
						</List>
					</Grid>
				</>
			)}
		</>
	);
}
