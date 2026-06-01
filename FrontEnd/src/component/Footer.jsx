import React from 'react'
import logo1 from '../assets/logo1.png'
import { useNavigate } from 'react-router-dom'

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

function Footer() {

  const navigate = useNavigate()

  return (

    <footer className='relative w-full bg-linear-to-l from-[#141414] to-[#0c2025] border-t border-[#24363d]'>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

        {/* Logo Section */}
        <div className='flex flex-col gap-5'>

          <div className='flex items-center gap-3'>
            <img
              src={logo1}
              alt='MyCart Logo'
              className='w-12 h-12 object-contain'
            />

            <h2 className='text-3xl font-bold text-[#a5faf7]'>
              MyCart
            </h2>
          </div>

          <p className='text-blue-100 leading-7 text-sm md:text-base'>
            MyCart is your one-stop destination for convenient online shopping,
            offering fast delivery, secure payments, and premium customer support.
          </p>

          {/* Social Icons */}
          <div className='flex items-center gap-4 mt-2'>

            <div className='w-10 h-10 rounded-full bg-[#1f343b] hover:bg-[#90b9ff] hover:text-black duration-300 flex items-center justify-center text-white cursor-pointer' onClick={() => window.open("https://www.facebook.com/profile.php?id=61586893389052", "_blank")}>
              <FaFacebookF />
            </div>

            <div className='w-10 h-10 rounded-full bg-[#1f343b] hover:bg-[#90b9ff] hover:text-black duration-300 flex items-center justify-center text-white cursor-pointer' onClick={() => window.open("https://www.instagram.com/yourprofile", "_blank")} >
              <FaInstagram />
            </div>

            <div className='w-10 h-10 rounded-full bg-[#1f343b] hover:bg-[#90b9ff] hover:text-black duration-300 flex items-center justify-center text-white cursor-pointer' onClick={() => window.open("https://twitter.com/yourprofile", "_blank")}>
              <FaTwitter />
            </div>

            <div className='w-10 h-10 rounded-full bg-[#1f343b] hover:bg-[#90b9ff] hover:text-black duration-300 flex items-center justify-center text-white cursor-pointer' onClick={() => window.open("https://github.com/yourprofile", "_blank")}>
              <FaGithub />
            </div>

          </div>

        </div>

        {/* Company Links */}
        <div className='flex flex-col gap-5'>

          <h3 className='text-2xl font-semibold text-[#a5faf7]'>
            Company
          </h3>

          <ul className='flex flex-col gap-3 text-blue-100'>

            <li
              onClick={() => navigate("/")}
              className='hover:text-[#90b9ff] duration-300 cursor-pointer'
            >
              Home
            </li>

            <li
              onClick={() => navigate("/about")}
              className='hover:text-[#90b9ff] duration-300 cursor-pointer'
            >
              About Us
            </li>

            <li
              onClick={() => navigate("/devilery")}
              className='hover:text-[#90b9ff] duration-300 cursor-pointer'
            >
              Delivery
            </li>

            <li
              onClick={() => navigate("/privacypolicy")}
              className='hover:text-[#90b9ff] duration-300 cursor-pointer'
            >
              Privacy Policy
            </li>

          </ul>

        </div>

        {/* Contact */}
        <div className='flex flex-col gap-5'>

          <h3 className='text-2xl font-semibold text-[#a5faf7]'>
            Contact
          </h3>

          <ul className='flex flex-col gap-3 text-blue-100 text-sm md:text-base'>

            <li>+92 341 6788430</li>
            <li>contact@mycart.com</li>
            <li>info@mycart.com</li>
            <li>Pakistan</li>

          </ul>

        </div>

        {/* Newsletter */}
        <div className='flex flex-col gap-5'>

          <h3 className='text-2xl font-semibold text-[#a5faf7]'>
            Stay Updated
          </h3>

          <p className='text-blue-100 text-sm leading-7'>
            Subscribe to get updates about new arrivals and exclusive deals.
          </p>

          <div className='flex items-center bg-[#1f343b] rounded-xl overflow-hidden border border-[#324d56]'>

            <input
              type="email"
              placeholder='Your Email'
              className='bg-transparent outline-none px-4 h-12.5 text-white w-full placeholder:text-gray-400'
            />

            <button className='h-12.5 px-5 bg-[#90b9ff] hover:bg-[#a5faf7] text-black font-semibold duration-300'>
              Join
            </button>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className='border-t border-[#24363d] py-5 px-4'>

        <p className='text-center text-blue-100 text-sm md:text-base'>
          © 2026 MyCart. All Rights Reserved.
        </p>

      </div>

    </footer>
  )
}

export default Footer