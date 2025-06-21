import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

function Shortage() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await api.get("/api/medical/medicine/");
        const allMeds = res.data?.data || [];
        console.log(res.data.data);
        const lowStockMeds = allMeds.filter((med) => med.qty_in_strip <= 10);
        setMedicines(lowStockMeds);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      }
    }

    fetchLowStock();
  }, []);

  const handleRemoveFromShortage = (id) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
    toast.success("Medicine removed from shortage list");
  };

  const handleExpirySubmit = () => {
    api.get("/api/medical/ExpiredMedicineStockAlertViewSet")
    .then((res)=>(res.data))
    .then((data) => {
      console.log(data);
      toast.success("Expiry generated successfully");
    })
    console.log("Expiry generated")
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border-b">
        <h1 className="text-4xl font-bold mb-6 text-center">Shortage Book</h1>

        {medicines.length === 0 ? (
          <div className="text-3xl w-full h-screen flex items-center justify-center">
            No medicines Found with low stock
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Medicine Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Agency Source</th>
                <th className="border border-gray-300 px-4 py-2">Quantity Left</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, index) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.company_details.name || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{med.qty_in_strip}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveFromShortage(med.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Mark as Ordered
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}



        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>

      <br />

      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-6 border-b">
        {/* <div className="p-6 border-b"> */}
        <h3 className="text-2xl m-4 font-semibold text-gray-800 text-center ">Expiry Records</h3>

        <button className="p-4 text-lg bg-blue-400 rounded-xl 
        shadow-lg hover:shadow-blue-300 cursor-pointer border-red-800 border-2 
         text-center"
         onClick={handleExpirySubmit}
         >Generate Expiry </button>

        {/* </div> */}
      </div>
    </>
  );
}

export default Shortage;
