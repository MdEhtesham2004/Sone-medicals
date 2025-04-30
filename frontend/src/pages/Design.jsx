import React, { useState } from 'react';
import { Dashboard, Tasks, Tickets, Comments, Visitors, } from '../components2';
import Company from './Company';
import Medicines from './Medicines.jsx'
import Bill from './Bill.jsx';
import { FaBriefcaseMedical, FaPills, FaHome, FaUserTie, FaCreditCard } from 'react-icons/fa';
import { MdReceiptLong } from 'react-icons/md';
import PreviewBill from './PreviewBill.jsx';




const Design = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Company': return <Company />;
      case 'Medicines': return <Medicines />;
      case 'PreviewBill': return <PreviewBill />;
      case 'Bill': return <Bill />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className={`transition-all duration-300  ${sidebarOpen ? 'w-64' : 'w-16'} 
      bg-gradient-to-br from-red-600 to-pink-700 text-white`}>
        <div className="flex items-center justify-between p-4">
          <h1 className={`${sidebarOpen ? 'text-lg font-semibold' : 'hidden'}`}>Sonee Medical</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white cursor-pointer">
            ☰
          </button>

        </div>


        <div className="mt-6 flex flex-col space-y-4 px-4">
          <button onClick={() => setActiveComponent('dashboard')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
             {/* 📋  */}
             <FaHome/>{sidebarOpen && 'Home'} 
          </button>
          

          {/* <div className="mt-6 flex flex-col space-y-4 px-4"> */}
          <button onClick={() => setActiveComponent('Company')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            {/* 📋 */}
            <FaBriefcaseMedical /> {sidebarOpen && 'Agencies'}
          </button>

          <button onClick={() => setActiveComponent('Medicines')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            <FaPills />
            {sidebarOpen && 'Add Medicines'}
          </button>
          <button onClick={() => setActiveComponent('Bill')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            <MdReceiptLong /> {sidebarOpen && 'Generate Bill'}
          </button>

          <button onClick={() => setActiveComponent('PreviewBill')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            <FaUserTie /> {sidebarOpen && 'PreviewBill'}
          </button>
          <button onClick={() => setActiveComponent('comments')}
            className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            <FaCreditCard /> {sidebarOpen && 'Credit Section'}
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Design;


