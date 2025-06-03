import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { resetBill } from '../store/billSlice'
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


export default function PreviewBill() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString()

  const patient = useSelector((state) => state.bill.patient);
  const medicines = useSelector((state) => state.bill.medicines);


  const totalAmount = medicines?.reduce((total, med) => {
    return total + (parseFloat(med.amount) || 0);
  }, 0);

  const totalMRP = medicines?.reduce((total, med) => {
    return total + ((parseFloat(med.mrp) || 0) * (parseFloat(med.qty) || 1));
  }, 0)

  const totalDiscount = medicines?.reduce((total, med) => {
    const itemDiscount = parseFloat(med.mrp) * parseFloat(med.qty) * (parseFloat(med.discount) / 100);
    return total + (itemDiscount || 0);
  }, 0)


  const [hideButtons, setHideButtons] = useState(false);

  const generateBill = () => {
    // const userConfirmed = window.confirm("Are you sure you want to generate and print the bill?");
    confirmAlert({
      title: 'Confirm to Print',
      message: 'Are you sure you want to generate the bill?',
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const userConfirmed = true;
            if (userConfirmed) {
              setHideButtons(true);
              setTimeout(() => {
                window.print();
                dispatch(resetBill());
                navigate("/bill");
                setHideButtons(false);
              }, 100);
            }
          }
        },
        {
          label: "No",
          onClick: () => {
            setHideButtons(false);
          }
        }
      ]
    })

    if (!userConfirmed) return;

    setHideButtons(true);
    setTimeout(() => {
      window.print();
      dispatch(resetBill());
      navigate("/bill");
      setHideButtons(false);
    }, 100);
  };



  return (
    <div className="bill-template p-4">

      <header className="border-b border-black pb-2 flex justify-between">

        <div className="text-left">
          <h2 className="text-xl font-bold">SONEE MEDICAL & GENERAL STORE</h2>
          <p>H.No.10-3-280/C, Osman Plaza Humayun Nagar, Mehdipatnam Road, Hyderabad - 500028</p>
          <p>Phone: 040-23531807, 9849246524, 9030440079</p>
        </div>


        <div className="text-right text-sm">
          <p><strong>DL.No:</strong> TG/16/05/2015-8978</p>
          <p><strong>GST No:</strong> 36ABBEM2813R1ZY</p>
        </div>
      </header>


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


      <div className="flex justify-end gap-8 mt-4 text-sm">
        {/* <p><strong>Gross:</strong> ₹{medicines.amount.toFixed(2)}</p> */}
        <p><strong>MRP :- </strong>₹{totalMRP.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹{totalDiscount.toFixed(2)}</p>
        {/* <p><strong>Net Amount:</strong> ₹ {medicines.amount}</p> */}
        <p><strong>Net Amount:</strong> ₹{totalAmount.toFixed(2)}</p>

      </div>


      <footer className="border-t border-black pt-2 text-sm mt-4">
        <p>* Items cannot be taken back after 24 hrs. (Bill is mandatory)</p>
        <p>* Damaged/Fridge items will not be taken back.</p>
        <div className="text-right mt-6">
          <p>Authorized Signatory</p>
          <p className="font-semibold">Sonee Medical & General Store</p>
        </div>
      </footer>

      {!hideButtons && (
        <>
          <div className="flex justify-center no-print">
            <button onClick={generateBill} className="no-print mt-4 cursor-pointer w-[25%] bg-blue-500 text-white px-4 py-2 rounded">
              Generate Bill</button>
          </div>

          <br />
          <button className="no-print mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.history.back()}>
            Go Back
          </button>
        </>
      )}


    </div>
  );
}

