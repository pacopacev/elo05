// UniversalTable.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel,
  CircularProgress, Alert, Paper, Typography, Box, Button
} from '@mui/material';
import { useTable, useSortBy, usePagination } from 'react-table';

const UniversalTable = ({ columns, fetchData, refreshTrigger }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultColumn = useMemo(() => ({
    minWidth: 50,
    width: 150,
    maxWidth: 500,
  }), []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData();
        setData(Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData, refreshTrigger]);

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
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box p={4}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} elevation={3}>
        <Table {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'background.default',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      {column.render('Header')}
                      {column.canSort && (
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
                      )}
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
                <TableRow {...row.getRowProps()} hover>
                  {row.cells.map(cell => (
                    <TableCell
                      {...cell.getCellProps()}
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="body2">
          Page {pageIndex + 1} of {pageOptions.length}
        </Typography>
        <Box>
          <Button 
            onClick={previousPage} 
            disabled={!canPreviousPage}
            variant="outlined"
            size="small"
          >
            Previous
          </Button>
          <Button 
            onClick={nextPage} 
            disabled={!canNextPage}
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UniversalTable;