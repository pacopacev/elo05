import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/flowbit.png';

const YourAccountComponent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    date_joined: '',
    date_joined_readable: '',
    image: '',
  });

  const [preview, setPreview] = useState(logo);
  const [imageFile, setImageFile] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/your_account/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }

      const data = await response.json();
      const readable = new Date(data.date_joined).toLocaleString();

      setFormData({
        ...data,
        date_joined_readable: readable,
        image: data.image || '',
      });

      if (data.image) {
        setPreview(data.image);
      } else {
        setPreview(logo);
      }

    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');

      const formPayload = new FormData();
      formPayload.append('id', formData.id);
      formPayload.append('username', formData.username);
      formPayload.append('email', formData.email);
      if (imageFile) {
        formPayload.append('image', imageFile);
      }

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
    <Box sx={{ maxWidth: 840, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" gutterBottom>Your Profile</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {preview && (
          <Avatar
            alt="Preview"
            src={preview}
            variant="rounded"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
        )}
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Choose Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>

        <Grid container direction="column" spacing={2}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Date Joined"
                name="date_joined"
                value={formData.date_joined_readable}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Profile Picture URL"
                name="image"
                value={formData.image}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" onClick={handleCancel} color="warning">
                Cancel
              </Button>
            </Grid>
            <Grid item>
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

export default YourAccountComponent;
