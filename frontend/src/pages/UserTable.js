import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
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
  Paper
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/users/';

const MaterialUITable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setError(err.message || "Failed to fetch data.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        width: 100,
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  if (loading) {
    return (
      <div className="text-center p-4">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!loading && !error && data.length === 0) {
    return (
      <div className="text-center p-4">
        <Alert severity="info">No data available</Alert>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table
        aria-label="user data table"
        {...getTableProps()}
        sx={{
          minWidth: 650,
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
          },
        }}
      >
        <TableHead>
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <TableRow
                key={key}
                {...restHeaderGroupProps}
              >
                {headerGroup.headers.map(column => {
                  const { getHeaderProps, getSortByToggleProps, render, isSorted, isSortedDesc } = column;
                  const { key: headerKey, ...restHeaderProps } = getHeaderProps(getSortByToggleProps());

                  return (
                    <TableCell
                      key={headerKey}
                      {...restHeaderProps}
                      align="left"
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {render('Header')}
                        <TableSortLabel
                          active={isSorted}
                          direction={isSortedDesc ? 'desc' : 'asc'}
                        />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const { key: rowKey, ...restRowProps } = row.getRowProps();
            return (
              <TableRow
                key={rowKey}
                {...restRowProps}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                {row.cells.map(cell => {
                  const { key: cellKey, ...restCellProps } = cell.getCellProps();
                  return (
                    <TableCell
                      key={cellKey}
                      {...restCellProps}
                    >
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MaterialUITable;