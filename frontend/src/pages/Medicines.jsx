import React, { useEffect, useState } from 'react'
import api from '../api.js'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Select from 'react-select';



function Medicines() {

  const [options, setOptions] = useState([])
  const [medicines, Setmedicines] = useState([])
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    // schedule_type: '',
    mrp: '',
    rate: '',
    pack: '',
    // c_gst: '',
    // s_gst: '',
    gst: '',
    // amt_aftr_gst:'',
    batch_no: '',
    exp_date: '',
    mfg_date: '',
    company: '',
    // in_stock_total: '',
    qty_in_strip: '',
    added_on: '',
  })

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      if (editId) {
        const res = await api.put(`/api/medical/medicine/${editId}/`, formData)
        Setmedicines(prev => prev.map((med) => med.id === editId ? res.data : med));
        setEditId(null);
        toast.success("Medicine updated successfully!");

      } else {

        const companyId = formData.company;

        const res = await api.post(`/api/makemedicinedetailsviacompany/${companyId}/`, formData)
        Setmedicines(prev => [...prev, res.data]);
        // console.log(formData)
        toast.success("Medicine added successfully!");
      }
      resetForm();
      fetchMedicines();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to add medicine. Please try again.");
    }
  }

  const handleEdit = (med) => {
    setFormData({
      name: med.name || '',
      // schedule_type: med.schedule_type || '',
      mrp: med.mrp || '',
      rate: med.rate || '',
      pack: med.pack || '',
      // c_gst: med.c_gst || '',
      // s_gst: med.s_gst || '',
      gst: med.gst || '',
      batch_no: med.batch_no || '',
      exp_date: med.exp_date || '',
      mfg_date: med.mfg_date || '',
      company: med.company_details?.id || 'N/A',
      in_stock_total: med.in_stock_total || '',
      qty_in_strip: med.qty_in_strip || '',
      added_on: med.added_on || '',
    });
    setEditId(med.id);
    // fetchMedicines()
  };


  const resetForm = () => {
    setFormData({
      name: '',
      // schedule_type: '',
      mrp: '',
      rate: '',
      pack: '',
      // c_gst: '',
      // s_gst: '',
      gst: '',
      // amt_aftr_gst:'',
      batch_no: '',
      exp_date: '',
      mfg_date: '',
      company: '',
      // in_stock_total: '',
      qty_in_strip: '',
    });
  }

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/api/medical/medicine/');
      Setmedicines(response.data.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Failed to fetch medicines. Please try again.");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  //Function to list Medicines Details
  useEffect(() => {
    api.get('/api/medical/medicine/')
      .then((res) => (res.data))
      .then((data) => {
        Setmedicines(data.data)
        // console.log(data.data)
      })
      .catch((err) => {
        console.error("Error fetching medicines:", err);
      })
  }, [])



  //function to list Agencies in Options 

  useEffect(() => {
    api.get('/api/medical/company/')
      .then((res) => (res.data))
      .then((data) => {
        setOptions(data.data)
        // console.log(data.data)
      })
      .catch((err) => {
        console.error("Error fetching options in Medicines:", err);
        toast.error("Failed to fetch Agencies options.");
      })
  }, [])

  const handleDelete = (id) => {
    const med = medicines.find(m => m.id === id);
    confirmAlert(
      {
        title: 'Confirm to Delete',
        message: `Are you sure you want to  delete this medicine ${med?.name} ?`,
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              await api.delete(`/api/medical/medicine/${id}/`);
              Setmedicines(prev => prev.filter(med => med.id !== id))
              toast.success(`Medicine ${med?.name} deleted!`);
            },
          },
          {
            label: 'No',
            onClick: () => toast.info('Delete cancelled!')
          }

        ]
      });
  }




  return (
    <div className='p-8'>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Medicines Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Medicines :-</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type='text'
          name='name'
          placeholder='Enter Medicine Name'
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        {/* <select
          name='schedule_type'
          value={formData.schedule_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">-- Select Schedule Type --</option>
          <option value="yes">YES</option>
          <option value="no">NO</option>

        </select> */}
        <input
          type='Number'
          name='mrp'
          placeholder='Enter MRP'
          step="any"
          value={formData.mrp}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='Number'
          name='rate'
          placeholder='Enter Rate'
          value={formData.rate}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"

        />
        <input
          type='text'
          name='pack'
          placeholder='Enter Pack'
          value={formData.pack}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        {/* <input
          type='Number'
          name='c_gst'
          placeholder='Enter C_GST'
          value={formData.c_gst}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"

        />
        <input
          type='Number'
          name='s_gst'
          placeholder='Enter S_GST'
          value={formData.s_gst}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"

        /> */}
        <input
          type="Number"
          name='gst'
          placeholder='Enter GST '
          value={formData.gst}
          onChange={handleChange}
          className='border border-gray-400 rounded px-3 py-2 w-full'
        />
        {/* <input
         type="Number"
        name='amt_aftr_gst'
        placeholder='Enter amt_aftr_gst '
        value={formData.amt_aftr_gst}
        onChange={handleChange}
        className='border border-gray-400 rounded px-3 py-2 w-full'
        /> */}
        <input
          type='text'
          name='batch_no'
          placeholder='Enter Batch No'
          value={formData.batch_no}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='date'
          name='mfg_date'
          placeholder='Enter Mfg Date'
          value={formData.mfg_date}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='date'
          name='exp_date'
          placeholder='Enter Exp Date'
          value={formData.exp_date}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        {/* <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="">-- Select The Agency Source --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>*/}
        <Select
          options={options.map((opt) => ({ value: opt.id, label: opt.name }))}
          value={options
            .map((opt) => ({ value: opt.id, label: opt.name }))
            .find((option) => option.value === formData.company) || null}
          onChange={(selectedOption) =>
            setFormData((prev) => ({ ...prev, company: selectedOption?.value || '' }))
          }
          isClearable
          isSearchable
          placeholder="-- Select or Search Agency Source --"
          className="w-full"
        // type="text"
        />

        {/* <input
          type='Number'
          name='in_stock_total'
          placeholder='Enter In Stock Total'
          value={formData.in_stock_total}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        /> */}
        <input
          type='text'
          name='qty_in_strip'
          placeholder='Enter Qty '
          value={formData.qty_in_strip}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <br />
        <div className="md:col-span-2 flex justify-center mt-2">
          <button type='submit' className="flex items-center justify-center bg-green-600 text-white font-bold py-2 px-3 
         shadow-lg cursor-pointer transition-all duration-200 rounded hover:bg-green-700">
            {editId ? 'Update Medicine' : 'Add Medicine '}
          </button>
        </div>

      </form >

      <div className="overflow-x-auto border rounded shadow-md p-4 bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">MFG Date</th>
              <th className="p-3">EXP Date</th>
              <th className="p-3">Batch No</th>
              {/* <th className="p-3">SCH</th> */}
              <th className="p-3">MRP</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Pack</th>
              {/* <th className="p-3">C_GST</th> */}
              {/* <th className="p-3">S_GST</th> */}
              <th className="p-3">Agency</th>
              {/* <th className="p-3">In Stock Total</th> */}
              <th className="p-3">Qty In Strip</th>
              {/* <th className="p-3">Added On</th> */}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.filter(Boolean).map((med, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{med.name}</td>
                <td className="p-3">{med.mfg_date}</td>
                <td className="p-3">{med.exp_date}</td>
                <td className="p-3">{med.batch_no}</td>
                {/* <td className="p-3">{med.schedule_type}</td> */}
                <td className="p-3">{med.mrp}</td>
                <td className="p-3">{med.rate}</td>
                <td className="p-3">{med.pack}</td>
                {/* <td className="p-3">{med.c_gst}</td> */}
                {/* <td className="p-3">{med.s_gst}</td> */}
                <td className="p-3">{med.company_details?.name || 'N/A'}</td>
                {/* <td className="p-3">{med.in_stock_total}</td> */}
                <td className="p-3">{med.qty_in_strip}</td>
                {/* <td className="p-3">{med.added_on}</td> */}
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(med)}
                    className="bg-yellow-400 hover:bg-yellow-500
                    cursor-pointer text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  {editId === med.id && (
                    <button
                      onClick={() => { setEditId(null); resetForm(); }}
                      className="bg-gray-500 text-white cursor-pointer font-bold py-1 px-3 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(med.id)}
                    className="bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
       pauseOnHover theme="colored" />

    </div >
  )
}

export default Medicines