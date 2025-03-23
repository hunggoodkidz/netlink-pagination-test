import React from 'react';
import Sidebar from '../components/Sidebar'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with more modern styling */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
        <main className="flex-1 p-6 bg-white shadow-lg rounded-lg mx-8 my-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;