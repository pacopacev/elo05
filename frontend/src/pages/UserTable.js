import React, { useMemo, useState, useEffect } from 'react';
import UniversalTable from '../components/UniversalTable';
import { apiRequest } from '../utils/api';

const UsersTablePage = () => {

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = useMemo(() => [
    { Header: 'User ID', accessor: 'id', width: 20 },
    { Header: 'User Name', accessor: 'username', width: 30, },
    { Header: 'Email', accessor: 'email', width: 20, },
    {
      Header: 'Date Joinrd',
      accessor: 'date_joined',
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
    }
  ], []);

  const fetchData = async () => {
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `${process.env.REACT_APP_API_BASE_URL}/api/users/`, {}, { token });
      setTableData(response);
    }   catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div >
        <h1 className="text-2xl font-bold text-center mb-4">Auth User List</h1>
      </div>

      <UniversalTable 
      columns={columns}
        data={tableData}
        loading={isLoading}
        error={error} />
    </>
  );
};

export default UsersTablePage;

