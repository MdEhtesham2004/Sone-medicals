// import React, { useState, useEffect } from 'react';
// import { Trash2, Edit } from 'lucide-react';
// import api from '../api'; 

// const Delivery = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [formData, setFormData] = useState({
//     date: '',
//     person: '',
//     medicines: '',
//     totalAmount: '',
//     paymentStatus: 'Pending'
//   });

//   const [editIndex, setEditIndex] = useState(null);

//   // Fetch existing deliveries
//   useEffect(() => {
//     fetchDeliveries();
//   }, []);

//   const fetchDeliveries = async () => {
//     try {
//       const res = await api.get('/deliveries/');
//       setDeliveries(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editIndex !== null) {
//         const updated = await api.put(`/deliveries/${deliveries[editIndex].id}/`, formData);
//         const updatedList = [...deliveries];
//         updatedList[editIndex] = updated.data;
//         setDeliveries(updatedList);
//         setEditIndex(null);
//       } else {
//         const res = await api.post('/deliveries/', formData);
//         setDeliveries(prev => [...prev, res.data]);
//       }
//       setFormData({ date: '', person: '', medicines: '', totalAmount: '', paymentStatus: 'Pending' });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (index) => {
//     setFormData(deliveries[index]);
//     setEditIndex(index);
//   };

//   const handleDelete = async (index) => {
//     const id = deliveries[index].id;
//     try {
//       await api.delete(`/deliveries/${id}/`);
//       setDeliveries(prev => prev.filter((_, i) => i !== index));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Delivery Management</h2>

//       <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-md space-y-4">
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="person"
//           placeholder="Delivery Person"
//           value={formData.person}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <textarea
//           name="medicines"
//           placeholder="Medicines (comma separated)"
//           value={formData.medicines}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//         <input
//           type="number"
//           name="totalAmount"
//           placeholder="Total Amount"
//           value={formData.totalAmount}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <select
//           name="paymentStatus"
//           value={formData.paymentStatus}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         >
//           <option value="Pending">Pending</option>
//           <option value="Paid">Paid</option>
//           <option value="UPI">UPI</option>
//           <option value="Cash">Cash</option>
//           <option value="Card">Card</option>
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {editIndex !== null ? 'Update Delivery' : 'Add Delivery'}
//         </button>
//       </form>

//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Deliveries</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border rounded-lg">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-3 border">Date</th>
//                 <th className="py-2 px-3 border">Person</th>
//                 <th className="py-2 px-3 border">Medicines</th>
//                 <th className="py-2 px-3 border">Amount</th>
//                 <th className="py-2 px-3 border">Status</th>
//                 <th className="py-2 px-3 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {deliveries.map((entry, index) => (
//                 <tr key={entry.id}>
//                   <td className="py-2 px-3 border">{entry.date}</td>
//                   <td className="py-2 px-3 border">{entry.person}</td>
//                   <td className="py-2 px-3 border">{entry.medicines}</td>
//                   <td className="py-2 px-3 border">₹{entry.totalAmount}</td>
//                   <td className="py-2 px-3 border">{entry.paymentStatus}</td>
//                   <td className="py-2 px-3 border space-x-2">
//                     <button onClick={() => handleEdit(index)}>
//                       <Edit size={18} />
//                     </button>
//                     <button onClick={() => handleDelete(index)}>
//                       <Trash2 size={18} className="text-red-600" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {deliveries.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center py-4 text-gray-500">
//                     No deliveries yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Delivery;



import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import api from '../api'; 

// Enhanced Medicine Input Component
const SmartMedicineInput = ({ 
  value, 
  onChange, 
  medicinesDB, 
  placeholder = "Start typing medicine names... (separate with commas)"
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(currentWord);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentWord]);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    return medicinesDB
      .filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.batch_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.generic_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bExact = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [medicinesDB, searchTerm]);

  const getCurrentWord = useCallback((text, position) => {
    const beforeCursor = text.substring(0, position);
    const afterCursor = text.substring(position);

    const lastComma = beforeCursor.lastIndexOf(',');
    const nextComma = afterCursor.indexOf(',');

    const start = lastComma === -1 ? 0 : lastComma + 1;
    const end = nextComma === -1 ? text.length : position + nextComma;

    const word = text.substring(start, end).trim();
    return { word, start, end };
  }, []);

  const handleInputChange = useCallback((e) => {
    const inputValue = e.target.value;
    const position = e.target.selectionStart;

    onChange(inputValue);
    setCursorPosition(position);

    const { word } = getCurrentWord(inputValue, position);
    setCurrentWord(word);

    if (word.length >= 2) {
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [onChange, getCurrentWord]);

  const handleKeyDown = useCallback((e) => {
    if (!showDropdown || filteredOptions.length === 0) return;

    const maxIndex = filteredOptions.length - 1;

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex(prev => prev < maxIndex ? prev + 1 : 0);
        e.preventDefault();
        break;
      case "ArrowUp":
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
        e.preventDefault();
        break;
      case "Enter":
      case "Tab":
        if (highlightedIndex >= 0) {
          selectMedicine(filteredOptions[highlightedIndex]);
          e.preventDefault();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [showDropdown, filteredOptions, highlightedIndex]);

  const selectMedicine = useCallback((selectedMed) => {
    const { word, start, end } = getCurrentWord(value, cursorPosition);

    const beforeWord = value.substring(0, start);
    const afterWord = value.substring(end);

    const newText = beforeWord + selectedMed.name + afterWord;
    onChange(newText);

    setShowDropdown(false);

    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + selectedMed.name.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  }, [value, cursorPosition, getCurrentWord, onChange]);

  const handleBlur = useCallback((e) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => setShowDropdown(false), 150);
  }, []);

  const handleFocus = useCallback(() => {
    if (currentWord.length >= 2 && filteredOptions.length > 0) {
      setShowDropdown(true);
    }
  }, [currentWord, filteredOptions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
      />

      {showDropdown && filteredOptions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-auto"
        >
          <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 font-medium border-b flex items-center gap-2">
            <Search size={12} />
            {filteredOptions.length} matches for "{searchTerm}"
          </div>
          
          {filteredOptions.map((option, i) => (
            <div
              key={`${option.id}-${i}`}
              onMouseDown={() => selectMedicine(option)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                highlightedIndex === i 
                  ? "bg-blue-100 border-blue-200" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-gray-900">{option.name}</div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Batch: {option.batch_no || 'N/A'}</span>
                <span className="font-medium text-green-600">₹{option.mrp || '0'}</span>
              </div>
              {option.generic_name && (
                <div className="text-xs text-blue-600 mt-1">
                  {option.generic_name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1 flex items-center gap-4">
        <span>💡 Use ↑↓ to navigate, Enter/Tab to select</span>
        <span className="text-blue-600">Type 2+ chars to search</span>
      </div>
    </div>
  );
};

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [medicinesDB, setMedicinesDB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    person: '',
    medicines: '',
    totalAmount: '',
    paymentStatus: 'Pending'
  });

  const [editIndex, setEditIndex] = useState(null);

  // Fetch existing deliveries and medicines
  useEffect(() => {
    fetchDeliveries();
    fetchMedicines();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deliveries/');
      setDeliveries(res.data);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/api/medical/medicine/');
      if (res.data && res.data.data) {
        setMedicinesDB(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMedicineChange = (value) => {
    setFormData(prev => ({
      ...prev,
      medicines: value
    }));

    // Auto-calculate total amount based on selected medicines
    if (value) {
      const medicineNames = value.split(',').map(name => name.trim()).filter(Boolean);
      let estimatedTotal = 0;
      
      medicineNames.forEach(name => {
        const medicine = medicinesDB.find(med => 
          med.name.toLowerCase() === name.toLowerCase()
        );
        if (medicine && medicine.mrp) {
          estimatedTotal += parseFloat(medicine.mrp);
        }
      });

      if (estimatedTotal > 0 && !formData.totalAmount) {
        setFormData(prev => ({
          ...prev,
          totalAmount: estimatedTotal.toString()
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editIndex !== null) {
        const updated = await api.put(`/deliveries/${deliveries[editIndex].id}/`, formData);
        const updatedList = [...deliveries];
        updatedList[editIndex] = updated.data;
        setDeliveries(updatedList);
        setEditIndex(null);
      } else {
        const res = await api.post('/deliveries/', formData);
        setDeliveries(prev => [...prev, res.data]);
      }
      setFormData({ date: '', person: '', medicines: '', totalAmount: '', paymentStatus: 'Pending' });
    } catch (err) {
      console.error('Error saving delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setFormData(deliveries[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const id = deliveries[index].id;
    try {
      setLoading(true);
      await api.delete(`/deliveries/${id}/`);
      setDeliveries(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ date: '', person: '', medicines: '', totalAmount: '', paymentStatus: 'Pending' });
    setEditIndex(null);
  };

  const addFrequentMedicines = () => {
    const frequentMeds = medicinesDB
      .filter(med => med.frequently_used || med.popular)
      .slice(0, 5)
      .map(med => med.name)
      .join(', ');
    
    handleMedicineChange(formData.medicines ? formData.medicines + ', ' + frequentMeds : frequentMeds);
  };

  // Calculate summary stats
  const totalDeliveries = deliveries.length;
  const totalAmount = deliveries.reduce((sum, delivery) => sum + parseFloat(delivery.totalAmount || 0), 0);
  const pendingCount = deliveries.filter(d => d.paymentStatus === 'Pending').length;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Delivery Management</h2>
        <div className="flex gap-4 text-sm">
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="font-medium">Total: {totalDeliveries}</span>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full">
            <span className="font-medium">Amount: ₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="bg-orange-100 px-3 py-1 rounded-full">
            <span className="font-medium">Pending: {pendingCount}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-lg space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Person</label>
            <input
              type="text"
              name="person"
              placeholder="Enter delivery person name"
              value={formData.person}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicines (Comma Separated)
          </label>
          <SmartMedicineInput
            value={formData.medicines}
            onChange={handleMedicineChange}
            medicinesDB={medicinesDB}
            placeholder="Start typing medicine names... (separate multiple medicines with commas)"
          />
          
          {medicinesDB.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={addFrequentMedicines}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1"
              >
                <Plus size={12} />
                Add Frequent Medicines
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
            <input
              type="number"
              name="totalAmount"
              placeholder="Total amount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading ? 'Processing...' : (editIndex !== null ? 'Update Delivery' : 'Add Delivery')}
          </button>
          
          {editIndex !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Delivery Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{entry.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{entry.person}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={entry.medicines}>
                    {entry.medicines}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{entry.totalAmount}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      entry.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm space-x-2">
                    <button 
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit delivery"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete delivery"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {deliveries.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {loading ? 'Loading deliveries...' : 'No deliveries recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Delivery;