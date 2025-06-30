import React, { useMemo } from 'react';
import { apiRequest } from '../../utils/api';
import UniversalTable from '../../components/UniversalTable';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import logo from '../../assets/images/flowbit.png';

const ProductList = () => {
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
    <Box sx={{ display: 'flex',
        gap: 1,
        overflowX: 'auto',
        py: 1,
        '& img': {
          height: 50,
          width: 'auto',
          borderRadius: 1,
          border: '1px solid #ddd'
        }}}>
      {value?.length > 0 ? (
        value.map((image) => {
          // Debug: Log the entire image object
          console.log('Image object:', image);
          
          const imageUrl = image.url || 
                         (image.file ? `${process.env.REACT_APP_API_BASE_URL}${image.url}` : null);
                         console.log(imageUrl)
          
          return (
            <img
              key={image.id}
              src={imageUrl || logo}
              onError={(e) => (e.target.src = logo)}
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

  return (
    <>
      <Typography variant="h5" className="erp-font" gutterBottom>
        Product list
      </Typography>
      <UniversalTable 
        columns={columns} 
        fetchData={fetchData} 
      />
    </>
  );
};

export default ProductList;