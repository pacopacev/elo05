import React, { useMemo, useState, useCallback, useEffect } from 'react';
import UniversalTable from '../components/UniversalTable';
import { apiRequest } from '../utils/api';
import {
  Button,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Box
} from '@mui/material';

const UserLogTablePage = () => {

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    deleting: false  // Track if deletion is in progress
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    setIsLoading(true);
    try {
      const response = await apiRequest(
        'GET',
        `${process.env.REACT_APP_API_BASE_URL}/api/user_log/`,
        {},
        { token }
      );
      setTableData(response);
      return Array.isArray(response) ? response : [];
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data');
      setSnackbar({
        open: true,
        message: 'Failed to fetch logs.',
        severity: 'error'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, deleting: true }));
    const token = localStorage.getItem('authToken');
    try {
      await apiRequest(
        'POST',
        `${process.env.REACT_APP_API_BASE_URL}/api/del_log/`,
        { sequence_id: deleteDialog.id },
        { token }
      );
      setSnackbar({
        open: true,
        message: 'Log deleted successfully.',
        severity: 'success'
      });
      setRefreshKey(prev => prev + 1); // Refresh the table
    } catch (error) {
      console.error('Delete failed:', error.message);
      setSnackbar({
        open: true,
        message: 'Failed to delete log.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, id: null, deleting: false });
      fetchData(); // Refresh the table after deletion
    }
  };

  const columns = useMemo(() => [
    {
      Header: 'User ID',
      accessor: 'user_id',
      width: 100,
    },
    {
      Header: 'Email',
      accessor: 'email',
      minWidth: 200
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: ({ value }) => value ? new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(value)) : 'N/A',
      width: 200
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      width: 120,
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => setDeleteDialog({
            open: true,
            id: row.original.id,
            deleting: false
          })}
        >
          Delete
        </Button>
      ),
    }
  ], []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Auth User Log</h1>

      <UniversalTable
        columns={columns}
        fetchData={fetchData}
        refreshTrigger={refreshKey}
        data={tableData}
        loading={isLoading}
        error={error}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.deleting && setDeleteDialog({ open: false, id: null, deleting: false })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this log entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null, deleting: false })}
            disabled={deleteDialog.deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteDialog.deleting}
            startIcon={deleteDialog.deleting ? <CircularProgress size={20} /> : null}
          >
            {deleteDialog.deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserLogTablePage;

