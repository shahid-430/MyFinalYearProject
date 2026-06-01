import React from 'react'
import Title from './Title'
import { useContext } from 'react'
import { ShopDataContext } from '../context/ShopContext'

function CartTotal() {

    let {currency, delivery_Charges, getCartAmount} = useContext(ShopDataContext)
  return (
    <div className='w-full lg:ml-[30px]'>


        <div className='text-xl py-[10px]'>
            <Title text1={"CART"} text2={"TOTALS"}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm p-[30px] border-[2px] border-[#4d8890]'>

            <div className='flex justify-between text-[white] text-[18px] p-[10px]'>
                <p>SubTotals</p>
                <p>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />

           <div className='flex justify-between text-[white] text-[18px] p-[10px]'>
                <p>Delivery Charges</p>
                <p>{currency} {delivery_Charges}.00</p>
            </div>
                <hr />
                 <div className='flex justify-between text-[white] text-[18px] p-[10px]'>
                <b>Totals</b>
                <b>{currency} {getCartAmount() === 0 ? 0: getCartAmount() + delivery_Charges}.00</b>
            </div>

        </div>
    </div>
  )
}

export default CartTotal