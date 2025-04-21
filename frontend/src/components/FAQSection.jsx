import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        // "You can place an order by selecting your medicines, adding them to the cart, and checking out. We also accept prescription uploads for specific medications.",
        "You can place an order by Writing your medicines, in Contact Form ,We also accept prescription uploads for specific medications"
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes, we provide home delivery for all orders. You can Type a delivery address during the checkout process.",
    },
    {
      question: "How can I upload my prescription?",
      answer:
        "You can upload your prescription in Contact Form, 'Upload Prescription' section. We accept both image and PDF formats.",
    },
    {
      question: "Are there any discounts or offers?",
      answer:
        "Yes! We frequently offer discounts, seasonal sales, and promotional offers.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can contact our customer support by visiting our 'Contact Us' or Whatsapp page, where you'll find our phone number, email .",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="text-left w-full font-semibold text-lg text-green-700 hover:text-green-900 focus:outline-none flex items-center justify-between"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: expandedIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="transform duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="text-green-700"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </motion.div>
              </button>
              {expandedIndex === index && (
                <motion.p
                  className="text-gray-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
