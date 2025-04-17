import React, { useState } from 'react'
import { Logo, WhatsappBtn } from './index'

function Header() {

  const [isOpen, setIsOpen] = useState(false)

  const toggleBurger = () => {
    setIsOpen(!isOpen);
  }


  const navItems =
    [
      {
        name: 'Home',
        link: '#home',
      },
      {
        name: 'About',
        link: '#About',
      },
      {
        name: 'Shop',
        link: '#shop',
      },
      {
        name: 'Offers',
        link: '#offers',
      },
      {
        name: 'Contact',
        link: '#contact',
      },
    ]


  return (
    <header
      className="w-full bg-white/90 shadow-md sticky flex justify-center top-0 z-50 backdrop-blur-md"
      data-aos="fade-down"
    >
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-28 transition-all duration-300"> */}
      {/* Logo */}
      <div className="text-2xl font-bold text-teal-700 w-[50%]">
        <Logo width="100px" height="100px" className="rounded-full" />
      </div>

      {/* Nav Menu */}
      <nav
        className={`md:ml-auto md:mr-auto cursor-pointer text-2xl gap-3 flex flex-wrap items-center justify-center 
        transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} 
        md:max-h-full md:opacity-100 md:flex md:flex-row md:items-center md:gap-4 w-full md:bg-transparent`}
      >
        <ul
          className={`flex ml-auto ${isOpen ? 'flex-col' : 'hidden'} md:flex
             md:items-center md:gap-4 w-full`}
        >
          {navItems.map((item) => (
            <li key={item.name} className="py-4">
              <button
                onClick={() => (window.location.hash = item.link)}
                className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full cursor-pointer"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>




      {/* Burger Menu */}
      <div
        className="burger absolute top-0 right-0 p-5 md:hidden cursor-pointer"
        onClick={toggleBurger}
        data-aos="fade-down"
        data-aos-delay="200"
      >
        <div
          className={`line w-8 bg-black h-1 my-1 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
        ></div>
        <div
          className={`line w-8 bg-black h-1 my-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''
            }`}
        ></div>
        <div
          className={`line w-8 bg-black h-1 my-1 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
        ></div>
      </div>

      {/* </div> */}
    </header>

  )
}

export default Header


