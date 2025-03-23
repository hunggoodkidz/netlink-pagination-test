import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
      <h2 className="text-3xl font-bold mb-6"> NETLINK-TEST Application</h2>
      <ul className="flex-1">
        <li>
          <Link to="/" className="block py-2 px-4 mb-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/user" className="block py-2 px-4 mb-2 hover:bg-gray-700 rounded">
            User List
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
