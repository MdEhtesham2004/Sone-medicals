import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
// import './Billprint.css'
import { useNavigate } from "react-router-dom";

const Bill = () => {
    const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", billId: "" });
  const [medicineRows, setMedicineRows] = useState([createNewRow(1)]);
  const billRef = useRef();
  const [medicinesDB, setMedicinesDB] = useState([]);

  useEffect(() => {
    api.get('/api/medical/medicine/')
      .then((res) => res.data)
      .then((data) => {
        setMedicinesDB(data.data);
      })
      .catch((err) => {
        console.error("Error fetching medicines:", err);
      });
  }, []);

  useEffect(()=>{
    api.post('Api/generatebill/')
    .then((res)=>res.data)
    .then((data)=>{
      console.log(data)
    })
  },[])

  function createNewRow(srNo) {
    return {
      srNo,
      name: "", pack: "", batchNo: "", mfgDate: "", expDate: "",
      qty: "", mrp: "", rate: "", discount: "", amount: "",
      isEditing: true,
      backup: null,
      showDropdown: false,
      filteredOptions: [],
      highlightedIndex: -1,
    };
  }

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    setMedicineRows(prev => [
      ...prev,
      createNewRow(prev.length + 1)
    ]);
  };

  const handleRemoveRow = (index) => {
    setMedicineRows(prev => prev.filter((_, i) => i !== index).map((row, i) => ({
      ...row,
      srNo: i + 1
    })));
  };

  const handleInputChange = (index, field, value) => {
    setMedicineRows(prev => {
      const updatedRows = [...prev];
      const row = updatedRows[index];
      row[field] = value;

      if (field === "name") {
        const matches = medicinesDB.filter(med => med.name.toLowerCase().includes(value.toLowerCase()));
        row.filteredOptions = matches;
        row.showDropdown = true;
        row.highlightedIndex = -1;
      }

      const { qty, mrp, discount } = row;
      if (qty && mrp) {
        const priceWithoutDiscount = parseFloat(mrp) * parseFloat(qty);
        const discountAmount = priceWithoutDiscount * (parseFloat(discount) || 0) / 100;
        const finalAmount = priceWithoutDiscount - discountAmount;
        row.amount = finalAmount.toFixed(2);
        if (qty > 0) row.rate = (finalAmount / qty).toFixed(2);
      }

      return updatedRows;
    });
  };

  const handleSelectMedicine = (index, selectedMed) => {
    setMedicineRows(prev => {
      const updated = [...prev];
      const row = updated[index];
      Object.assign(row, {
        name: selectedMed.name,
        batchNo: selectedMed.batch_no,
        mfgDate: selectedMed.mfg_date,
        expDate: selectedMed.exp_date,
        pack: selectedMed.pack,
        mrp: selectedMed.mrp,
        rate: selectedMed.mrp,
        showDropdown: false,
        filteredOptions: [],
        highlightedIndex: -1,
      });
      return updated;
    });
  };

  const handleKeyDown = (index, e) => {
    setMedicineRows(prev => {
      const updated = [...prev];
      const row = updated[index];
      const maxIndex = row.filteredOptions.length - 1;

      if (e.key === "ArrowDown") {
        row.highlightedIndex = row.highlightedIndex < maxIndex ? row.highlightedIndex + 1 : 0;
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        row.highlightedIndex = row.highlightedIndex > 0 ? row.highlightedIndex - 1 : maxIndex;
        e.preventDefault();
      } else if (e.key === "Enter" && row.highlightedIndex >= 0) {
        handleSelectMedicine(index, row.filteredOptions[row.highlightedIndex]);
        e.preventDefault();
      }

      return updated;
    });
  };

  const handleBlur = (index) => {
    setTimeout(() => {
      setMedicineRows(prev => {
        const updated = [...prev];
        updated[index].showDropdown = false;
        return updated;
      });
    }, 150);
  };

  const handleSave = (index) => {
    const row = medicineRows[index];
    for (const field of ['name', 'qty', 'mrp']) {
      if (!row[field]) {
        toast.error(`${field.toUpperCase()} cannot be empty`);
        return;
      }
    }
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...row, isEditing: false, backup: null } : row
    ));
    toast.success("Row saved");
  };

  const startEdit = (index) => {
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...row, isEditing: true, backup: { ...row } } : row
    ));
  };

  const cancelEdit = (index) => {
    setMedicineRows(prev => prev.map((row, i) =>
      i === index && row.backup ? { ...row.backup, isEditing: false, backup: null } : row
    ));
  };

  const validateCustomerDetails = () => {
    for (const field of ['name', 'address', 'phone', 'billId']) {
      if (!customer[field]) {
        toast.error(`Customer ${field} cannot be empty`);
        return false;
      }
    }
    return true;
  };

  const generatePDF = () => {
    if (!validateCustomerDetails()) return;
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" ref={billRef}>
      <h1 className="text-2xl font-semibold mb-6">Generate Bill for Customers</h1>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {['name', 'address', 'phone', 'billId'].map(field => (
          <div key={field}>
            <label className="text-gray-700 text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)} :</label>
            <input
              name={field}
              value={customer[field]}
              onChange={handleCustomerChange}
              placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              className="w-full border-b border-gray-400 outline-none py-1 mt-1"
            />
          </div>
        ))}
      </div>

      {/* Medicine Details */}
      <h2 className="text-xl font-semibold mb-4">Medicine Details</h2>
      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 border-b pb-2 mb-4">
        <div>Sr No</div><div>Name</div><div>Pack</div><div>Batch No</div><div>Mfg Date</div><div>Exp Date</div>
        <div>Qty</div><div>MRP</div><div>Rate</div><div>Discount (%)</div><div>Amount</div><div className="no-print">Actions</div>
      </div>

      {medicineRows.map((row, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-start mb-3 relative">
          <input type="text" value={row.srNo} disabled className="border-b py-1 text-sm w-6 " />
          <div className="relative col-span-1">
            <input
              type="text"
              placeholder="Name"
              value={row.name}
              onChange={e => handleInputChange(index, 'name', e.target.value)}
              onFocus={() => handleInputChange(index, 'name', row.name)}
              onBlur={() => handleBlur(index)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="border-b border-gray-300 outline-none py-1 text-sm w-full"
              disabled={!row.isEditing}
            />
            {row.showDropdown && (
              <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-40 overflow-auto text-sm">
                {row.filteredOptions.length === 0 ? (
                  <li className="px-2 py-1 text-gray-500">No results found</li>
                ) : (
                  row.filteredOptions.map((option, i) => (
                    <li
                      key={i}
                      onMouseDown={() => handleSelectMedicine(index, option)}
                      className={`px-2 py-1 cursor-pointer hover:bg-blue-100 ${
                        row.highlightedIndex === i ? "bg-blue-200" : ""
                      }`}
                    >
                      {option.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          {['pack', 'batchNo', 'mfgDate', 'expDate', 'qty', 'mrp', 'rate', 'discount', 'amount'].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={row[field]}
              onChange={e => handleInputChange(index, field, e.target.value)}
              className="border-b border-gray-300 outline-none  py-1 text-sm"
              disabled={
                ['pack', 'batchNo', 'mfgDate', 'expDate', 'mrp', 'rate', 'amount'].includes(field) ||
                !row.isEditing
              }
            />
          ))}
          <div className="flex flex-wrap gap-1 justify-center no-print">
            {row.isEditing ? (
              <>
                <button onClick={() => handleSave(index)} className="bg-green-600 text-white text-xs px-2 py-1 rounded">Save</button>
                <button onClick={() => cancelEdit(index)} className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(index)} className="bg-yellow-400 text-white text-xs px-2 py-1 rounded no-print">Edit</button>
                <button onClick={() => handleRemoveRow(index)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Delete</button>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-6 no-print">
        <button onClick={handleAddRow} className="bg-green-700 text-white font-semibold px-5 py-2 rounded shadow">ADD MEDICINE DETAILS</button>
        {medicineRows.length > 1 && (
          <button onClick={() => handleRemoveRow(medicineRows.length - 1)} className="bg-orange-500 text-white font-semibold px-5 py-2 rounded shadow">REMOVE LAST ROW</button>
        )}
      </div>

      <button onClick={generatePDF} className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded shadow no-print">
        Generate Bill
      </button>

      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} pauseOnHover theme="colored" />
    
    </div>
    

  );
};

export default Bill;



