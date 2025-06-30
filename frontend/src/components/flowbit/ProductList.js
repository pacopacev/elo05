import React, { useMemo, useState } from 'react';
import { apiRequest } from '../../utils/api';
import UniversalTable from '../../components/UniversalTable';
import { Typography } from '@mui/material';
import UniversalButton from '../../components/buttons/UniversalButton';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import AddProductForm from './AddProductForm';
import logo from '../../assets/images/flowbit.png';

// Create this component in your components folder
const UniversalWindow = ({ 
  isOpen, 
  onClose, 
  children,
  width = '80%',
  height = '80%',
  title = ''
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: width,
      height: height,
      backgroundColor: '#e5e7eb',
      zIndex: 1300,
      boxShadow: '0px 0px 20px rgba(0,0,0,0.5)',
      borderRadius: '8px',
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        <Typography variant="h6">{title}</Typography>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  );
};

const ProductList = () => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  
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

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    const response = await apiRequest(
      'GET', 
      `${process.env.REACT_APP_API_BASE_URL}/api/flowbit/products/`, 
      {}, 
      { token }
    );
    return response;
  };

  const handleWindowOpen = () => {
    setIsWindowOpen(true);
  };

  const handleWindowClose = () => {
    setIsWindowOpen(false);
    // You might want to refresh product list here
  };

  return (
    <>
      <Typography variant="h5" className="erp-font" gutterBottom>
        Product list
      </Typography>
      
      <Stack spacing={2} direction="row">
        <UniversalButton 
          onClick={handleWindowOpen}
          variant="success"
          size="small"
        >
          Add Product
        </UniversalButton>
        
        <UniversalButton 
          variant="secondary" 
          className="ml-4"
        >
          Secondary Action
        </UniversalButton>
      </Stack>
      
      <Box sx={{ my: 2 }} /> {/* Spacer instead of <br /> tags */}
      
      <UniversalTable 
        columns={columns} 
        fetchData={fetchData} 
      />

      {/* Universal Window for Add Product */}
      <UniversalWindow
        isOpen={isWindowOpen}
        onClose={handleWindowClose}
        width="900px"
        height="900px"
        title="Add New Product"
      >
        <AddProductForm onSuccess={handleWindowClose} />
      </UniversalWindow>
    </>
  );
};

export default ProductList;