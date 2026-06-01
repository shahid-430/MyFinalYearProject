import React, { useEffect, useState } from 'react'
import logo2 from '../assets/logo2.png'
import googlelogo from '../assets/googlelogo.png'
import { useNavigate } from 'react-router-dom'
import { FaEyeSlash } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { AuthDataContext } from '../context/AuthContext';
import { useContext } from "react";
import axios from 'axios';
import { auth, provider } from '../../utils/Firebase';
import { signInWithPopup } from 'firebase/auth';
import { UserDataContext } from '../context/UserContext';


function login() {
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let { serverUrl } = useContext(AuthDataContext)

  let { getCurrentUser } = useContext(UserDataContext)

  let navigate = useNavigate()

  const completeGoogleLogin = async (user) => {
    const name = user.displayName || ''
    const email = user.email || ''

    const result = await axios.post(
      serverUrl + "/api/auth/googlelogin",
      { name, email },
      { withCredentials: true }
    )

    console.log(result.data)
    getCurrentUser()
    navigate("/")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + "/api/auth/login", {
        email, password
      }, { withCredentials: true })

      console.log(result.data);
      localStorage.setItem("authSession", "true")
      getCurrentUser()  // ADDED: Fetch the current user data after successful login
      navigate("/")
    } catch (error) { console.log(error?.response?.data?.message || error) }
  }


  const googlelogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      if (response?.user) {
        await completeGoogleLogin(response.user)
      }

    } catch (error) {
      console.log(error?.message || error)
    }

  }


  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px]
       cursor-pointer' onClick={() => navigate('/')}>
        <img className='w-[40px]' src={logo2} alt="" />
        <h1 className='text-[22px] font-sans'>MyCart</h1>
      </div>
      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[5px]'>
        <span className='text-[25px] font-semibold'>Login Page </span>
        <span className='text-[16px]'>WellCome To MyCart Place your Order! </span>
      </div>
      <div className='max-w-[600px] w-[90%] py-8 bg-[#00000025] border-[1px] border-[96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
        <form action="" onSubmit={handleLogin} className='w-[90%] flex flex-col items-center justify-start gap-[20px]'>
          <div className='w-[100%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center
             gap-[10px] py-[20px] cursor-pointer' onClick={googlelogin}>
            <img src={googlelogo} alt="Google Logo" className='w-[25px] ' /> Login with Google </div>
          <div className='w-[100%] h-[15px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px]'>
            <div className='w-[40%] h-[1px] top-[100%] bg-[96969635]'></div> OR <div className='w-[40%] h-[1px] bg-[96969635]'></div>
          </div>
          <div className='w-[90%] flex flex-col items-center justify-center gap-[15px] relative'>


            <input type="email" placeholder='Email' className='w-[100%] h-[50px] border-[2px] border-[96969635]
                 backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' required onChange={(e) => setEmail(e.target.value)} value={email} />

            <input type={show ? "text" : "password"} placeholder='Password' className='w-[100%] h-[50px] border-[2px] border-[96969635]
                 backdrop:blur-sm rounded-lg  shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' required onChange={(e) => setPassword(e.target.value)} value={password} />

            {!show && <IoIosEye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] top-1/2 -translate-y-1/2' onClick={() => setShow(prev => !prev)} />}
            {show && <FaEyeSlash className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] top-1/2 -translate-y-1/2' onClick={() => setShow(prev => !prev)} />}

            <button className='w-[100%] h-[50px] bg-[#6060f5] flex items-center justify-center  mt-[20px] rounded-lg shadow-lg font-semibold cursor-pointer hover:bg-[#42656c80]'>Login</button>
          </div>
          <p className='flex gap-[10px] h-[20px]'>if you have no account? <span className='text-[#6060f5]  cursor-pointer hover:underline button-[50]' onClick={() => navigate('/signup')}>Create New Account</span></p>
        </form>
      </div>
    </div>

  )
}

export default login