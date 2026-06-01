import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { ShopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin2Fill } from "react-icons/ri";
import CartTotal from '../component/CartTotal';

function Cart() {

  const { products, currency, cartItem, updateQuantity } = useContext(ShopDataContext)
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const tempData = []

    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        if (cartItem[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity: cartItem[productId][size],
          })
        }
      }
    }

    setCartData(tempData)
  }, [cartItem])


  return (
    <div className='w-full min-h-screen p-5 bg-gradient-to-l from-[#141414] to-[#0c2025] pt-[80px] pb-10'>

      <div className='w-full text-center mt-6'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className='w-full flex flex-col gap-4 mt-6'>

        {
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id)
            if (!productData) return null

            return (
              <div key={index} className='w-full border-t border-b'>

                <div className='w-full flex items-start gap-4 bg-[#51808048] p-4 rounded-2xl relative flex-col md:flex-row'>
                  <img className='w-[100px] h-[100px] rounded-lg flex-shrink-0' src={productData.image1} alt="" />
                  <div className='flex-1 flex flex-col gap-2'>
                    <p className='md:text-[20px] text-[18px] text-[#f3f9fc] font-medium'> {productData.name}</p>
                    <div className='flex items-center gap-4 flex-wrap'>

                      <p className='md:text-[18px] text-[14px] text-[#aaf4e7]'>{currency} {productData.price}</p>

                      <p className='w-[40px] h-[30px] text-[16px] text-[white] bg-[#518080b4] rounded-md mt-[5px] flex items-center justify-center border-[1px] border-[#9ff9f9]'> {item.size}</p>

                    </div>
                  </div>
                  <div className='mt-3 md:mt-0 md:ml-4 flex items-center gap-3'>
                    <input type="number" min={1} defaultValue={item.quantity} className='w-20 md:w-24 px-2 py-2 text-white text-[16px] font-semibold bg-[#18080b4] border-[1px] border-[#9ff9f9] rounded-md' onChange={(e) => e.target.value === ' ' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                    />
                    <RiDeleteBin2Fill title='Remove from cart' className='text-[#9ff9f9] w-[25px] h-[25px] hover:bg-red-600 rounded-md cursor-pointer' onClick={() => updateQuantity(item._id, item.size, 0)} />
                  </div>
                </div>

              </div>
            )
          })}

      </div>

      <div className='flex justify-start items-end my-12'>
        <div className='w-full sm:w-[450px] '>

          <CartTotal />

          <button title='PROCEED TO CHECKOUT' className='text-[16px] hover:bg-slate-500 cursor-pointer bg-[#51808048] py-3 px-6 rounded-2xl text-white flex items-center justify-center gap-4 border-[1px] border-[#80808049] ml-0 md:ml-8 mt-4' onClick={() => {
            if (cartData.length > 0) {
              navigate("/placeorder");

            } else {
              console.log("Your Cart Is Empty")
            }
          }}>
            PROCEED TO CHECKOUT
          </button>

        </div>
      </div>



    </div>
  )
}

export default Cart