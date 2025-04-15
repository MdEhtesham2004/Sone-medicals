import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Faraz Bhai",
    comment:
      "Amazing service! Medicines were delivered on time and the packaging was perfect. Highly recommended!",
    image: "/images/user1.jpg",
  },
  {
    name: "Khaja Bhai",
    comment:
      "Great deals and offers on health supplements. The customer support was very helpful too!",
    image: "/images/user2.jpg",
  },
  {
    name: "Muqeet Bhai",
    comment:
      "I love the user-friendly interface and fast delivery. Will definitely shop again!",
    image: "/images/user3.jpg",
  },
];

const Testimonals = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-10">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 italic mb-3">
                "{testimonial.comment}"
              </p>
              <h4 className="text-green-800 font-semibold">
                {testimonial.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonals;

