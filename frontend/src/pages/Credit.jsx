import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AddCustomerModal from '../pages/AddCustomerModal'
import { useSelector, useDispatch } from 'react-redux';
import { setCreditCustomerData } from '../store/creditSlice';
import { useLocation } from 'react-router-dom';
import PasswordModal from './PasswordModal'

const colors = [
  'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200',
  'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-teal-200'
];

const Credit = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  // Authentication state
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const creditCustomers = useSelector((state) => state.credit.creditCustomerData.data);

  useEffect(() => {
    if (creditCustomers && creditCustomers.length > 0) {
      setCustomers(creditCustomers);
    }
  }, [creditCustomers]);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/credit') {
      api.get('/api/medical/CustomerCredit/')
        .then((res) => {
          dispatch(setCreditCustomerData(res.data));
          setCustomers(res.data);
          // console.log(res.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [location.pathname]);




  const handleAddAccount = () => {
    setEditCustomer(null);
    setModalOpen(true);
  };

  const handleAddOrEditCustomer = (customer) => {
    if (editCustomer) {
      // ✏️ Update
      const updated = customers.map(c => c.id === customer.id ? customer : c);
      setCustomers(updated);
      setEditCustomer(null);
    } else {
      // ➕ Add
      setCustomers([...customers, customer]);
    }
    setModalOpen(false);
  };

  // Authentication wrapper for edit action
  const handleEditClick = (customer, e) => {
    e.stopPropagation();
    setPendingAction({
      type: 'edit',
      customer: customer,
      callback: () => {
        setEditCustomer(customer);
        setModalOpen(true);
      }
    });
    setPasswordModalOpen(true);
  };

  // Authentication wrapper for delete action
  const handleDeleteCustomer = async (id, e) => {
    e.stopPropagation();
    const customer = customers.find(c => c.id === id);
    setPendingAction({
      type: 'delete',
      customer: customer,
      callback: async () => {
        const confirmed = window.confirm(`Are you sure you want to delete ${customer.name}'s account?`);
        if (confirmed) {
          try {
            await api.delete(`/api/medical/CustomerCredit/${id}/`);
            // Optionally refetch or remove from redux
            const res = await api.get('/api/medical/CustomerCredit/');
            dispatch(setCreditCustomerData(res.data));
            setCustomers(customers.filter(c => c.id !== id));
            console.log(`Deleted customer with ID: ${id}`);
          } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete customer. Please try again.');
          }
        }
      }
    });
    setPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    if (pendingAction && pendingAction.callback) {
      pendingAction.callback();
    }
    setPendingAction(null);
  };

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false);
    setPendingAction(null);
  };

  const handleCardClick = (customer) => {
    navigate(`/credit/${customer.id}`);
  };

  
  const filteredCustomers = Array.isArray(customers)
    ? customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="p-4">
      {/* Search & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddAccount}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Account
        </button>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCustomers.map((customer, index) => (
          <div
            key={customer.id}
            className={`relative p-4 rounded-lg shadow-md cursor-pointer transition hover:scale-105 ${colors[index % colors.length]}`}
            onClick={() => handleCardClick(customer)}
          >
            {/* Top-right icons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={(e) => handleEditClick(customer, e)}
                className="text-gray-600 text-sm hover:text-blue-700 
                transition-colors p-1 rounded hover:bg-white hover:bg-opacity-50"
                title="Edit customer"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => handleDeleteCustomer(customer.id, e)}
                className="text-red-500 text-sm hover:text-red-700 
                transition-colors p-1 rounded hover:bg-white hover:bg-opacity-50"
                title="Delete customer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Card Content */}
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            <p className="text-sm">Phone: {customer.contact}</p>
            <p className="text-md font-medium mt-2">Pending: ₹{customer.pending_amount}</p>
            <p className="text-sm mt-1">
              Last Payment: ₹{customer.last_payment_amount?.amount} on {customer.last_payment_date}
            </p>
          </div>
        ))}
      </div>

      {/* No customers message */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No customers found matching your search.' : 'No customers added yet.'}
        </div>
      )}

      {/* Add or Edit Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCustomer(null);
        }}
        onAdd={handleAddOrEditCustomer}
        editData={editCustomer}
      />

      {/* Password Authentication Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        onSuccess={handlePasswordSuccess}
        action={pendingAction?.type === 'edit' ? 'edit this customer' : 'delete this customer'}
      />
    </div>
  );
};

export default Credit;

