import React from "react";

import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Logo width="200px" height="200px" className='rounded-full'/>
          {/* Pharmacy Info Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-orange-200">Sonee Medical And General Store </h3>
            <p className="text-lg">
              Providing quality healthcare and medicines for your well-being.
            </p>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-lg">
              <strong>Address:</strong> Humayun Nagar Masab Tank Road Mehdipatnam 500006
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> 9700160870
            </p>
            <p className="text-lg">
              <strong>Email:</strong> SonneMedical1115@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} Sonee Medical And General Store . <br /> All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
