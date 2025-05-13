import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel,
  CircularProgress, Alert, Paper, Typography, Box, Button
} from '@mui/material';
import { useTable, useSortBy, usePagination } from 'react-table';
import PropTypes from 'prop-types';

const UniversalTable = ({ columns, fetchData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const defaultColumn = useMemo(() => ({
    width: 150,
  }), []);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchData();
        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination
  );

  if (loading) return <Box textAlign="center" p={4}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" p={4}><Alert severity="error">{error}</Alert></Box>;
  if (!data.length) return <Box textAlign="center" p={4}><Alert severity="info">No data available</Alert></Box>;

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table {...getTableProps()} sx={{
          minWidth: 650,
          '& .MuiTableCell-root': {
            padding: '6px 8px',
            fontSize: '0.875rem',
          },
          '& .MuiTableRow-root': {
            height: '28px',
          },
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
          },
        }}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                    style={{
                    width: column.width || defaultColumn.width,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}

                  >
                    <Box display="flex" alignItems="center">
                      {column.render('Header')}
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                      />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <TableRow key={row.id} {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.column.id} {...cell.getCellProps()} sx={{ border: '1px solid #ccc' }}
                    style={{
                      width: cell.column.width || defaultColumn.width,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>

        </Table>

      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="body2">
          Page {pageIndex + 1} of {pageOptions.length}
        </Typography>
        <Box>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

UniversalTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
};

export default UniversalTable;
