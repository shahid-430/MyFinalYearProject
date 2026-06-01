import React from "react";
import Title from "../component/Title";
import MyAbout from "../assets/MyAbout.png"
import NewLetterBox from "../component/NewLetterBox";


function About() {

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-l from-[#141414] to-[#0c2025] gap-0 pt-[80px] ">
      <Title text1={"About"} text2={"Us"} />
      <div className="w-[100%] flex items-center justify-center flex-col lg:flex-row mb-[50px] ">

        <div className="lg:w-[65%] w-[80%] flex items-start justify-center pb-[20px]">
          <img src={MyAbout} alt="About Us" className="lg:w-[65%] w-[100%] shadow-md shadow-black rounded-lg" />
        </div>
        <div className="lg:w-[50%] w-[80%] flex items-start justify-center flex-col gap-[20px] flex-col mt-[20px] lg:mt-0">
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify">
            Welcome to MyCart, your trusted destination for quality products and a smooth online shopping experience. We offer a wide range of carefully selected items at affordable prices, ensuring convenience, quality, and customer satisfaction in every purchase. Our goal is to make shopping simple, secure, and enjoyable with an easy-to-use platform and reliable customer support.
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify">
            At MyCart, we strive to exceed your expectations and provide you with the best shopping experience possible. Our user-friendly interface and secure payment options make online shopping a breeze.
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[10px] lg:text-[18px] text-[15px] font-bold">
            Our Mission
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify">
            Our mission at MyCart is to provide our customers with a convenient and enjoyable shopping experience. We are committed to offering a wide range of high-quality products at competitive prices, while delivering exceptional customer service.
          </p>

        </div>

      </div>

      <div className=" w-[100%] flex items-center justify-center flex-col gap-[20px] " >
        <Title text1={"WHY CHOOSE"} text2={"US"} />
        <div className="w-[80%] flex items-center justify-center gap-[40px] lg:flex-row flex-col mb-[10px]  gap:b-[0px] ">

          <div className=" lg:w-[33%] w-[90%] h-[250px] border-[1px] border-gray-100 flex items-center justify-center gap-[20px] flex-col  px-[40px] py-[10px] text-[white] backdrop-blur-[2px] bg-[#ffffff0d]  ">
            <b>Quality Products</b>
            <p>We curate only the best products for our customers, ensuring quality and satisfaction.</p>
          </div>
          <div className=" lg:w-[33%] w-[90%] h-[250px] border-[1px] border-gray-100 flex items-center justify-center gap-[20px] flex-col  px-[40px] py-[10px] text-[white] backdrop-blur-[2px] bg-[#ffffff0d] ">
            <b>Fast & Secure Delivery</b>
            <p>We provide quick, reliable, and secure delivery services to make your shopping experience smooth and stress-free.</p>
          </div>
          <div className=" lg:w-[33%] w-[90%] h-[250px] border-[1px] border-gray-100 flex items-center justify-center gap-[20px] flex-col  px-[40px] py-[10px] text-[white] backdrop-blur-[2px] bg-[#ffffff0d] ">
            <b> 24/7 Customer Support</b>
            <p>We provide round-the-clock customer support to assist you with any questions or concerns.</p>
          </div>



        </div>

      </div>

      <NewLetterBox />


    </div>
  )



}
export default About