// src/pages/Dashboard.tsx
import React from 'react';
import UserList from '../components/UserList';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <UserList />
    </div>
  );
};

export default Dashboard;
