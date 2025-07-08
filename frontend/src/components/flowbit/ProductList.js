import React, { useMemo, useState, useCallback } from 'react';
import { apiRequest } from '../../utils/api';
import UniversalTable from '../../components/UniversalTable';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
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
  const [windowOpen, setWindowOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [editProduct, setEditProduct] = useState(null);


    // Function to trigger refresh
  const handleProductSaved = () => {
    setRefreshKey(prev => prev + 1);
  };
  

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

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id', width: 20 },
    { Header: 'Product Code', accessor: 'code', width: 30 },
    { Header: 'Product Name', accessor: 'name', width: 20 },
    { Header: 'Description', accessor: 'description', width: 100 },
    {
      Header: 'Date Created',
      accessor: 'created_at',
      width: 300,
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
      width: 150,
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
            <span>No images</span>
          )}
        </Box>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      width: 200,
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
          message: 'Log deleted successfully.', 
          severity: 'success' 
        });
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Delete failed:', error.message);
        setSnackbar({ 
          open: true, 
          message: 'Failed to delete log.', 
          severity: 'error' 
        });
      } finally {
        setDeleteDialog({ open: false, id: null, deleting: false });
      }
    };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const response = await apiRequest(
      'GET', 
      `${process.env.REACT_APP_API_BASE_URL}/api/flowbit/products/`, 
      {}, 
      { token }
    );
    return response;
  }, []);

  return (
    <>
      <Typography variant="h5" className="erp-font" gutterBottom>
        Product list
      </Typography>
      <UniversalButton
        variant="success"
        size='small'
        onClick={() => { setWindowOpen(true); setIsMinimized(false); }}
        disabled={windowOpen && !isMinimized}
        style={{ marginBottom: 12 }}
      >
        Add Product
      </UniversalButton>
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
    onProductSaved={() => {
      setRefreshKey(prev => prev + 1);
      setWindowOpen(false);
      setEditProduct(null);
    }}
  />
</UniversalWindow>
      </Stack>
      
      <Box sx={{ my: 2 }} /> {/* Spacer instead of <br /> tags */}
      <UniversalTable 
        columns={columns} 
        fetchData={fetchData}
        refreshTrigger={refreshKey}
        
      />
      {/* Delete Confirmation Dialog */}
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
    </>
  );
};

export default ProductList;