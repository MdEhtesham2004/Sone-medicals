import React, { useEffect, useState } from 'react'
import api from '../api.js'

function Medicines() {

  const [options, setOptions] = useState([])
  const [medicines, Setmedicines] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    schedule_type: '',
    mrp: '',
    rate: '',
    pack: '',
    c_gst: '',
    s_gst: '',
    batch_no: '',
    exp_date: '',
    mfg_date: '',
    company: '',
    in_stock_total: '',
    qty_in_strip: '',
    added_on: '',
  })


  const handleSubmit = (e) => {
    e.preventDefault();

    const companyId = formData.company;

    api.post(`/api/makemedicinedetailsviacompany/${companyId}/`, formData)
      .then((res) => {
        console.log("Medicine added:", res.data);
      
      })
      .catch((err) => {
        console.error("Error adding medicine:", err);
      });

      // setFormData({
      //   name: '',
      //   schedule_type: '',
      //   mrp: '',
      //   rate: '',
      //   pack: '',
      //   c_gst: '',
      //   s_gst: '',
      //   batch_no: '',
      //   exp_date: '',
      //   mfg_date: '',
      //   company: '',
      //   in_stock_total: '',
      //   qty_in_strip: '',
      // });


      console.log(formData)


  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    api.get('/api/medical/medicine/')
    .then((res) => (res.data))
    .then((data) => {
      Setmedicines(data.data)
      console.log(data.data)
    })
    .catch((err) => {
      console.error("Error fetching medicines:", err);
    })
  },[])



  useEffect(() => {
    api.get('/api/medical/company/')
      .then((res) => (res.data))
      .then((data) => {
        setOptions(data.data)
        console.log(data.data)
      })
      .catch((err) => {
        console.error("Error fetching options in Medicines:", err);
      })
  }, [])


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
        <input
          type='text'
          name='schedule_type'
          placeholder='Enter Schedule Type '
          value={formData.schedule_type}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
        />
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
          type='Number'
          name='pack'
          placeholder='Enter Pack'
          value={formData.pack}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='text'
          name='c_gst'
          placeholder='Enter C_GST'
          value={formData.c_gst}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"

        />
        <input
          type='text'
          name='s_gst'
          placeholder='Enter S_GST'
          value={formData.s_gst}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"

        />
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
          type='text'
          name='exp_date'
          placeholder='Enter Exp Date'
          value={formData.exp_date}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='text'
          name='mfg_date'
          placeholder='Enter Mfg Date'
          value={formData.mfg_date}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <select
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="">-- Select an option --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>

        <input
          type='Number'
          name='in_stock_total'
          placeholder='Enter In Stock Total'
          value={formData.in_stock_total}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <input
          type='text'
          name='qty_in_strip'
          placeholder='Enter Qty In Strip'
          value={formData.qty_in_strip}
          onChange={handleChange}
          className="border border-gray-400 rounded px-3 py-2 w-full"
          required
        />
        <br />
        <div className="md:col-span-2 flex justify-center mt-2">
          <button type='submit' className="flex items-center justify-center bg-green-600 text-white font-bold py-2 px-3 
         shadow-lg cursor-pointer transition-all duration-200 rounded hover:bg-green-700">
            Add Medicine
          </button>
        </div>

      </form >


      {/* <div>
        <table className='overflow-x-auto border rounded shadow-md p-4 bg-white w-full'>
          <thead className='bg-gray-100 text-gray-800'>
            <tr>
              <td>name</td>
              <td>mfg_date</td> 
              <td>exp_date</td>
              <td>batch_no</td>
              <td>schedule_type</td>
              <td>mrp</td>
              <td>rate</td>
              <td>pack</td>
              <td>c_gst</td>
              <td>s_gst</td>
              <td>company</td>
              <td>in_stock_total</td>
              <td>qty_in_strip</td>
              <td>added_on</td>
              <td>Actions</td>  

            </tr>

          </thead>

          <tbody>
            {medicines.map((med) => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.mfg_date}</td>
                <td>{med.exp_date}</td>
                <td>{med.batch_no}</td>
                <td>{med.schedule_type}</td>
                <td>{med.mrp}</td>
                <td>{med.rate}</td>
                <td>{med.pack}</td>
                <td>{med.c_gst}</td>
                <td>{med.s_gst}</td>
                <td>{med.company}</td>
                <td>{med.in_stock_total}</td>
                <td>{med.qty_in_strip}</td>
                <td>{med.added_on}</td>
                <td>
                  <button onClick={() => handleEdit(med.id)}>Edit</button>
                  <button onClick={() => handleDelete(med.id)}>Delete</button>
                </td> 
              </tr>
            ))}
            </tbody>
        </table>
      </div> */}

<div className="overflow-x-auto border rounded shadow-md p-4 bg-white">
  <table className="w-full text-left border-collapse">
    <thead className="bg-gray-100 text-gray-800">
      <tr>
        <th className="p-3">Name</th>
        <th className="p-3">MFG Date</th>
        <th className="p-3">EXP Date</th>
        <th className="p-3">Batch No</th>
        <th className="p-3">Schedule Type</th>
        <th className="p-3">MRP</th>
        <th className="p-3">Rate</th>
        <th className="p-3">Pack</th>
        <th className="p-3">C_GST</th>
        <th className="p-3">S_GST</th>
        <th className="p-3">Company</th>
        <th className="p-3">In Stock Total</th>
        <th className="p-3">Qty In Strip</th>
        <th className="p-3">Added On</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {medicines.map((med, idx) => (
        <tr key={idx} className="border-t hover:bg-gray-50">
          <td className="p-3">{med.name}</td>
          <td className="p-3">{med.mfg_date}</td>
          <td className="p-3">{med.exp_date}</td>
          <td className="p-3">{med.batch_no}</td>
          <td className="p-3">{med.schedule_type}</td>
          <td className="p-3">{med.mrp}</td>
          <td className="p-3">{med.rate}</td>
          <td className="p-3">{med.pack}</td>
          <td className="p-3">{med.c_gst}</td>
          <td className="p-3">{med.s_gst}</td>
          <td className="p-3">{med.company}</td>
          <td className="p-3">{med.in_stock_total}</td>
          <td className="p-3">{med.qty_in_strip}</td>
          <td className="p-3">{med.added_on}</td>
          <td className="p-3 space-x-2">
            <button
              onClick={() => handleEdit(med.id)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(med.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div >
  )
}

export default Medicines