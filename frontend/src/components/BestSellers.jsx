import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import pcm from "../assets/pcm500.jpg";
import vitc from "../assets/vitc.jpg";
import hand from "../assets/hand.png";
import syrup from "../assets/syrup.png";
import face from "../assets/face.avif";
import Evion from "../assets/Evion.png";
import Eldopar from "../assets/eldopar.avif";

const products = [
  {
    name: "Paracetamol 500mg",
    price: "₹50",
    image: pcm,
  },
  {
    name: "Vitamin C Tablets",
    price: "₹120",
    image: vitc,
  },
  {
    name: "Hand Sanitizer 100ml",
    price: "₹30",
    image: hand,
  },
  {
    name: "Cough Syrup",
    price: "₹85",
    image: syrup,
  },
  {
    name: "Face Mask (Pack of 10)",
    price: "₹99",
    image: face,
  },
  {
    name: "Evion 400",
    price: "₹86",
    image: Evion,
  },
  {
    name: "Eldopar",
    price: "₹63",
    image: Eldopar,
  },
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
          Bestselling Products
        </h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }} 
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Pagination,Autoplay]}
        >
          {products.map((product, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4 text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700">
                  {product.name}
                </h3>
                <p className="text-green-600 font-bold">{product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BestSellers;
