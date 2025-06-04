import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBriefcaseMedical, FaPills, FaHome, FaUserTie, FaCreditCard, FaBookMedical } from 'react-icons/fa';
import { MdReceiptLong } from 'react-icons/md';

const Design = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const hideStatusRoutes = ['/Preview'];

  const shouldHideSidebar = hideStatusRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar - Hidden on preview route */}
      {!shouldHideSidebar && (
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-br from-red-600 to-pink-700 text-white`}>
          <div className="flex items-center justify-between p-4">
            <h1 className={`${sidebarOpen ? 'text-lg font-semibold' : 'hidden'}`}>Sonee Medical</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white cursor-pointer">☰</button>
          </div>

          <div className="mt-6 flex flex-col space-y-4 px-4">
            <Link to="/" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaHome /> {sidebarOpen && 'Home'}
            </Link>
            <Link to="/company" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaBriefcaseMedical /> {sidebarOpen && 'Agencies'}
            </Link>
            <Link to="/medicines" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaPills /> {sidebarOpen && 'Add Medicines'}
            </Link>
            <Link to="/bill" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <MdReceiptLong /> {sidebarOpen && 'Generate Bill'}
            </Link>
            <Link to="/credit" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaUserTie /> {sidebarOpen && 'Credit'}
            </Link>
            <Link to="/shortage" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaBookMedical /> {sidebarOpen && 'Shortage'}
            </Link>
            <Link to="/logout" className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
              <FaCreditCard /> {sidebarOpen && 'Logout'}
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Design;
