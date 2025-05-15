import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
// import {resetBill} from '../store/billSlice'
export default function PreviewBill() {
  // const location = useLocation();


  // const { customer, medicines } = location.state || {};
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString()
  // console.log(customer)
  // console.log(medicines.discount)
  // console.log(medicines)

  

  const dispatch = useDispatch();
  const patient = useSelector((state) => state.bill.patient);
  const medicines = useSelector((state) => state.bill.medicines);

// console.log("Redux patient:", patient);
// console.log("Redux medicines:", medicines);


  const totalAmount = medicines?.reduce((total, med) => {
    return total + (parseFloat(med.amount) || 0);
  }, 0);
  
  // const InvoiceNo = () => {
  //   let invoiceNo = 0;
  //   invoiceNo = Math.floor(Math.random() * 1000000);
  // }

 

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.print();
  //   }, 300);
  // }, []);

  return (
    <div className="bill-template p-4">
      {/* HEADER */}
      <header className="border-b border-black pb-2 flex justify-between">
        {/* Left Side */}
        <div className="text-left">
          <h2 className="text-xl font-bold">SONEE MEDICAL & GENERAL STORE</h2>
          <p>H.No.10-3-280/C, Osman Plaza Humayun Nagar, Mehdipatnam Road, Hyderabad - 500028</p>
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
          <div>
            <strong>Patient:</strong> {patient.name}<br />
            <strong>Doctor:</strong> {patient.Doctor}
          </div>
          <div>
            <strong>Ph No : </strong>
            {patient.phone || ""}</div>
          <div><strong>Time:</strong> {time}</div>
          <div className="text-right">
            <strong>Date:</strong> {date}<br />
            <strong>Invoice No:</strong> {patient.billId}
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
            <th>Batch_No</th>
            <th>MFG_Date</th>
            <th>Expiry_Date</th>
            <th>Qty</th>
            <th>MRP</th>
            <th>Rate</th>
            {/* <th>Discount in %</th> */}
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med, index) => (
            <tr key={index} className="text-center border-b">
              <td>{index + 1}</td>
              <td>{med.name}</td>
              <td>{med.pack}</td>
              <td>{med.batchNo}</td>
              <td>{med.mfgDate}</td>
              <td>{med.expDate}</td>
              <td>{med.qty}</td>
              <td>{med.mrp}</td>
              <td>{med.rate}</td>
              {/* <td>{med.discount}%</td> */}
              <td>{med.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AMOUNTS ROW */}
      <div className="flex justify-end gap-8 mt-4 text-sm">
        {/* <p><strong>Gross:</strong> ₹{medicines.amount.toFixed(2)}</p> */}
        {/* <p><strong>Discount:</strong> {medicines.discount}%</p> */}
        {/* <p><strong>Net Amount:</strong> ₹{medicines.amount}</p> */}
        <p><strong>Net Amount:</strong> ₹{totalAmount.toFixed(2)}</p>

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

