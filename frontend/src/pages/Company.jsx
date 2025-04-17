import React from 'react';

const Company = () => {
  const companies = [
    {
      name: 'ABC Pharma',
      license_no: 'LIC123',
      gst_no: 'GST456',
      contact_no: '9876543210',
      Address : '123 Pharma St, City, State',
      Description :'Leading supplier of pharmaceuticals',
    },
    
    
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Pharma Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Companies</h2>

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Inputs with visible border */}
        <input
          type="text"
          placeholder="Company Name"
          className="border border-gray-400 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="License No"
          className="border border-gray-400 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="GST No"
          className="border border-gray-400 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Contact No"
          className="border border-gray-400 rounded px-3 py-2 w-full"
        />
        <textarea
          placeholder="Address"
          className="border border-gray-400 rounded px-3 py-2 w-full h-20 md:col-span-1"
        />
        <textarea
          placeholder="Description"
          className="border border-gray-400 rounded px-3 py-2 w-full h-20 md:col-span-1"
        />

        {/* Centered Add Button */}
        <div className="md:col-span-2 flex justify-center mt-2">
          <button
            type="submit"
            className="w-[20%] bg-green-600 text-white cursor-pointer font-bold py-2 px-3 rounded hover:bg-green-700"
          >
            Add Company
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="p-3">Name</th>
              <th className="p-3">License</th>
              <th className="p-3">GST</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Address</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{company.name}</td>
                <td className="p-3">{company.license_no}</td>
                <td className="p-3">{company.gst_no}</td>
                <td className="p-3">{company.contact_no}</td>
                <td className="p-3">{company.Address}</td>
                <td className="p-3">{company.Description}</td>
                <td className="p-3 space-x-2">
                  <button className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Company;

