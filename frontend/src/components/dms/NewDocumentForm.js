import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css'; // Import default styles for dropzone
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import UniversalButton from '../../components/buttons/UniversalButton';

const NewDocumentForm = ({ }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
    const handleCancel = () => {
    navigate('..');
  };

  const [documentData, setDocumentData] = useState({
    title: '',
    description: '',
    category: '',
    changes: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => setFile(acceptedFiles[0])
  });

  const handleInputChange = (e) => {
    setDocumentData({
      ...documentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', documentData.title);
      formData.append('description', documentData.description);
      formData.append('category', documentData.category);
      formData.append('changes', documentData.changes);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dms/documents/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      if (!response.ok) {
        
        const errorMessage = await response.text();
        throw new Error(errorMessage.slice(2, -2));
      }

      setSuccess(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }

  };

  return (
    <Box sx={{ maxWidth: 550, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
      <Typography variant="h5" className="erp-font" gutterBottom>
        Create and Upload New Document
      </Typography>

      <div className="upload-modal">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Upload successful!</div>}

        <TextField
          sx={{ mb: 2 }}
          label="Title"
          name="title"
          value={documentData.title}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <TextField
          sx={{ mb: 2 }}
          label="Description"
          name="description"
          value={documentData.description}
          onChange={handleInputChange}
          rows={2}
          required
          fullWidth
        />

        <TextField
          label="Changes Description"
          name="changes"
          value={documentData.changes}
          onChange={handleInputChange}
          rows={8}
          required
          fullWidth
        />


        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {file ? (
            <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
          ) : (
            <p>Click to select</p>
          )}
        </div>


        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <UniversalButton
            sx={{ mt: 2 }}
            onClick={handleCancel}
            variant="danger"
          >
            Cancel
          </UniversalButton>

          <UniversalButton
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={uploading}
            variant="success"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </UniversalButton>

        </Stack>

      </div>
    </Box>
  );
};

export default NewDocumentForm;