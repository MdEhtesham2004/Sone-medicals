import React, { useState, useEffect } from 'react';
import api from '../api'; // Adjust the import based on your project structure
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCreditCustomerData } from '../store/creditSlice';


const AddCustomerModal = ({ isOpen, onClose, onAdd, editData }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pendingAmount, setPendingAmount] = useState('');
    const [lastPaymentAmount, setLastPaymentAmount] = useState('');
    const [lastPaymentDate, setLastPaymentDate] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchAccounts = async () => {
        api.get('/api/medical/CustomerCredit/')
          .then((res) => {
            dispatch(setCreditCustomerData(res.data));
            // setCustomers(res.data);
          })
          .catch((err) => {
            console.error("Error fetching accounts:", err);
            alert("Failed to fetch accounts. Please try again.");
          });
      }


    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setPhone(editData.phone || '');
            setPendingAmount(editData.pendingAmount || '');
            setLastPaymentAmount(editData.lastPayment?.amount || '');
            setLastPaymentDate(editData.lastPayment?.date || '');
        } else {
            setName('');
            setPhone('');
            setPendingAmount('');
            setLastPaymentAmount('');
            setLastPaymentDate('');
        }
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            contact: phone,
            pending_amount: pendingAmount,
            last_payment_date: lastPaymentDate,
            last_payment_amount: lastPaymentAmount
        };
        try {
            if (editData) {

                await api.put(`/api/medical/CustomerCredit/${editData.id}/`, payload);
                // console.log("Customer updated:", res.data);
                fetchAccounts();
            } else {

                 await api.post('/api/medical/CustomerCredit/', payload);
                // console.log("Customer added:", res.data);
                fetchAccounts();
            }

            onClose();
            navigate('/credit');
        } catch (err) {
            console.error("Error adding customer:", err.response?.data || err.message);
            alert("Failed to add customer");
        }

    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">{editData ? 'Edit' : 'Add'} Customer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Pending Amount"
                        value={pendingAmount}
                        onChange={(e) => setPendingAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Last Payment Amount"
                        value={lastPaymentAmount}
                        onChange={(e) => setLastPaymentAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="date"
                        value={lastPaymentDate}
                        onChange={(e) => setLastPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;

