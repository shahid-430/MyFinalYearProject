import React, { useContext } from 'react'
import { ShopDataContext } from '../context/shopContext'
import { useNavigate } from 'react-router-dom'
import Start from './Start'

function Card({ name, price, image, id, ratingAverage = 0, ratingCount = 0 }) {

  let { currency } = useContext(ShopDataContext)
  let navigate = useNavigate()

  return (
    <div className='group w-full sm:w-1/2 md:w-1/3 lg:w-75 min-h-107.5 bg-[#ffffff0a] backdrop-blur-lg rounded-lg hover:scale-[102%] transition-transform duration-200 flex flex-col items-start text-left p-2.5 cursor-pointer border border-[#80808049] overflow-hidden' onClick={() => navigate(`/productdetail/${id}`)}>

      <div className='w-full aspect-4/5 bg-white/90 rounded-md overflow-hidden flex items-start justify-start'>
        <img title='Click For More Details About Product' src={image} alt={name} className='w-full h-full object-contain p-2 object-top-left' />
      </div>

      <div className='mt-3 flex flex-col gap-1 flex-1 items-start text-left w-full'>
        <div className='text-[#c3f6fa] text-[18px] font-medium leading-snug line-clamp-2 text-left w-full'>{name}</div>
        <div className='text-[#c3f6fa] text-[14px] text-left w-full'>
          {currency} {Number(price || 0).toFixed(2)}
        </div>
        <div className='mt-auto pt-2 flex items-center gap-2 justify-start'>
          <Start value={Number(ratingAverage || 0)} starValue={5} />
          <span className='text-[12px] text-[#c3f6fa]'>({ratingCount || 0})</span>
        </div>
      </div>
    </div>
  )
}

export default Card