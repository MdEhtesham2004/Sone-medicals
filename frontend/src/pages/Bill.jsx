import React, { useState, useRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bill = () => {
  // Customer details state
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", billId: "" });
  // Medicine rows with edit and save state
  const [medicineRows, setMedicineRows] = useState([
    { srNo: "", name: "", qty: "", qtyType: "", unitPrice: "", amount: "", isEditing: true, hasSaved: false }
  ]);
  const [originalRow, setOriginalRow] = useState(null);
  const billRef = useRef();

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    setMedicineRows(prev => [
      ...prev,
      { srNo: "", name: "", qty: "", qtyType: "", unitPrice: "", amount: "", isEditing: true, hasSaved: false }
    ]);
  };

  const handleRemoveRow = (index) => {
    setMedicineRows(prev => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...row, isEditing: true } : row
    ));
    setOriginalRow(medicineRows[index]);
  };

  const handleInputChange = (index, field, value) => {
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = (index) => {
    const row = medicineRows[index];
    const empty = [row.srNo, row.name, row.qty, row.qtyType, row.unitPrice, row.amount].some(v => v === "");
    if (empty) {
      toast.error("Fields cannot be empty");
      return;
    }
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...row, isEditing: false, hasSaved: true } : row
    ));
    setOriginalRow(null);
    toast.success("Row saved");
  };

  const handleCancel = (index) => {
    setMedicineRows(prev => prev.map((row, i) =>
      i === index ? { ...originalRow, isEditing: false, hasSaved: false } : row
    ));
    setOriginalRow(null);
  };

  const generatePDF = () => window.print();

  return (
    <div className="p-6 max-w-6xl mx-auto" ref={billRef}>
      <h1 className="text-xl font-semibold mb-4">Generate Bill for Customers</h1>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {['name','address','phone','billId'].map(field => (
          <div key={field}>
            <label className="text-gray-700 text-sm font-medium">{field.charAt(0).toUpperCase()+field.slice(1)} :</label>
            <input
              name={field}
              value={customer[field]}
              onChange={handleCustomerChange}
              placeholder={`Enter ${field.charAt(0).toUpperCase()+field.slice(1)}`}
              className="w-full border-b border-gray-400 outline-none py-1 mt-1"
            />
          </div>
        ))}
      </div>

      {/* Medicine Details Header */}
      <h2 className="text-lg font-semibold mb-2">Medicine Details</h2>
      <div className="grid grid-cols-7 gap-4 text-sm font-medium border-b pb-2 mb-2">
        <div>SR No</div><div>Name</div><div>Qty</div><div>Qty Type</div><div>Unit Price</div><div>Amount</div><div>Actions</div>
      </div>

      {/* Medicine Rows */}
      {medicineRows.map((row, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 items-center mb-2">
          {['srNo','name','qty','qtyType','unitPrice','amount'].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={row[field]}
              onChange={e => handleInputChange(index, field, e.target.value)}
              className="border-b border-gray-300 outline-none py-1"
            />
          ))}
          <div className="flex gap-2">
            {row.isEditing ? (
              <>
                <button onClick={() => handleSave(index)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Save</button>
                {row.hasSaved && <button onClick={() => handleCancel(index)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>}
              </>
            ) : (
              <>
                <button onClick={() => startEdit(index)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleRemoveRow(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Add/Remove Buttons */}
      <div className="flex gap-4 mt-6 no-print">
        <button onClick={handleAddRow} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow">ADD MEDICINE DETAILS</button>
        <button onClick={() => handleRemoveRow(medicineRows.length - 1)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded shadow">REMOVE MEDICINE DETAILS</button>
      </div>

      {/* Generate Bill */}
      <button onClick={generatePDF} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow no-print">
        Generate Bill
      </button>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
    </div>
  );
};

export default Bill;


