import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PreviewBill() {
  const location = useLocation();
  const billData = location.state || {
    patientName: "John Doe",
    doctor: "SELF",
    medicines: [
      {
        name: "VENTOCORE DL TAB",
        pack: "10",
        rack: "V5",
        mfg: "SAF",
        batch: "DT407072",
        expiry: "06/2026",
        qty: 10,
        rate: 30,
        amount: 300
      },
    ],
    discount: 60,
    invoiceNo: "INV123456", // Add mock invoice and date if not provided
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  const gross = billData.medicines.reduce((sum, med) => sum + med.amount, 0);
  const netAmount = gross - billData.discount;

  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="bill-template p-4">
      {/* HEADER */}
      <header className="border-b border-black pb-2 flex justify-between">
        {/* Left Side */}
        <div className="text-left">
          <h2 className="text-xl font-bold">SONEE MEDICAL & GENERAL STORE</h2>
          <p>H.No.12-2-831/89, Osman Plaza Humayun Nagar, Mehdipatnam Road, Hyderabad - 500028</p>
          <p>Phone: 040-23531807, 9849246524, 9030440079</p>
        </div>

        {/* Right Side */}
        <div className="text-right text-sm">
          <p><strong>DL.No:</strong> TG/16/05/2015-8978</p>
          <p><strong>GST No:</strong> 36ABBEM2813R1ZY</p>
        </div>
      </header>

      {/* PATIENT INFO */}
      <section className="my-4 border-b border-black pb-2">
        <div className="flex justify-between text-sm">
          <div><strong>Patient:</strong> {billData.patientName}<br /><strong>Doctor:</strong> {billData.doctor}</div>
          <div><strong>Time:</strong> {billData.time}</div>
          <div className="text-right">
            <strong>Date:</strong> {billData.date}<br />
            <strong>Invoice No:</strong> {billData.invoiceNo}
          </div>
        </div>
      </section>

      {/* MEDICINE TABLE */}
      <table className="w-full border mt-2 text-sm">
        <thead>
          <tr className="border-b">
            <th>S.No</th>
            <th>Product Name</th>
            <th>Pack</th>
            <th>Rack</th>
            <th>MFG</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {billData.medicines.map((med, index) => (
            <tr key={index} className="text-center border-b">
              <td>{index + 1}</td>
              <td>{med.name}</td>
              <td>{med.pack}</td>
              <td>{med.rack}</td>
              <td>{med.mfg}</td>
              <td>{med.batch}</td>
              <td>{med.expiry}</td>
              <td>{med.qty}</td>
              <td>{med.rate}</td>
              <td>{med.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AMOUNTS ROW */}
      <div className="flex justify-end gap-8 mt-4 text-sm">
        <p><strong>Gross:</strong> ₹{gross.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹{billData.discount.toFixed(2)}</p>
        <p><strong>Net Amount:</strong> ₹{netAmount.toFixed(2)}</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-black pt-2 text-sm mt-4">
        <p>* Items cannot be taken back after 24 hrs. (Bill is mandatory)</p>
        <p>* Damaged/Fridge items will not be taken back.</p>
        <div className="text-right mt-6">
          <p>Authorized Signatory</p>
          <p className="font-semibold">Sonee Medical & General Store</p>
        </div>
      </footer>

      <button className="no-print mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  );
}

