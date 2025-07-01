import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import api from '../api';
import '../styles/index.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [medicinesDB, setMedicinesDB] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get('/api/medical/medicine/');
        setMedicinesDB(response.data.data || []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    api.get('/api/medical/company/')
      .then(res => setCompanies(res.data.data))
      .catch(err => {
        console.error("Error fetching companies:", err);
        toast.error("Failed to fetch companies.");
      });
  }, [])

  const performLocalSearch = (term) => {
    if (!term.trim()) {
      setSearchResult(null);
      return;
    }

    const found = medicinesDB.find(med =>
      med.name.toLowerCase().includes(term.toLowerCase()) ||
      med.batch_no?.toLowerCase().includes(term.toLowerCase())
    );

    if (found) {
      setSearchResult({
        name: found.name,
        quantity: found.qty_in_strip || 0,
        agency: found.company_details?.name || 'N/A',
        price: found.mrp || found.price || 0
      });
      setError('');
    } else {
      setSearchResult(null);
      setError('Medicine not found in database.');
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => performLocalSearch(term), 300),
    [medicinesDB]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    setShowDropdown(true);
    debouncedSearch(value);
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return medicinesDB.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batch_no?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8);
  }, [searchTerm, medicinesDB]);

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredOptions.length === 0) return;

    const maxIndex = filteredOptions.length - 1;

    if (e.key === "ArrowDown") {
      setHighlightedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
      e.preventDefault();
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      selectMedicine(filteredOptions[highlightedIndex]);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const selectMedicine = (medicine) => {
    setSearchTerm(medicine.name);
    setSearchResult({
      name: medicine.name,
      quantity: medicine.qty_in_strip || 0,
      agency: medicine.company_details?.name || 'N/A',
      price: medicine.mrp || medicine.price || 0
    });
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className='text-3xl w-full text-center mb-8 p-4 shadow-lg  bg-gray-200 shadow-amber-400
       hover:shadow-xl transition-shadow cursor-pointer'>
        Sonee Medical and General Store
      </h1>

      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to Medical Management Dashboard</h1>
        <p className="text-gray-500 mt-1">Check medicine availability and get a quick overview</p>

        <div className="mt-6 max-w-xl">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search medicine by name or batch code..."
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => filteredOptions.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />

            {showDropdown && filteredOptions.length > 0 && (
              <div className="absolute z-20 bg-white border rounded-lg shadow-lg mt-1 w-full max-h-64 overflow-auto">
                <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 font-medium border-b">
                  Suggestions ({filteredOptions.length} found):
                </div>
                {filteredOptions.map((option, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectMedicine(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 ${highlightedIndex === i ? "bg-blue-100" : ""
                      }`}
                  >
                    <div className="font-medium text-gray-800">{option.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="inline-block mr-3">Batch: {option.batch_no || 'N/A'}</span>
                      <span className="inline-block mr-3">Stock: {option.qty_in_strip || 0}</span>
                      <span className="inline-block">₹{option.mrp || option.price || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {searchResult && (
          <div className="mt-4 bg-white shadow-lg rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Search Result:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name:</p>
                <p className="font-semibold text-lg">{searchResult.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Quantity:</p>
                <p className={`font-semibold text-lg ${searchResult.quantity > 10 ? 'text-green-600' :
                  searchResult.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                  {searchResult.quantity} units
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agency:</p>
                <p className="font-semibold text-lg">{searchResult.agency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price:</p>
                <p className="font-semibold text-lg text-green-600">₹{searchResult.price}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <DashboardCard title="Total Agencies" value={companies.length} color="green" />
        <DashboardCard title="Total Medicines" value={medicinesDB.length} color="blue" />
        <DashboardCard title="Shortage Items" value='10' color="yellow" />
        <DashboardCard title="Pending Credits" value="₹5,200" color="purple" />
        <DashboardCard title="Total Bills" value="102" color="pink" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }) {
  return (
    <div className={`bg-${color}-100 p-4 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer`}>
      <h3 className={`text-lg font-semibold text-${color}-800`}>{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

