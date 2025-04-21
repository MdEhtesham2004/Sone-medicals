import React from 'react';
import featureIcon from '../assets/fast-delivery-svgrepo-com.svg';
import doctor from '../assets/doctor.svg';
import tablets from '../assets/tablets.svg';
import medical from '../assets/medical-kit.svg';

const features = [
  {
    icon: <img src={featureIcon} alt="Fast Delivery" className="text-green-600 
    text-4xl mb-4" style={{ width: '100px',display: 'block', margin: '0 auto'  }}/>,
    title: "Fast Home Delivery",
    description: "Get your medicines delivered to your doorstep within hours.",
  },
  {
    icon: <img src={doctor} alt="Fast Delivery" className="text-green-600 
    text-4xl mb-4 " style={{ width: '70px',display: 'block', margin: '4px auto'  }}/>,
    title: "Online Expert Consults",
    description: "Chat with Expert anytime, anywhere.",
  },
  {
    icon: <img src={tablets} alt="Fast Delivery" className="text-green-600 
    text-4xl mb-4 " style={{ width: '70px',display: 'block', margin: '4px auto'  }}/>,
    title: "100% Genuine Medicines",
    description: "We ensure all products are authentic and quality-checked.",
  },
  {
    icon: <img src={medical} alt="Fast Delivery" className="text-green-600 
    text-4xl mb-4 " style={{ width: '70px',display: 'block', margin: '4px auto'  }}/>,
    title: "24/7 Customer Support",
    description: "We’re always here to help, no matter the time.",
  },
];

const Features = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          What Makes Us Different
        </h2>
        <p className="text-gray-600 mb-12">
          We’re committed to offering the best pharmacy experience to keep your health first.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
