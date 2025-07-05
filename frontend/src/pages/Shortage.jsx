import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

function Shortage() {
  const [medicines, setMedicines] = useState([]);
  const [expiry, setExpiry] = useState([])
  const [excel, setExcel] = useState([]);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await api.get("/api/medical/LowStockAlert/");
        // const allMeds = res.data?.data || [];
        console.log(res.data.data);
        // const lowStockMeds = allMeds.filter((med) => med.qty_in_strip <= 10);
        // setMedicines(lowStockMeds);
        setMedicines(res.data.data)
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      }
    }

    fetchLowStock();
  }, []);

  const handleRemoveFromShortage = (id) => {
    api.delete(`/api/medical/LowStockAlert/${id}/`)
      .then((res) => {
        setMedicines((prev) => prev.filter((med) => med.id !== id));
        toast.success("Medicine removed from shortage list");
        console.log("Medicine removed from shortage list:", res.data);
      })
      .catch((error) => {
        console.error("Failed to remove medicine from shortage list:", error);
        toast.error("Failed to remove medicine from shortage list");
      });
  };

  const handleRemoveFromExpiry = (id) => {
    api.delete(`/api/medical/ExpiredMedicineStockAlertViewSet/${id}/`)
      .then((res) => {
        setExpiry((prev) => prev.filter((med) => med.id !== id));
        toast.success("Medicine removed from expiry list");
        console.log("Medicine removed from expiry list:", res.data);
      })
      .catch((error) => {
        console.error("Failed to remove medicine from expiry list:", error);
        toast.error("Failed to remove medicine from expiry list");
      });
  }

  const handleExpirySubmit = () => {
    api.get("/api/medical/ExpiredMedicineStockAlertViewSet/")
      .then((res) => (res.data.data))
      .then((data) => {
        setExpiry(data);
        console.log(data);
        toast.success("Expiry generated successfully");
      })
    console.log("Expiry generated")
  }

  const downloadExcel = () => {
  api.get("api/backup_download/", {
    responseType: 'blob',
  })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "backup.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Backup downloaded successfully");
    })
    .catch((error) => {
      console.error("Failed to download Excel file:", error);
      toast.error("Failed to download Excel file");
    });
};


  useEffect(() => {
    api.get("/api/medical/BackupToExcelAPIView")
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "backup.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExcel(response.data);
        toast.success("Excel file downloaded successfully");
        console.log("Excel file downloaded successfully")
      }
      )
      .catch((error) => {
        console.error("Failed to download Excel file:", error);
        toast.error("Failed to download Excel file");
      });
  }, []);


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
                  <td className="border border-gray-300 px-4 py-2">{med.medicine_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.company_details?.name || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{med.current_quantity}</td>
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
        <div className="text-center m-4">
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,"
                + medicines.map(med => `${med.medicine_name},${med.company_details?.name || "-"},
                ${med.current_quantity}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "shortage_book.csv");
              document.body.appendChild(link);
              link.click();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition"
          >
            Download Shortage Book as CSV
          </button>
        </div>


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

      {/* Expiry Records Section */}

      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-6 border-b">
        {/* <div className="p-6 border-b"> */}
        <h3 className="text-2xl m-4 font-semibold text-gray-800 text-center ">Expiry Records</h3>

        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer
        m-4  hover:bg-blue-600 transition"
          onClick={handleExpirySubmit}
        >Generate Expiry </button>

        {/* </div> */}
        {expiry.length === 0 ? (
          <div className="text-3xl w-full h-screen flex items-center justify-center">
            No Expiry Found with low stock
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">S.No</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Medicine Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Agency Source</th>
                <th className="border border-gray-300 px-4 py-2">Quantity </th>
                <th className="border border-gray-300 px-4 py-2">Expiry date </th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {expiry.map((med, index) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.company || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{med.qty_in_strip}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{med.exp_date}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveFromExpiry(med.id)}
                      className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Removed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* backup to excel */}

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg  m-4 border-b">
        <h1 className="text-4xl font-bold mb-6 text-center">Backup Section</h1>
        <button
          onClick={downloadExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition m-4"
        >
          Download Backup
        </button>
      </div>



    </>
  );
}

export default Shortage;
