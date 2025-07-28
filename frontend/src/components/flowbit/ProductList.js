import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import UniversalTable from '../../components/UniversalTable';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import logo from '../../assets/images/flowbit.png';
import UniversalWindow from '../../components/UniversalWindow/UniversalWindow';
import AddProductForm from './AddProductForm';
import UniversalButton from '../../components/buttons/UniversalButton';
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
} from '@mui/material';

const ProductList = () => {
  const [test, setTest] = useState(false); // Example state variable, can be used for testing or other purposes

  // State declarations
  const [windowOpen, setWindowOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
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
    deleting: false
  });
const closeForm = (data) => {
  console.log(data)
    setWindowOpen(data);
  };
  // Fetch data function
  const fetchData = useCallback(async (searchTerm = '') => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(
        'GET',
        `${process.env.REACT_APP_API_BASE_URL}/api/flowbit/products/`,
        { search: searchTerm.trim() },
        { token }
      );

      if (!response) {
        throw new Error('No response received');
      }

      setTableData(response);
      setError(null);
      return response;
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData('');
  }, [fetchData]);

  // Search handler
  const handleSearch = useCallback((searchTerm) => {
    setSearchText(searchTerm);
    fetchData(searchTerm);
  }, [fetchData]);

  // Product saved handler
  const handleProductSaved = useCallback(() => {
    fetchData(searchText);
    setWindowOpen(false);
    setEditProduct(null);
  }, [fetchData, searchText]);

  // Handle delete confirmation
  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, deleting: true }));
    const token = localStorage.getItem('authToken');
   
    try {
      await apiRequest(
        'POST',
        `${process.env.REACT_APP_API_BASE_URL}/api/flowbit/del_product/`,
        { product_id: deleteDialog.id },
        { token }
      );
      setSnackbar({
        open: true,
        message: 'Product deleted successfully.',
        severity: 'success'
      });
      fetchData(searchText);
    } catch (error) {
      console.error('Delete failed:', error.message);
      setSnackbar({
        open: true,
        message: 'Failed to delete product.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, id: null, deleting: false });
    }
  };

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id', width: 10 },
    { Header: 'Product Code', accessor: 'code', width: 80 },
    { Header: 'Product Name', accessor: 'name', width: 300 },
    { Header: 'Description', accessor: 'description', width: 300 },
    {
      Header: 'Date Created',
      accessor: 'created_at',
      width: 100,
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
      Header: 'Images',
      accessor: 'images',
      width: 200,
      Cell: ({ value }) => (
        <Box sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          py: 1,
          '& img': {
            height: 50,
            width: 'auto',
            borderRadius: 1,
            border: '1px solid #ddd'
          }
        }}>
          {value?.length > 0 ? (
            value.map((image) => (
              <img
                key={image.id}
                src={image.url || logo}
                onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                alt="Product"
              />
            ))
          ) : (
            <img src={logo} alt="Product" />
          )}
        </Box>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      width: 50,
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              setEditProduct(row.original);
              setWindowOpen(true);
              setIsMinimized(false);
            }}
          >
            Edit
          </Button>
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
        </div>
      ),
    }
  ], []);

  return (
    <>
      <Tooltip title="This is a list of all products.">
        <Typography variant="h5" className="erp-font" gutterBottom>
          Product list
        </Typography>
      </Tooltip>
      <Stack direction="row" justifyContent="flex-end">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { marginRight: 2, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
        <UniversalButton
          variant="success"
          size='small'
          onClick={() => {
            setWindowOpen(true);
            setIsMinimized(false);
            
          }}
          style={{ marginBottom: 2 }}
        >
          Add Product
        </UniversalButton>
      </Stack>
      <Stack spacing={2} direction="row">
        <UniversalWindow
          isOpen={windowOpen}
          setIsOpen={(open) => {
            setWindowOpen(open);
            if (!open) setEditProduct(null);
          }}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
          windowTitle={editProduct ? "Edit Product" : "Add New Product"}
          width={900}
          height={900}
        >
          <AddProductForm
            product={editProduct}
            onProductSaved={handleProductSaved}
            test={test}  // Passing the number down
            sendDataToParent={closeForm}
            
          />
        </UniversalWindow>
      </Stack>
      <Box sx={{ my: 1 }} />
      <UniversalTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        error={error}
        onRefresh={() => fetchData(searchText)}
      />
      <Dialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.deleting && setDeleteDialog({ open: false, id: null, deleting: false })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product entry? This action cannot be undone.
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
    </>
  );
};

export default ProductList;