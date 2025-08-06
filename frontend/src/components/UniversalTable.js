import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel,
  CircularProgress, Alert, Paper, Typography, Box, Button
} from '@mui/material';
import { useTable, useSortBy, usePagination } from 'react-table';

const UniversalTable = ({ 
  columns, 
  data = [], 
  fetchData, 
  loading = false, 
  error = null,
  refreshTrigger,
  manualPagination = false
}) => {
  const defaultColumn = React.useMemo(() => ({
    minWidth: 10,
    width: 150,
    maxWidth: 300,
  }), []);

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
      initialState: { pageIndex: 0, pageSize: 25 },
      manualPagination,
    },
    useSortBy,
    usePagination
  );

  if (loading) {
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

  if (!loading && !error && data.length === 0) {
    return (
      <Box p={4}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', mt: 1, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
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
                      backgroundColor: 'background.paper',
                      '&:hover': { backgroundColor: 'action.hover' },
                      border: '2px solid rgba(224, 224, 224, 1)',
                      width: column.width || 'auto',
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
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', border: '2px solid rgba(224, 224, 224, 1)', width: columns.width ? columns.width : 'auto' }}
                    >
                      <Box sx={{ wordBreak: 'break-word' }}>{cell.render('Cell')}</Box>
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

