import { useState, useEffect, useRef, useMemo } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


export default function CreditDetailPage() {
  const [creditCustomer, setCreditCustomer] = useState([]);
  const [medicineInput, setMedicineInput] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editingMedicine, setEditingMedicine] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [editPaymentIndex, setEditPaymentIndex] = useState(null);

  const [medicinesDB, setMedicinesDB] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState("");

  const [selectMode, setSelectMode] = useState(false);
  const [selectedMedicineIds, setSelectedMedicineIds] = useState([]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false)



  const textareaRef = useRef(null);
  const { id } = useParams();
  const todayDate = new Date().toISOString().split("T")[0];

  const fetchData = () => {
    api.get(`/api/medical/CustomerCredit/${id}/`)
      .then((res) => setCreditCustomer(res.data))
      .catch((err) => console.error("Failed to fetch customer", err));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    api.get("/api/medical/medicine/")
      .then((res) => setMedicinesDB(res.data.data))
      .catch((err) => console.error("Error fetching medicines:", err));
  }, []);

  const customer = creditCustomer?.data?.customer || {};
  const medicinesData = creditCustomer?.data?.customer_details || [];
  const paymentData = creditCustomer?.data?.customer_payment_details || [];

  const totalAmount = useMemo(() => {
    return medicinesData.reduce((acc, item) => acc + Number(item.amount), 0);
  }, [medicinesData]);

  const totalPaid = useMemo(() => {
    return paymentData.reduce((acc, item) => acc + Number(item.payment_amount), 0);
  }, [paymentData]);

  const pending = useMemo(() => totalAmount - totalPaid, [totalAmount, totalPaid]);

  const getCurrentWord = (text, position) => {
    const beforeCursor = text.substring(0, position);
    const afterCursor = text.substring(position);
    const lastComma = beforeCursor.lastIndexOf(",");
    const nextComma = afterCursor.indexOf(",");
    const start = lastComma === -1 ? 0 : lastComma + 1;
    const end = nextComma === -1 ? text.length : position + nextComma;
    return { word: text.substring(start, end).trim(), start, end };
  };

  const handleMedicineInputChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setMedicineInput(value);
    setCursorPosition(position);

    const { word } = getCurrentWord(value, position);
    setCurrentWord(word);

    if (word.length > 0) {
      const matches = medicinesDB.filter((med) =>
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
      setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
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

    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + selectedMed.name.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  const handleFocus = () => {
    if (currentWord.length > 0 && filteredOptions.length > 0) {
      setShowDropdown(true);
    }
  };

  const addOrUpdateMedicine = () => {
    if (!medicineInput.trim()) {
      toast.error("Please enter medicine names.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    const newEntry = {
      customer_credit: customer.id,
      date: todayDate,
      medicines: medicineInput,
      amount,
    };

    if (editingMedicine) {
      api.put(`/api/medical/CustomerCreditDetails/${editingMedicine.id}/`, newEntry)
        .then(() => {
          fetchData();
          setEditingMedicine(null);
          toast.success("Medicine updated successfully.");
        })
        .catch((err) => {
          console.error("Error updating medicine:", err)
          toast.error("Unable to update medicine.");
        })
    } else {
      api.post("api/medical/CustomerCreditDetails/", newEntry)
        .then(() => {
          fetchData();
          toast.success("Medicine added successfully.");

        })
        .catch((err) => {
          console.error("Error adding medicine in credit section account:", err);
          toast.error("Unable to add medicine.");
        })

    }

    setMedicineInput("");
    setAmount("");
    setDate("");
  };


  const deleteMedicine = (item) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete medicine entry on ${item.date}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/api/medical/CustomerCreditDetails/${item.id}/`);
              toast.success("Medicine deleted successfully.");
              fetchData();
            } catch (error) {
              toast.error("Failed to delete medicine.");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };


  const editMedicine = (item) => {
    setMedicineInput(item.medicines);
    setAmount(item.amount);
    setDate(item.date || todayDate);
    setEditingMedicine(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addOrUpdatePayment = () => {
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    const newEntry = {
      customer_credit: customer.id,
      payment_date: todayDate,
      payment_amount: Number(paymentAmount),
      payment_mode: paymentMode,
    };

    if (editPaymentIndex !== null) {
      api.put(`/api/medical/CustomerCreditPayment/${editPaymentIndex}/`, newEntry)
        .then(() => {
          fetchData();
          setEditPaymentIndex(null);
          toast.success("Payment updated successfully.");
        })
        .catch((err) => {
          console.error("Error updating payment:", err)
          toast.error("Unable to update payment.");
        })
    } else {
      api.post("/api/medical/CustomerCreditPayment/", newEntry)
        .then(() => {
          fetchData();
          toast.success("Payment added successfully.")
        })
        .catch((err) => {
          console.error("Error adding payment:", err)
          toast.error("Unable to add payment.");
        })
    }

    setPaymentAmount("");
    setPaymentDate("");
    setPaymentMode("Cash");
  };

  const deletePayment = (item) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete the payment of ₹${item.payment_amount} made on ${item.payment_date}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/api/medical/CustomerCreditPayment/${item.id}/`);
              toast.success("Payment deleted successfully.");
              fetchData();
            } catch (error) {
              console.error("Error deleting payment:", error.response?.data);
              toast.error("Failed to delete payment.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info('Deletion cancelled.')
        }
      ]
    });
  };

  const editPayment = (item) => {
    setPaymentAmount(item.payment_amount);
    setPaymentDate(item.payment_date || todayDate);
    setPaymentMode(item.payment_mode);
    setEditPaymentIndex(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSelectedMedicines = async () => {
    try {
      await Promise.all(
        selectedMedicineIds.map((id) =>
          api.delete(`/api/medical/CustomerCreditDetails/${id}/`)
        )
      );
      toast.success("Selected medicines deleted successfully.");
      setSelectedMedicineIds([]);
      setSelectMode(!selectMode);
      fetchData();
    } catch (err) {
      console.error("Failed to delete selected medicines:", err);
      toast.error("Failed to delete selected medicines.");
    }
  };

  const handleDeleteSelectedPayments = async () => {
    try {
      await Promise.all(
        selectedPaymentIds.map((id) =>
          api.delete(`/api/medical/CustomerCreditPayment/${id}/`)
        )
      );
      toast.success("Selected payments deleted successfully.");
      setSelectedPaymentIds([]);
      setSelectMode(!selectMode);
      fetchData();
    } catch (err) {
      console.error("Failed to delete selected payments:", err);
      toast.error("Failed to delete selected payments.");
    }
  };


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
              {editingMedicine !== null ? "Update Medicine" : "Add Medicine"}
            </button>
            {editingMedicine && (
              <button
                onClick={() => {
                  setEditingMedicine(null);
                  setMedicineInput("");
                  setAmount("");
                  setDate("");
                }}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

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
            {editPaymentIndex !== null && (
              <button
                onClick={() => {
                  setPaymentAmount("");
                  setPaymentDate("");
                  setPaymentMode("Cash");
                  setEditPaymentIndex(null);
                }}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        <div className="space-y-6">
          <div>
            <button
              onClick={() => {
                setSelectMode(!selectMode);
                setSelectedMedicineIds([]);
                setSelectedPaymentIds([]);
              }}
              className="mb-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {selectMode ? "Cancel Selection" : "Select Entries"}
            </button>
            {selectMode && (
              <button
                onClick={() => {
                  if (selectMode) {
                    setSelectAll(!selectAll);
                    if (!selectAll) {
                      setSelectedMedicineIds(medicinesData.map((item) => item.id));
                      setSelectedPaymentIds(paymentData.map((item) => item.id));
                    } else {
                      setSelectedMedicineIds([]);
                      setSelectedPaymentIds([]);
                    }
                  } else {
                    toast.info("Please enable selection mode to select all.");
                  }

                }}
                className="mb-2 ml-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"

              >
                Select All
              </button>
            )}
            {selectMode && (
              <button
                onClick={() => {
                  if (selectMode) {
                    confirmAlert({
                      title: 'Confirm Deletion',
                      message: 'Are you sure you want to delete all selected entries?',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: () => {
                            if (selectedMedicineIds.length > 0) {
                              handleDeleteSelectedMedicines();
                            }
                            if (selectedPaymentIds.length > 0) {
                              handleDeleteSelectedPayments();
                            }
                            if (
                              selectedMedicineIds.length === 0 &&
                              selectedPaymentIds.length === 0
                            ) {
                              toast.info("No items selected to delete.");
                            }
                          }
                        },
                        {
                          label: 'No',
                          onClick: () => toast.info('Deletion cancelled.')
                        }
                      ]
                    });
                  } else {
                    toast.info("Enable selection mode first.");
                  }
                }}
                className="mb-2 ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {`Delete All (${selectedMedicineIds.length + selectedPaymentIds.length})`}

              </button>
            )}



            <h3 className="text-lg font-bold mb-2">Medicine Entries</h3>
            <table className="w-full table-auto border border-gray-400">
              <thead>

                <tr className="bg-gray-200">
                  {selectMode && <th className="border border-gray-400 px-2 py-1">Select</th>}
                  <th className="border border-gray-400 px-2 py-1">Date</th>
                  <th className="border border-gray-400 px-2 py-1">Medicines</th>
                  <th className="border border-gray-400 px-2 py-1">Amount</th>
                  <th className="border border-gray-400 px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicinesData.map((item, index) => (
                  <tr key={index} className="group">
                    {selectMode && (
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedMedicineIds.includes(item.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedMedicineIds((prev) =>
                              checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)
                            );
                          }}
                        />
                      </td>)}
                    <td className="border border-gray-300 px-2 py-1">{item.date}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.medicines}</td>
                    <td className="border border-gray-300 px-2 py-1">₹{item.amount}</td>
                    <td className="border border-gray-300 px-2 py-1 space-x-2">
                      <button
                        onClick={() => editMedicine(item)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMedicine(item)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>


                  </tr>

                ))}

              </tbody>

            </table>
            {selectMode && selectedMedicineIds.length > 0 && (
              <button
                onClick={handleDeleteSelectedMedicines}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Selected Medicines ({selectedMedicineIds.length})
              </button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Payment Entries</h3>
            <table className="w-full table-auto border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  {selectMode && <th className="border border-gray-400 px-2 py-1">Select</th>}
                  <th className="border border-gray-400 px-2 py-1">Date</th>
                  <th className="border border-gray-400 px-2 py-1">Amount</th>
                  <th className="border border-gray-400 px-2 py-1">Mode</th>
                  <th className="border border-gray-400 px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>

                {paymentData.map((item, index) => (
                  <tr key={index}>
                    {selectMode && (
                      <td className="border border-gray-300 px-2 py-1">
                        <input type="checkbox"
                          checked={selectedPaymentIds.includes(item.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedPaymentIds((prev) =>
                              checked ? [...prev, item.id] :
                                prev.filter((id) => id !== item.id)
                            );
                          }}
                        />
                      </td >
                    )}
                    <td className="border border-gray-300 px-2 py-1">{item.payment_date}</td>
                    <td className="border border-gray-300 px-2 py-1">₹{item.payment_amount}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.payment_mode}</td>
                    <td className="border border-gray-300 px-2 py-1 space-x-2">
                      <button
                        onClick={() => editPayment(item)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit

                      </button>

                      <button
                        onClick={() => deletePayment(item)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectMode && selectedPaymentIds.length > 0 && (
              <button
                onClick={handleDeleteSelectedPayments}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Selected Payments ({selectedPaymentIds.length})
              </button>
            )}

          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            {/* <div className="bg-gray-100 p-4 rounded-lg sticky bottom-0 shadow-md z-10"> */}

            <h3 className="text-lg font-bold mb-2">Summary</h3>
            <p>Total Amount: ₹{totalAmount}</p>
            <p>Total Paid: ₹{totalPaid}</p>
            <p className="font-semibold text-red-600">Pending: ₹{pending}</p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000}
        hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable
        theme="colored" pauseOnHover />

    </>

  );
}
