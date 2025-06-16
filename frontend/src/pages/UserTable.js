import React, { useMemo } from 'react';
import UniversalTable from '../components/UniversalTable';
import { apiRequest } from '../utils/api';

const UsersTablePage = () => {
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
    return await apiRequest('GET', `${process.env.REACT_APP_API_BASE_URL}/api/users/`, {}, { token });
  };

  return(
  <>
  <div >
  <h1 className="text-2xl font-bold text-center mb-4">Auth User List</h1>
  </div>

  <UniversalTable columns={columns} fetchData={fetchData} />
  </>
);
};

export default UsersTablePage;
