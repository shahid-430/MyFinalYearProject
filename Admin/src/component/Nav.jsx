import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo1 from '../assets/logo1.png'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import BackToHomeButton from './BackToHomeButton'

function Nav() {
    const navigate = useNavigate()
    const { serverUrl } = useContext(authDataContext)
    const { getAdmin } = useContext(adminDataContext)

    // for admin logout
    const logOut = async () => {
        try {
            const result = await axios.get(serverUrl + '/api/auth/logout', { withCredentials: true })
            console.log(result.data)
            getAdmin()
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-[99vw] h-[50px] bg-[#ecfafaec] z-10 fixed top-0 flex items-center px-[30px] overflow-x-hidden shadow-md shadow-black'>
            {/* LEFT: logo */}
            <div className='flex items-center gap-4 cursor-pointer' onClick={() => navigate('/')}>
                <img src={logo1} alt='' className='w-[30px]' />
                <h1 className='text-[25px] text-[black] font-sans'>MyCart</h1>
            </div>

            {/* CENTER: Back to Home button */}
            <div className='flex-1 flex justify-center relative'>
                <BackToHomeButton />
            </div>

            {/* RIGHT: Logout */}
            <div className='flex items-center justify-end w-[30%]'>
                <button title='Click To Logout' className='text-[14px] hover:border-2 border-[#89dae] cursor-pointer bg-[#000000ca] py-2 px-4 rounded-2xl text-white shadow-md' onClick={logOut}>
                    LogOut
                </button>
            </div>
        </div>
    )
}

export default Nav