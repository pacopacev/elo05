import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import UniversalTable from '../../components/UniversalTable';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import logo from '../../assets/images/flowbit.png';
import UniversalWindow from '../../components/UniversalWindow/UniversalWindow';

import UniversalButton from '../../components/buttons/UniversalButton';
import {
    Button,
    Snackbar,
    Alert as MuiAlert,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    CircularProgress,

} from '@mui/material';



const AllDocumentList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');

    


    // Fetch data function
    const fetchData = useCallback(async () => {
        const searchTerm = searchText.trim();
        const urlParams = new URLSearchParams();
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentication required');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        
        if (searchTerm.trim()) {
            urlParams.append('search', searchTerm.trim());
        }
        try {
            const response = await apiRequest('GET', `${process.env.REACT_APP_API_BASE_URL}/api/dms/documents/?${urlParams.toString()}`, {}, { token });

            if (!response) {
                throw new Error('No response received');
            }

            setTableData(response);
            setError(null);
            return response;
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load data');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchData('');
    }, [fetchData]);

    const handleSearch = useCallback((searchTerm) => {
        setSearchText(searchTerm);
        fetchData(searchTerm);
    }, [fetchData]);

    //   if (loading) return <div>Loading...</div>;
    //   if (error) return <div>Error: {error}</div>;
    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id', width: 20 },
        { Header: 'Title', accessor: 'title', width: 30 },
        { Header: 'Description', accessor: 'description', width: 20 },
        { Header: 'Owner', accessor: 'owner.username', width: 100 },
        { Header: 'Category', accessor: 'category', width: 100 },
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


    ], []);

    return (
        <>
            <Tooltip title="This is a list of all documents.">
                <Typography variant="h5" className="erp-font" gutterBottom>
                    Document list
                </Typography>
            </Tooltip>
            <Stack direction="row" justifyContent="flex-end" mb={2}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { marginRight: 2, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Box>
                <UniversalButton
                    variant="success"
                    size='small'
                    //   onClick={() => {
                    //     setWindowOpen(true);
                    //     setIsMinimized(false);
                    //   }}
                    style={{ marginBottom: 2 }}
                >
                    Add Product
                </UniversalButton>
            </Stack>
            <UniversalTable
                columns={columns}
                data={tableData}
                loading={isLoading}
                error={error}
            // onRefresh={() => fetchData(searchText)}
            />
        </>

    );
};

export default AllDocumentList;