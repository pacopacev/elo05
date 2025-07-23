import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/flowbit.png';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const AddProductForm = ({ product, onProductSaved, test, sendDataToParent }) => {
  // console.log(test)

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    name: '',
    description: '',
    images: [],
    imagesToRemove: []
  });
  
  const [preview, setPreview] = useState(logo);
  const [imageFiles, setImageFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || '',
        code: product.code || '',
        name: product.name || '',
        description: product.description || '',
        images: product.images || [],
        imagesToRemove: []
      });
      // Set preview to first image if available
      if (product.images && product.images.length > 0 && product.images[0].url) {
        setPreview(product.images[0].url);
      } else {
        setPreview(logo);
      }
    } else {
      setFormData({ 
        id: '',
        code: '', 
        name: '', 
        description: '', 
        images: [], 
        imagesToRemove: [] 
      });
      setPreview(logo);
      setImageFiles([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      // Preview the first image
      setPreview(URL.createObjectURL(files[0]));
      
      // Clear any existing images marked for removal
      setFormData(prev => ({ ...prev, imagesToRemove: [] }));
    }
  };

  const handleClearImage = () => {
    // Mark existing images for removal if editing
    if (formData.images && formData.images.length > 0) {
      setFormData(prev => ({
        ...prev,
        imagesToRemove: [...prev.imagesToRemove, ...prev.images.map(img => img.id)]
      }));
    }
    
    // Clear current state
    setImageFiles([]);
    setPreview(logo);
    setFormData(prev => ({ ...prev, images: [] }));
    
    // Revoke object URL to prevent memory leaks
    if (preview !== logo) {
      URL.revokeObjectURL(preview);
    }
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const formPayload = new FormData();
      
      // Append basic fields
      formPayload.append('code', formData.code);
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description || '');
      
      // Append images to remove
      formData.imagesToRemove.forEach(id => {
        formPayload.append('images_to_remove', id);
      });
      
      // Append new images
      imageFiles.forEach(file => {
        formPayload.append('images', file);
      });

      let url = `${process.env.REACT_APP_API_BASE_URL}/api/flowbit/products/`;
      let method = 'POST';
      
      if (formData.id) {
        url += `${formData.id}/`;
        method = 'PUT';

      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code?.[0] || errorData.error || 'Failed to save product');
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: formData.id ? 'Product updated successfully!' : 'Product created successfully!',
        severity: 'success',
      });

      if (onProductSaved) onProductSaved();
      
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save product',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    sendDataToParent(false);
    // navigate('..');
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" className="erp-font" gutterBottom>
        {formData.id ? 'Edit Product' : 'Add Product'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid container direction="row" spacing={2}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Product code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Product name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={1}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Box position="relative" sx={{ mb: 2 }}>
                  <img
                    alt="Preview"
                    src={preview}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 1,
                      objectFit: 'cover',
                      border: '1px solid',
                      borderColor: 'text.primary',
                    }}
                  />
                  {preview !== logo && (
                    <IconButton
                      onClick={handleClearImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.7)',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Button variant="contained" component="label" sx={{ mb: 2 }}>
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFiles.length > 0 && (
                  <Typography variant="caption" display="block">
                    {imageFiles.length} image(s) selected
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" onClick={handleCancel} color="warning">
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" type="submit" color="success">
                {formData.id ? 'Update' : 'Save'} Product
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductForm;