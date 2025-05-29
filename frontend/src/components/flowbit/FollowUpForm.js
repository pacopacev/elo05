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

const FollowUpForm = () => {
  const [formData, setFormData] = useState({
    productCode: '',
    machineNumber: '',
    operator: '',
    shift: '',
    notes: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can add API call here
    console.log('Submitted Data:', formData);

    setSnackbar({
      open: true,
      message: 'Form submitted successfully!',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ maxWidth: 1045, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" gutterBottom>Add Menu</Typography>

      <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2}>
        <Grid container direction="row" spacing={2}>

          <Grid item xs={12}>
            <TextField
              label="Product Code"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Machine Number"
              name="machineNumber"
              value={formData.machineNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={1}
            />
          </Grid>



        </Grid>

        <Grid container direction="row" spacing={2}>

          <Grid item xs={12}>
            <TextField
              label="Product Code"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Machine Number"
              name="machineNumber"
              value={formData.machineNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Operator"
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={1}
            />
          </Grid>



        </Grid>

         <Grid container direction="row" spacing={2} justifyContent="flex-end">



            <Grid item xs={12} textAlign="right">

            <Button variant="contained" type="submit" color="warning">
              Cancel
            </Button>

          </Grid>


             <Grid item xs={12} textAlign="right">

            <Button variant="contained" type="submit" color="success">
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


