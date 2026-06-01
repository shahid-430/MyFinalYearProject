import React, { useContext, useEffect, useRef, useState } from 'react'
import logo1 from '../assets/logo1.png'
import { IoSearchCircleOutline } from "react-icons/io5";
import { IoSearchCircleSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { MdContacts, MdReceiptLong } from "react-icons/md";
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';
import { ShopDataContext } from '../context/shopContext';



function Nav() {

  let { getCurrentUser, userData } = useContext(UserDataContext)
  let { serverUrl } = useContext(AuthDataContext)
  let { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(ShopDataContext)
  let [showProfile, setShowProfile] = useState(false)
  let navigate = useNavigate()
  let navRef = useRef(null)


  const closeDropdowns = () => {
    setShowSearch(false)
    setShowProfile(false)
  }


  const handleNavigate = (path) => {
    closeDropdowns()
    navigate(path)
  }


  const handleSearchToggle = () => {
    if (showSearch) {
      closeDropdowns()
      return
    }

    setShowProfile(false)
    setShowSearch(true)
    navigate('/collections')
  }


  const handleProfileToggle = () => {
    setShowSearch(false)
    setShowProfile(prev => !prev)
  }


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeDropdowns()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])


  const handleLogout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      console.log(result.data)
      localStorage.removeItem("authSession")
      getCurrentUser()
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div ref={navRef} className='w-[99vw] h-[50px] bg-[#ecfafaec] z-10 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black'>
      <div className='w-[20%] lg:w-[30%] flex items-center justify-start gap-[10px]'>

        <img title='Go to Home Page' onClick={() => handleNavigate("/")} src={logo1} alt="" className='w-[29px]   h-[29px] object-cover cursor-pointer' />
        <h1 className='text-[25px] font-sans text-[black]'>MyCart</h1>




      </div>
      <div className='w-[50%] lg:w-[55%] hidden md:flex'>
        <ul className='flex items-center justify-center gap-[19px] text-[white]'>
          <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => handleNavigate('/')}>Home</li>
          <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => handleNavigate('/collections')}>Collections</li>
          <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => handleNavigate('/about')}>About</li>
          <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => handleNavigate('/contact')}>Contact</li>
          <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => handleNavigate('/orders')}>My Orders</li>
        </ul>
      </div>

      <div className='w-[30%] flex items-center justify-end gap-[20px]'>

        {!showSearch && <IoSearchCircleOutline title='Search Items' className='w-[35px] h-[35px] text-[#000000] cursor-pointer hover:bg-slate-500  rounded-2xl' onClick={handleSearchToggle} />}

        {showSearch && <IoSearchCircleSharp className='w-[35px] h-[35px] text-[#000000] cursor-pointer hover:bg-slate-500  rounded-2xl ' onClick={handleSearchToggle} />}

        {!userData && < FaUserCircle className='w-[35px] h-[35px] text-[#000000] cursor-pointer hover:bg-slate-500 rounded-2xl hidden md:block' onClick={handleProfileToggle} />}

        {userData &&
          <div className='w-[30px] h-[30px] text-[white]  bg-[#000000] cursor-pointer hover:bg-slate-500  rounded-full flex items-center justify-center cursor-pointer' onClick={handleProfileToggle}>
            {userData?.name.slice(0, 1)}
          </div>
        }

        <BsCartPlus title='My Cart' className='w-[35px] h-[35px] text-[#000000] cursor-pointer hover:bg-slate-500  rounded-xl hidden md:block  ' onClick={() => handleNavigate("/cart")} />
        <p className='absolute top-[3px] right-[23px] w-[18px] h-[18px] text-white rounded-full flex items-center justify-center md:flex bg-black px-[5px] py-[2px] right-[23px] hidden md:block  '>{getCartCount()}</p>
      </div>

      {showSearch && <div className='w-[100%] h-[80px]   absolute top-[85%] left-0  right-0 flex items-center justify-center '>
        <input type="text" className='lg:w-[50%] w-[80%] h-[60%] bg-[#233533] rounded-[30px] px-[50px] placeholder:text-white text-[white] text-[18px]' placeholder='Search here' onChange={(e) => { setSearch(e.target.value) }} value={search} />

      </div>}


      {showProfile &&


        <div className='w-[220px] h-[150px] bg-[#000000d7]  absolute top-[110%] right-[4%] border-[1px] border-[#aaa9a9] rounded-[10px] z-10 '>


          <ul className='w-[100%] h-[100%] flex items-start flex-col justify-around text-[white] text-[17px] py-[10px]'>


            {!userData && <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[10px] cursor-pointer' onClick={() => handleNavigate("/login")}>Login</li>}

            {userData && <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[10px] cursor-pointer' onClick={() => { closeDropdowns(); handleLogout() }}>Logout</li>}

            <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[10px] cursor-pointer' onClick={() => handleNavigate('/orders')}>My Orders</li>

            <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[10px] cursor-pointer' onClick={() => handleNavigate('/about')}>About</li>

          </ul>

        </div>}

      <div className='w-[100vw] h-[60px] flex items-center gap-[20px] justify-between px-[20px] fixed  bottom-0 text-[12px]  left-0 bg-[#191818] md:hidden'>

        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => handleNavigate("/")}><IoMdHome className='w-[28px] h-[28px] text-[white] md:hidden' />Home</button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => handleNavigate("/collections")}><HiOutlineCollection className='w-[28px] h-[28px] text-[white] md:hidden' />Collections</button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => handleNavigate("/contact")}><MdContacts className='w-[28px] h-[28px] text-[white] md:hidden' />Contact</button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => handleNavigate("/orders")}><MdReceiptLong className='w-[28px] h-[28px] text-[white] md:hidden' />Orders</button>
        <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => handleNavigate("/cart")}><BsCartPlus className='w-[28px] h-[28px] text-[white] md:hidden' />Cart</button>
        <p className='absolute top-[10px] right-[1px] bg-[#ff0000] text-[black] rounded-full w-[18px] h-[18px] flex items-center justify-center bg-[white] text-[9px] px-[5px] py-[2px] font-semibold mr-[10px] '>{getCartCount()}</p>




      </div>

    </div>
  )
}

export default Nav