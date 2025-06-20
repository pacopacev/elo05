import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
const FollowUpForm = () => {
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    description: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // You can add API call here
  //   console.log('Submitted Data:', formData);

  //   setSnackbar({
  //     open: true,
  //     message: 'Form submitted successfully!',
  //     severity: 'success'
  //   });
  // };

  const cardStyles = {
    maxWidth: 440,
    mx: 'auto',      // margin left & right: auto (centers the card)
    mt: 4,           // margin-top: 32px (MUI spacing * 4)
    p: 3,            // padding: 24px (MUI spacing * 3)
    boxShadow: 3,    // medium shadow (MUI shadow scale)
    borderRadius: 2, // border-radius: 8px
    bgcolor: 'white' // background color
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');

      const formPayload = new FormData();
      formPayload.append('id', formData.id);
      formPayload.append('username', formData.username);
      formPayload.append('email', formData.email);


      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/your_account/update/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Failed to update account data');
      }

      await response.json();

      setSnackbar({
        open: true,
        message: 'Account updated successfully!',
        severity: 'success',
      });

      await fetchData();
    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update account.',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    navigate('..');
  };

  return (
    <Box sx={cardStyles}>
      <Typography variant="h5" gutterBottom>Add Product</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Code"
                name="product_code"
                value={formData.product_code}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={1}
                slotProps={{
                  input: {
                    maxLength: 5,
                  },
                }}
                style={{ width: '390px' }}  // fixed width
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} justifyContent="flex-end">
            <Grid item xs={12} textAlign="right">
              <Button variant="contained" onClick={handleCancel} color="warning">
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button variant="contained" type="submit" color="success" disabled={loading}>
                Save
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

export default FollowUpForm;


