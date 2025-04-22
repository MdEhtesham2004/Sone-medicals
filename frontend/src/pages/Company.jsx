import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    license_no: '',
    address: '',
    contact_no: '',
    description: '',
    gst_no: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      license_no: '',
      address: '',
      contact_no: '',
      description: '',
      gst_no: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await api.put(`/api/medical/company/${editId}/`, formData);
        setCompanies(prev => prev.map(company => company.id === editId ? res.data : company));
        setEditId(null);
        toast.success("Company updated successfully!");
      } else {
        const res = await api.post('/api/medical/company/', formData);
        setCompanies(prev => [...prev, res.data]);
        toast.success("Company added successfully!");
      }
      resetForm();
      fetchCompanies();
    } catch (err) {
      console.error('Error saving company:', err);
      toast.error("Error saving company. Please try again.");
    }
  };

  const fetchCompanies = () => {
    api.get('/api/medical/company/')
      .then(res => setCompanies(res.data.data))
      .catch(err => {
        console.error("Error fetching companies:", err);
        toast.error("Failed to fetch companies.");
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (company) => {
    setFormData(company);
    setEditId(company.id);
  };

  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this company?");
  //   if (!confirmDelete) return;

  //   try {
  //     await api.delete(`/api/medical/company/${id}/`);
  //     setCompanies(prev => prev.filter(company => company.id !== id));
  //     toast.success("Company deleted successfully!");
  //   } catch (err) {
  //     console.error("Error deleting company:", err);
  //     toast.error("Failed to delete company.");
  //   }
  // };
  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this company?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await api.delete(`/api/medical/company/${id}/`);
            setCompanies(prev => prev.filter(c => c.id !== id));
            toast.success("Company deleted!");
          }
        },
        {
          label: 'No',
          onClick: () => { }

        }
      ]
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Agencies Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Agencies :-</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" name="name" placeholder="Agency Name" value={formData.name} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full" required />
        <input type="text" name="license_no" placeholder="License No" value={formData.license_no} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full" required />
        <input type="text" name="gst_no" placeholder="GST No" value={formData.gst_no} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full" required />
        <input type="text" name="contact_no" placeholder="Contact No" value={formData.contact_no} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full" required />
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full h-20" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border border-gray-400 rounded px-3 py-2 w-full h-20" />
        <div className="md:col-span-2 flex justify-center mt-2">
          <button type="submit" className="w-[20%] bg-green-600 text-white font-bold py-2 px-3 rounded hover:bg-green-700">
            {editId ? 'Update Agency' : 'Add Agency '}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {companies.map((company, idx) => (
          <div key={idx} className="overflow-x-auto border rounded shadow-md p-4 bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">License</th>
                  <th className="p-3">GST</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">{company.id}</td>
                  <td className="p-3">{company.name}</td>
                  <td className="p-3">{company.license_no}</td>
                  <td className="p-3">{company.gst_no}</td>
                  <td className="p-3">{company.contact_no}</td>
                  <td className="p-3">{company.address}</td>
                  <td className="p-3 space-x-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded" onClick={() => handleEdit(company)}>Edit</button>
                    {editId === company.id && (
                      <button onClick={() => { setEditId(null); resetForm(); }} className="bg-gray-500 text-white font-bold py-1 px-3 rounded hover:bg-gray-600">
                        Cancel
                      </button>
                    )}
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded" onClick={() => handleDelete(company.id)} disabled={editId === company.id}>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
    </div>
  );
};

export default Company;
