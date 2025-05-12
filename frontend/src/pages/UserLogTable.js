import React, { useEffect, useState, useMemo } from 'react';
import { apiRequest } from '../utils/api';
import { useTable, useSortBy, usePagination } from 'react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/user_log/';

const MaterialUITable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });



const fetchData = async () => {
  setLoading(true);
  const token = localStorage.getItem('authToken');

  try {
    // Using await to directly get the data from the apiRequest function
    const data = await apiRequest('GET', 'http://localhost:8000/api/user_log/', {}, { token });

    // Now data is the result of the API call, so you can directly check and set it
    if (!Array.isArray(data)) throw new Error('Unexpected response format');
    setData(data);
    setError(null);
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err.message || "Failed to fetch data.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

const handleDelete = async (id) => {
  const token = localStorage.getItem('authToken');
  try {
    const data = await apiRequest('POST', 'http://localhost:8000/api/del_log/', { sequence_id: id }, { token });
    console.log('Deleted with token:', data);

    setSnackbar({ open: true, message: 'Log deleted successfully.', severity: 'success' });
    await fetchData(); // Refresh table data
  } catch (error) {
    console.error('Delete failed:', error.message);
    setSnackbar({ open: true, message: 'Failed to delete log.', severity: 'error' });
  }
};


  const confirmAndDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      handleDelete(id);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'User ID',
        accessor: 'user_id',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) =>
          new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(new Date(value)),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmAndDelete(row.original.id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    []
  );

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

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!loading && !error && data.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table
          aria-label="user data table"
          {...getTableProps()}
          sx={{
            minWidth: 650,
            '& .MuiTableCell-head': {
              fontWeight: 'bold',
            },
            '& .MuiTableRow-root': {
              height: 20,
            },
          }}
        >
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    align="left"
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
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
                <TableRow key={row.original.id} {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.column.id} {...cell.getCellProps()} sx={{ border: '1px solid #ccc' }}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default MaterialUITable;
