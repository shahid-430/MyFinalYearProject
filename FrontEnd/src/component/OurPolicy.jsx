
import React from 'react'
import Title from './Title'
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

function OurPolicy() {

  const policies = [
    {
      icon: <MdOutlineCurrencyExchange />,
      title: "Easy Returns and Refunds",
      desc: "Quick and hassle-free returns and refunds. Feel free to return or exchange items within our policy period."
    },
    {
      icon: <TbRosetteDiscountCheckFilled />,
      title: "Exclusive Discounts",
      desc: "Exclusive deals and special offers for our valued customers. Buy now!"
    },
    {
      icon: <BiSupport />,
      title: "24/7 Customer Support",
      desc: "Round-the-clock assistance for all your queries. We are here to help!"
    }
  ]

  return (

    <div className='w-full py-20 px-5 bg-gradient-to-l from-[#141414] to-[#0c2025]'>

      {/* Heading */}
      <div className='text-center mb-16'>
        <Title text1={"Our"} text2={"Policy"} />

        <p className='max-w-[800px] mx-auto mt-4 text-sm md:text-lg text-blue-100'>
          Customer-friendly policies committed to satisfaction and safety are our top priority.
        </p>
      </div>

      {/* Cards */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>

        {policies.map((item, index) => (

          <div
            key={index}
            className='bg-[#13262c]/60 backdrop-blur-md border border-[#29444c] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 duration-300'
          >

            {/* Icon */}
            <div className='text-[#90b9ff] text-6xl mb-5'>
              {item.icon}
            </div>

            {/* Title */}
            <h2 className='text-[#a5faf7] text-2xl font-semibold mb-4'>
              {item.title}
            </h2>

            {/* Description */}
            <p className='text-blue-100 text-[16px] leading-7'>
              {item.desc}
            </p>

          </div>

        ))}

      </div>

    </div>

  )
}

export default OurPolicy