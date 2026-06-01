import React from "react";
import Title from "../component/Title";
import contact from "../assets/contact.png"
import NewLetterBox from "../component/NewLetterBox";

function Contact() {

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col bg-gradient-to-l from-[#141414] to-[#0c2025]  pt-[80px] ">
      <Title text1={"Contact"} text2={"Us"} />
      <div className="w-[100%] flex items-center justify-center lg:flex-row flex-col mt-[30px] ">

        <div className="lg:w-[50%] w-[100%] flex items-center justify-center ">

          <img src={contact} alt="Contact" className="lg:w-[70%] w-[80%] shadow-md shadow-block rounded-lg" />
        </div>

        <div className="lg:w-[50%] w-[80%] flex items-start justify-center flex-col gap-[20px] mt-[20px] lg:mt-0">

          <p className=" lg:w-[80%] w-[100%] text-[white] font-bold lg:text-[18px] text-[15px] text-justify ">
            Our Store
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify ">
            MyCart, 123 Main Street, Anytown,Pakistan
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] font-bold lg:text-[18px] text-[15px] text-justify ">
            Contact Information
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify">
            Phone: +92 341-6788430
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px] text-justify ">
            Email: contact@mycart.com
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] font-bold lg:text-[18px] text-[15px] text-justify ">
            Careers at MyCart
          </p>
          <p className=" lg:w-[80%] w-[100%] text-[white] md:text-[16px] text-[14px]  ">
            If you're interested in joining our team, please send your
            resume and cover letter to careers@mycart.com
          </p>
          <button onClick={() => window.open(
            "https://pk.indeed.com/q-ecommerce-l-lahore-jobs.html", "_blank")} className="px-[30px] py-[10px] bg-[#0c2025] text-[white] rounded-md hover:bg-slate-600 transition duration-300 cursor-pointer">
            Explore Jobs
          </button>
        </div>

      </div>
      <NewLetterBox />
    </div>
  )



}
export default Contact