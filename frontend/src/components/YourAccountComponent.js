import React, { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Alert
} from '@mui/material';

const YourAccountComponent = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:8000/api/your_account/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1045, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" gutterBottom>Your Account Details</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username || ''}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={formData.email || ''}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.first_name || ''}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.last_name || ''}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default YourAccountComponent;
