import { useNvdApi } from '@/hooks/useNvdApi';
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEffect, useState } from 'react';
import { formatDateString } from '@/utils/dateUtils';

export default function DetailsPage() {
  const params = useParams<{ id: string }>();
  const { cveItems, loading, errorMessage, errorType } = useNvdApi(
    params.id as string,
  );
  const [cve] = cveItems;
  const [references, setReferences] = useState<string[]>([]);

  useEffect(() => {
    if (cve?.references) {
      // As multiple sources can point to the same link, the urls reference are made unique.
      // IE. not the same URL should show twice.
      const result = Array.from(
        new Set(cve?.references.map((item) => item.url)),
      );
      setReferences(result);
    }
  }, [cve]);

  return (
    <>
      <Box component="header" sx={{ mb: 4, mt: 4 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" key="1" href="/">
            National Vulnerability Database Explorer
          </Link>
          ,
          <Typography key="2" sx={{ color: 'text.primary' }}>
            {params.id}
          </Typography>
          ,
        </Breadcrumbs>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Vulnerability {params.id}
        </Typography>
      </Box>
      {loading ? (
        <Grid
          sx={{
            display: 'flex',
            width: '100%',
            height: '50vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress aria-label="Loading" />
        </Grid>
      ) : cve ? (
        <>
          <Grid component="main">
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}
            >
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
              Published: {formatDateString(cve.published)}
            </Typography>

            {cve?.metrics?.cvssMetricV2 && (
              <>
                <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
                  Metrics
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Type</b>
                      </TableCell>
                      <TableCell>
                        <b>Source</b>
                      </TableCell>
                      <TableCell>
                        <b>Severity</b>
                      </TableCell>
                      <TableCell>
                        <b>Exploit score</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Impact score</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cve?.metrics?.cvssMetricV2?.map((metric, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row" width={200}>
                          {metric.type}
                        </TableCell>
                        <TableCell>{metric.source}</TableCell>
                        <TableCell>{metric.baseSeverity}</TableCell>
                        <TableCell width={150}>
                          {metric.exploitabilityScore}
                        </TableCell>
                        <TableCell align="right" width={150}>
                          {metric.impactScore}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {references.length && (
              <Typography variant="h6" component="h2" sx={{ mt: 4 }}>
                References
              </Typography>
            )}

            <List dense={true} sx={{ listStyleType: 'disc' }}>
              {references.map((link, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{ display: 'list-item', listStylePosition: 'inside' }}
                  >
                    <Link
                      component="a"
                      href={link}
                      target="_blank"
                      title={`${link} opens in a new window`}
                    >
                      {link}
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
      ) : errorMessage ? (
        <Alert variant="standard" severity={errorType}>
          {errorMessage}
        </Alert>
      ) : null}
    </>
  );
}
