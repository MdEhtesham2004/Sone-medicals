import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [medicines, setMedicines] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (name && phone && medicines && prescription && address) {
      setMessage("Thank you for submitting the form! We will contact you soon.");
      // Here you can handle the form submission logic like sending it to a backend or API.
    } else {
      setMessage("Please fill all the fields.");
    }
  };

  const handleFileChange = (e) => {
    setPrescription(e.target.files[0]);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Contact Us for Your Medicines
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Fill out the form below, and we will assist you with your medicine delivery.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-x-6 md:space-y-0">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-md w-full md:w-1/2 border border-gray-300"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-4 rounded-md w-full md:w-1/2 border border-gray-300"
              required
            />
          </div>

          <textarea
            placeholder="Write your medicines here"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="p-4 rounded-md w-full border border-gray-300"
            rows="4"
            required
          />

          <div className="flex flex-col md:flex-row space-y-4 md:space-x-6 md:space-y-0">
            {/* Custom Label for File Upload */}
            <label
              htmlFor="file-upload"
              className="p-4 bg-gray-200 rounded-md w-full md:w-1/2 border border-gray-300 text-center cursor-pointer"
            >
              {prescription ? prescription.name : "Upload Prescription (Image/PDF)"}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf"
              required
            />
            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-4 rounded-md w-full md:w-1/2 border border-gray-300"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-md cursor-pointer"
          >
            Submit
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </section>
  );
};

export default Contact;

