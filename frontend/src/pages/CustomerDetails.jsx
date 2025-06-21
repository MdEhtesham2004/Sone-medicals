import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useParams } from 'react-router-dom'


export default function CreditDetailPage() {
  const [medicines, setMedicines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [medicineInput, setMedicineInput] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [creditCustomer, setcreditCustomer] = useState([])

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [editPaymentIndex, setEditPaymentIndex] = useState(null);

  const [allMedicineNames, setAllMedicineNames] = useState('');
  const [medicinesDB, setMedicinesDB] = useState([]);

  // Auto-suggestion states
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const textareaRef = useRef(null);


  const { id } = useParams()

  const todayDate = new Date().toISOString().split('T')[0];

  const fetchData = () => {
    api.get(`/api/medical/CustomerCredit/${id}/`)
      .then((res) => {
        setcreditCustomer(res.data)
        // console.log(res.data.data)
      })
      .catch((err) => console.error("Failed to fetch customer", err));
  }


useEffect(() => {
  api.get(`/api/medical/CustomerCredit/${id}/`)
    .then((res) => {
      setcreditCustomer(res.data)
      console.log(res.data.data)
    }
    )
    .catch((err) => console.error("Failed to fetch customer", err));
}, [id]);

useEffect(() => {
  api.get('/api/medical/medicine/')
    .then((res) => res.data)
    .then((data) => {
      setMedicinesDB(data.data);
      const names = data.data.map(med => med.name).join(', ');
      setAllMedicineNames(names);
    })
    .catch((err) => {
      console.error("Error fetching medicines:", err);
    });
}, []);

const totalAmount = medicines.reduce((acc, item) => acc + Number(item.amount), 0);
const totalPaid = payments.reduce((acc, item) => acc + Number(item.amount), 0);
const pending = totalAmount - totalPaid;

// Function to get current word being typed
const getCurrentWord = (text, position) => {
  const beforeCursor = text.substring(0, position);
  const afterCursor = text.substring(position);

  const lastComma = beforeCursor.lastIndexOf(',');
  const nextComma = afterCursor.indexOf(',');

  const start = lastComma === -1 ? 0 : lastComma + 1;
  const end = nextComma === -1 ? text.length : position + nextComma;

  const word = text.substring(start, end).trim();
  return { word, start, end };
};

const handleMedicineInputChange = (e) => {
  const value = e.target.value;
  const position = e.target.selectionStart;

  setMedicineInput(value);
  setCursorPosition(position);

  const { word } = getCurrentWord(value, position);
  setCurrentWord(word);

  if (word.length > 0) {
    const matches = medicinesDB.filter(med =>
      med.name.toLowerCase().includes(word.toLowerCase())
    );
    setFilteredOptions(matches);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  } else {
    setShowDropdown(false);
    setFilteredOptions([]);
  }
};

const handleKeyDown = (e) => {
  if (!showDropdown) return;

  const maxIndex = filteredOptions.length - 1;

  if (e.key === "ArrowDown") {
    setHighlightedIndex(prev => prev < maxIndex ? prev + 1 : 0);
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    setHighlightedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    e.preventDefault();
  } else if (e.key === "Enter" && highlightedIndex >= 0) {
    selectMedicine(filteredOptions[highlightedIndex]);
    e.preventDefault();
  } else if (e.key === "Escape") {
    setShowDropdown(false);
  }
};

const selectMedicine = (selectedMed) => {
  const { word, start, end } = getCurrentWord(medicineInput, cursorPosition);

  const beforeWord = medicineInput.substring(0, start);
  const afterWord = medicineInput.substring(end);

  const newText = beforeWord + selectedMed.name + afterWord;
  setMedicineInput(newText);

  setShowDropdown(false);
  setFilteredOptions([]);

  // Focus back to textarea
  setTimeout(() => {
    if (textareaRef.current) {
      const newPosition = start + selectedMed.name.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  }, 0);
};

const handleBlur = () => {
  // Delay hiding dropdown to allow clicks
  setTimeout(() => {
    setShowDropdown(false);
  }, 150);
};

const handleFocus = () => {
  if (currentWord.length > 0 && filteredOptions.length > 0) {
    setShowDropdown(true);
  }
};

// Quick add all medicines function
const addAllMedicines = () => {
  setMedicineInput(allMedicineNames);
};

// Function to add selected medicines from suggestions
const addSelectedMedicines = () => {
  const selectedMeds = filteredOptions.slice(0, 5).map(med => med.name).join(', ');
  if (medicineInput) {
    setMedicineInput(medicineInput + ', ' + selectedMeds);
  } else {
    setMedicineInput(selectedMeds);
  }
};

const addOrUpdateMedicine = () => {
  const newEntry = {
    customer_credit: customer.id,
    date: todayDate,
    medicines: medicineInput,
    amount,
  };
  if (editIndex !== null) {
    const updated = [...medicines];
    updated[editIndex] = newEntry;
    setMedicines(updated);
    setEditIndex(null);
  } else {
    api.post("api/medical/CustomerCreditDetails/", newEntry)
    console.log("added")
    fetchData();
    setMedicines([...medicines, newEntry]);
    // console.log(setMedicines.length, medicines.length);
  }
  setMedicineInput("");
  setAmount("");
  setDate("");
};

const deleteMedicine = (index) => {
  const updated = [...medicines];
  updated.splice(index, 1);
  setMedicines(updated);
};

const editMedicine = (index) => {
  const item = medicines[index];
  setMedicineInput(item.medicines);
  setAmount(item.amount);
  setDate(item.date);
  setEditIndex(index);
};

const addOrUpdatePayment = () => {
  const newEntry = {
    customer_credit: customer.id,
    payment_date: todayDate,
    payment_amount: paymentAmount,
    payment_mode: paymentMode,
  };
  if (editPaymentIndex !== null) {
    const updated = [...payments];
    updated[editPaymentIndex] = newEntry;
    setPayments(updated);
    setEditPaymentIndex(null);
  } else {
    api.post("/api/medical/CustomerCreditPayment/", newEntry)
    console.log("added payment")
    fetchData();
    setPayments([...payments, newEntry]);

  }
  setPaymentAmount("");
  setPaymentDate("");
  setPaymentMode("Cash");
};

const deletePayment = (index) => {
  const updated = [...payments];
  updated.splice(index, 1);
  setPayments(updated);
};

const editPayment = (index) => {
  const item = payments[index];
  setPaymentAmount(item.amount);
  setPaymentDate(item.date);
  setPaymentMode(item.mode);
  setEditPaymentIndex(index);
};

// destructuring objects 
const customer = creditCustomer?.data?.customer || {};
const medicinesData = creditCustomer?.data?.customer_details || [];
const paymentData = creditCustomer?.data?.customer_payment_details || [];

return (
  <>
    <div className="p-4 bg-grey-600 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Details</h2>
      <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
        <p><span className="font-medium text-gray-600">Account ID:</span> {customer.id}</p>
        {/* {console.log("Account id clg",creditCustomer)} */}
        <p><span className="font-medium text-gray-600">Name:</span> {customer.name}</p>
        <p><span className="font-medium text-gray-600">Phone:</span> {customer.contact}</p>
        <p><span className="font-medium text-gray-600">Last Payment:</span> ₹{customer.last_payment_amount}</p>
        <p><span className="font-medium text-gray-600">Last Payment Date:</span> {customer.last_payment_date}</p>
      </div>
    </div>


    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Add Medicines</h2>
          <input
            type="date"
            value={todayDate}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 mb-2 w-full"
          />

          {/* Enhanced Medicine Input with Auto-suggestion */}
          <div className="relative mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine Names (Comma Separated):
            </label>
            <textarea
              ref={textareaRef}
              value={medicineInput}
              onChange={handleMedicineInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleFocus}
              placeholder="Start typing medicine names... (separate with commas)"
              className="border p-2 w-full h-24 resize-none"
              rows={3}
            />

            {/* Auto-suggestion Dropdown */}
            {showDropdown && filteredOptions.length > 0 && (
              <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-40 overflow-auto">
                <div className="px-2 py-1 bg-gray-100 text-xs text-gray-600 font-medium">
                  Suggestions for "{currentWord}":
                </div>
                {filteredOptions.slice(0, 8).map((option, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectMedicine(option)}
                    className={`px-2 py-1 cursor-pointer hover:bg-blue-100 text-sm border-b border-gray-100 ${highlightedIndex === i ? "bg-blue-200" : ""
                      }`}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-gray-500">
                      Batch: {option.batch_no} | MRP: ₹{option.mrp}
                    </div>
                  </div>
                ))}
                {filteredOptions.length > 8 && (
                  <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50">
                    ... and {filteredOptions.length - 8} more matches
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Buttons
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={addAllMedicines}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              Add All Medicines
            </button>
            {filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={addSelectedMedicines}
                className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
              >
                Add Top 5 Matches
              </button>
            )}
          </div> */}

          {/* All Medicines Reference */}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              All Available Medicines:
            </label>
            <textarea
              value={allMedicineNames}
              readOnly
              rows={3}
              className="w-full border border-gray-300 p-2 rounded text-sm bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this to quickly reference available medicines.
            </p>
          </div> */}

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={addOrUpdateMedicine}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editIndex !== null ? "Update Medicine" : "Add Medicine"}
          </button>
        </div>

        <div className="p-4 border rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Add Payment</h2>
          <input
            type="date"
            value={todayDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 mb-2 w-full"
          />
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
          <button
            onClick={addOrUpdatePayment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editPaymentIndex !== null ? "Update Payment" : "Add Payment"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-2">Medicine Entries</h3>
          <table className="w-full table-auto border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-2 py-1">Date</th>
                <th className="border border-gray-400 px-2 py-1">Medicines</th>
                <th className="border border-gray-400 px-2 py-1">Amount</th>
                <th className="border border-gray-400 px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicinesData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{item.date}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.medicines}</td>
                  <td className="border border-gray-300 px-2 py-1">₹{item.amount}</td>
                  <td className="border border-gray-300 px-2 py-1 space-x-2">
                    <button
                      onClick={() => editMedicine(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMedicine(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Payment Entries</h3>
          <table className="w-full table-auto border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-2 py-1">Date</th>
                <th className="border border-gray-400 px-2 py-1">Amount</th>
                <th className="border border-gray-400 px-2 py-1">Mode</th>
                <th className="border border-gray-400 px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{item.payment_date}</td>
                  <td className="border border-gray-300 px-2 py-1">₹{item.payment_amount}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.payment_mode}</td>
                  <td className="border border-gray-300 px-2 py-1 space-x-2">
                    <button
                      onClick={() => editPayment(index)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePayment(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Summary</h3>
          <p>Total Amount: ₹{totalAmount}</p>
          <p>Total Paid: ₹{totalPaid}</p>
          <p className="font-semibold text-red-600">Pending: ₹{pending}</p>
        </div>
      </div>
    </div>
  </>
);
}

