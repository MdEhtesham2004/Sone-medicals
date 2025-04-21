import React from 'react';
import Tablets from '../assets/tablets.png';
import BabyCare from '../assets/baby_care.png';
import personal from '../assets/personalCare.png';
import immunity from '../assets/immunity.png';
import skin from '../assets/skincare.png';
import vitamins from '../assets/vitamins.png';

const categories = [
  {
    name: "Tablets",
    image: Tablets,
  },
  {
    name: "Baby Care",
    image: BabyCare,
  },
  {
    name: "Personal Care",
    image: personal,
  },
  {
    name: "Immunity Boosters",
    image: immunity,
  },
  {
    name: "Skin Care",
    image: skin,
  },
  {
    name: "Vitamins & Supplements",
    image: vitamins,
  },
];

const Categories = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          Shop by Categories
        </h2>
        <p className="text-gray-600 mb-12">
          Browse a wide variety of health and wellness essentials.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 hover:bg-green-100 rounded-xl shadow-md transition duration-300 cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 mx-auto mb-3 object-contain rounded-2xl"
                style={{ width: '100px', height: '100px', display: 'block', margin: '8px auto' }}
              />
              <h3 className="text-lg font-semibold text-green-700">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
