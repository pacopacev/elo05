import React, { useMemo, useState } from 'react';
import UniversalTable from '../components/UniversalTable';
import { apiRequest } from '../utils/api';
import { Button, Snackbar, Alert as MuiAlert } from '@mui/material';

const UsersTablePage = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    return await apiRequest('GET', 'http://localhost:8000/api/user_log/', {}, { token });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      const data = await apiRequest('POST', 'http://localhost:8000/api/del_log/', { sequence_id: id }, { token });
      console.log('Deleted:', data);

      setSnackbar({ open: true, message: 'Log deleted successfully.', severity: 'success' });
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

  const columns = useMemo(() => [
    { Header: 'User ID', accessor: 'user_id', width: 50, },
    { Header: 'Email', accessor: 'email' },
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
      width: 100,
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => confirmAndDelete(row.original.id)}
          sx={{
            minWidth: 'auto',
            padding: '4px 6px',
            fontSize: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          Delete
        </Button>
      ),
    }
  ], []);

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">Auth User Log</h1>
      <UniversalTable columns={columns} fetchData={fetchData} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default UsersTablePage;
