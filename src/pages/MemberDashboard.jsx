

import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ClassList from './ClassList';
import { AuthContext } from '../contexts/AuthContext';
import ClassDetails from './ClassDetails';

export default function MemberDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const formattedName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : 'Member';

  const handleLogout = () => {
    logout();
    navigate('/login'); // redirect to login
  };


   const baseBtn =
    "px-4 py-2 text-white font-semibold rounded shadow transition duration-300";
  const redGradient =
    "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700";

  return (
    <>
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Member Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
            Hello, {formattedName}
          </div>
          <button
            onClick={handleLogout}
           className={`${baseBtn} ${redGradient} text-xs px-3 py-1`}
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="flex space-x-6 mb-6 text-lg font-medium text-blue-600">
        <Link to="/member/classes" className="hover:underline">Classes</Link>
       
      </nav>

      <Routes>
        <Route path="classes" element={<ClassList />} />
        <Route path="classes/:id" element={<ClassDetails />} />
       
      </Routes>
    </div>
    </>
  );
}
