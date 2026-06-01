import React from 'react'
import {FaCircle} from 'react-icons/fa'

function Hero({heroData,heroCount,setHeroCount}) {
  return (
    <div className='w-full md:w-1/2 lg:w-[45%] flex flex-col justify-between text-left'>
      <div className='text-[#88d9ee] text-[22px] sm:text-[28px] md:text-[40px] lg:text-[55px]'>
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className='flex items-center justify-start gap-[12px] mt-8'>
        <FaCircle className={`w-[14px] transition-colors duration-300 ${heroCount===0 ?"fill-orange-400":"fill-white"}`} onClick={()=>setHeroCount(0)}/>
        <FaCircle className={`w-[14px] transition-colors duration-300 ${heroCount===1?"fill-orange-400":"fill-white"}`} onClick={()=>setHeroCount(1)}/>
        <FaCircle className={`w-[14px] transition-colors duration-300 ${heroCount===2?"fill-orange-400":"fill-white"}`} onClick={()=>setHeroCount(2)} />
        <FaCircle className={`w-[14px] transition-colors duration-300 ${heroCount===3?"fill-orange-400":"fill-white"}`} onClick={()=>setHeroCount(3)}/>
      </div>
    </div>
  )
}

export default Hero