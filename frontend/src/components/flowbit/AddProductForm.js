import React, { useState } from 'react';
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

const AddProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });
  const [preview, setPreview] = useState(logo);
  const [imageFiles, setImageFiles] = useState([]); // Changed to array for multiple images
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const formPayload = new FormData();

      // Append product data
      formPayload.append('code', formData.code);
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description || '');

      // Append all image files
      imageFiles.forEach(file => {
        formPayload.append('images', file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/flowbit/add_product/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
       
        throw new Error(errorData.code[0] || 'Failed to create product');
      }

      const result = await response.json();

      setSnackbar({
        open: true,
        message: 'Product created successfully!',
        severity: 'success',
      });

      // Optionally redirect after success
      // setTimeout(() => navigate('/products'), 2000);

    } catch (error) {
      console.error('Create error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create product',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    navigate('..');
  };

  return (
    <Box sx={{ maxWidth: 300, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" className="erp-font" gutterBottom>
        Add Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid container direction="row" spacing={2}>
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


          </Grid>
          <Grid container direction="row" spacing={2}><Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={1}
              fullWidth
            />
          </Grid></Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              {preview && (
                <Box
                  component="img"
                  alt="Preview"
                  src={preview}
                  sx={{
                    width: 222,
                    height: 222,
                    mb: 2,
                    borderRadius: 1,
                    objectFit: 'cover',
                    border: '1px solid',          // Default color (theme.palette.divider)
                    borderColor: 'text.primary',
                  }}
                />
              )}
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
          <Grid container direction="row" spacing={2} justifyContent="flex-end">    <Grid item>
            <Button variant="contained" onClick={handleCancel} color="warning">
              Cancel
            </Button>
          </Grid>
            <Grid item>
              <Button variant="contained" type="submit" color="success">
                Save Product
              </Button>
            </Grid></Grid>
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