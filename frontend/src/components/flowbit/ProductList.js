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

const ProductList = () => {
  const [windowOpen, setWindowOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
            value.map((image) => {
              const imageUrl = image.url || 
                            (image.file ? `${process.env.REACT_APP_API_BASE_URL}${image.url}` : null);
              return (
                <img
                  key={image.id}
                  src={imageUrl || logo}
                  onError={(e) => (e.target.src = logo)}
                  alt="Product"
                />
              );
            })
          ) : (
            <span>No images</span>
          )}
        </Box>
      )
    }
  ], []);

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
          setIsOpen={setWindowOpen}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
          windowTitle="Add New Product"
          width={900}
          height={900}
        >
          <AddProductForm />
        </UniversalWindow>
      </Stack>
      
      <Box sx={{ my: 2 }} /> {/* Spacer instead of <br /> tags */}
      <UniversalTable 
        columns={columns} 
        fetchData={fetchData} 
      />
    </>
  );
};

export default ProductList;