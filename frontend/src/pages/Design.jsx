import React, { useState } from 'react';
import { Dashboard, Tasks, Tickets, Comments, Visitors, } from '../components2';
import Company from './Company';

const Design = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Company': return <Company />;
      case 'tickets': return <Tickets />;
      case 'comments': return <Comments />;
      case 'visitors': return <Visitors />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} 
      bg-gradient-to-br from-red-600 to-pink-700 text-white`}>
        <div className="flex items-center justify-between p-4">
          <h1 className={`${sidebarOpen ? 'text-lg font-semibold' : 'hidden'}`}>Sonee Medical</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            ☰
          </button>

        </div>
        <div className="mt-6 flex flex-col space-y-4 px-4">
          <button onClick={() => setActiveComponent('Company')}
           className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
            📋 {sidebarOpen && 'Company'}
          </button>
          <button onClick={() => setActiveComponent('tickets')} 
          className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
            ❓ {sidebarOpen && 'Employees'}
          </button>
          <button onClick={() => setActiveComponent('comments')} 
          className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
            💬 {sidebarOpen && 'Customer'}
          </button>
          <button onClick={() => setActiveComponent('visitors')}
           className="hover:bg-white/10 py-2 px-4 rounded flex items-center gap-2">
            ➕ {sidebarOpen && 'BillP'}
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
