import React, { useContext, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import { ShopDataContext } from '../context/ShopContext'
import { AuthDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function PlaceOrder() {
  let [method, setMethod] = useState('COD')
  let navigate = useNavigate()

  const { cartItem, setCartItem, getCartAmount, delivery_Charges, products } = useContext(ShopDataContext)

  const { serverUrl } = useContext(AuthDataContext)

  let [formData, setformData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setformData(data => ({ ...data, [name]: value }))

  }
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let orderItems = []
      for (const productId in cartItem) {
        for (const size in cartItem[productId]) {
          if (cartItem[productId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === productId))
            if (itemInfo) {
              itemInfo.size = size
              itemInfo.quantity = cartItem[productId][size]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_Charges
      }

      switch (method) {
        case 'COD': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
          console.log(result.data)

          if (result.data?.success) {
            setCartItem({})
            navigate(`/verify?success=true&orderId=${result.data.orderId}`)
          } else {
            console.log(result.data.message)
          }
        }
          break;

        case 'stripe': {
          // request backend to create Stripe Checkout session
          const result = await axios.post(serverUrl + "/api/order/placeorder", { ...orderData, PaymentMethod: 'stripe' }, { withCredentials: true })
          if (result.data && result.data.session_url) {
            window.location.replace(result.data.session_url)
          } else {
            console.log('Stripe session creation failed', result.data)
            alert(result.data?.message || 'Stripe session creation failed')
          }
        }
          break;

        default:
          break;
      }


    } catch (error) {
      console.log(error)

    }

  }

  return (
    <div className='w-full min-h-screen p-5 bg-linear-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row items-center justify-center gap-12 relative mt-12'>

      <div className='w-full lg:w-1/2 h-full flex items-center justify-center mt-20 lg:mt-0'>
        <form action="" onSubmit={onSubmitHandler} className='w-[95%] lg:w-[70%] h-full lg:h-[70%]'>

          <div className='py-2.5 flex items-center justify-center'>
            <Title text1={"Delivery"} text2={"Information"} />
          </div>
          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>

            <input type="text" placeholder='First Name' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='firstName' value={formData.firstName} />

            <input type="text" placeholder='last Name' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='lastName' value={formData.lastName} />

          </div>

          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>

            <input type="text" placeholder='Email Address' className='w-full h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='email' value={formData.email} />
          </div>
          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>

            <input type="text" placeholder='Street' className='w-full h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='street' value={formData.street} />
          </div>
          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>


            <input type="text" placeholder='City' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='city' value={formData.city} />

            <input type="text" placeholder='State' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='state' value={formData.state} />
          </div>
          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>


            <input type="text" placeholder='PinCode' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='pinCode' value={formData.pinCode} />

            <input type="text" placeholder='Country' className='w-[48%] h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='country' value={formData.country} />
          </div>
          <div className='w-full h-17.5 flex items-center justify-between px-2.5'>


            <input type="tel" placeholder='Phone' className='w-full h-12.5 rounded-md bg-slate-700 placeholder:text-white text-lg px-5 shadow-sm shadow-[#343434] text-white' required onChange={onChangeHandler} name='phone' value={formData.phone} />

          </div>
          <div >

            <button title='Order Now' type='submit' className='absolute bottom-4 right-[35%] lg:right-[17%] mt-5 ml-8 flex cursor-pointer items-center justify-center gap-5 rounded-2xl border border-[#80808049] bg-[#51808048] px-12 py-2.5 text-lg text-white hover:bg-slate-500' >PLACE ORDER</button>
          </div>

        </form>
      </div>
      <div className='w-full lg:w-1/2 min-h-full flex items-center justify-center gap-8'>
        <div className='w-[90%] lg:w-[70%] h-full flex flex-col items-center justify-center gap-2.5'>

          <CartTotal />

          <div className='py-2.5 flex items-center justify-center'>
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>

          <div className='w-full h-[30vh] flex items-start justify-center mt-5 lg:mt-0 gap-12.5'>
            <button
              onClick={() => setMethod('stripe')}
              className={`w-50 h-12.5 bg-linear-to-t from-[#6ea8ff] to-white text-sm px-5 rounded-sm text-[#0b3b7a] font-bold ${method === 'stripe' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}
            >
              PAY WITH CARD (Stripe)
            </button>
            <button
              onClick={() => setMethod('COD')}
              className={`w-50 h-12.5 bg-linear-to-t from-[#95b3f8] to-white text-sm px-5 rounded-sm text-[#332f6f] font-bold ${method === 'COD' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}
            >
              CASH ON DELIVERY
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PlaceOrder