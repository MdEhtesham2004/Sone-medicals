import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/customSwiper.css'; 
import banner1 from '../assets/sonee_board1.jpg';    
import banner2 from '../assets/banner.jpg';
import banner3 from '../assets/banner3.jpg';

const HeroSection = () => {
  const heroSlides = [
    {
      image: banner1,
      heading: "Get Medicines Delivered",
      subtext: "Doorstep delivery of 1000+ medicines and wellness products.",
      buttonText: "Order Now",
    },
    {
      image: banner2,
      heading: "Flat 15% Off on First Order",
      subtext: "Sign up and save big on your first medical purchase!",
      buttonText: "Order Now",
    },
    {
      image: banner3,
      heading: "Consult Expert Online",
      subtext: "Instant teleconsultation from Experts.",
      buttonText: "Consult Now",
    },
  ];

  return (
    <section className="w-full relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[500px] md:h-[600px]"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover mt-1"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6 md:px-20 text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.heading}</h2>
                <p className="text-lg md:text-xl mb-6">{slide.subtext}</p>
                <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full transition">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;

 