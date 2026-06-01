import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { SiTicktick } from 'react-icons/si'
import { FaBox } from 'react-icons/fa'

function Home() {
  const { serverUrl } = useContext(authDataContext)
  const [ordersCount, setOrdersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(serverUrl + '/api/order/list', { withCredentials: true }),
          axios.get(serverUrl + '/api/product/list'),
        ])

        setOrdersCount(Array.isArray(ordersRes.data) ? ordersRes.data.length : 0)
        setProductsCount(Array.isArray(productsRes.data) ? productsRes.data.length : 0)
      } catch (err) {
        console.error('Failed to fetch counts', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [serverUrl])

  return (
    <>

      <div className='w-[99vw] min-h-[100vh]  bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] relative'>
        <Nav />
        <div className='w-full flex'>
          <Sidebar />

          <div className='w-[82%] lg:ml-[320px] md:ml-[230px] sm:ml-[100px] ml-[100px] mt-[70px] py-8 pr-6 pb-16 flex flex-col gap-6'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='text-[#9ff9f9] text-sm uppercase tracking-widest mb-1'>
                  Dashboard
                </p>
                <h1 className='text-3xl md:text-4xl font-semibold text-[#f3f9fc]'>
                  Admin Home
                </h1>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='flex items-center gap-3 px-5 py-6 rounded-xl bg-[#51808030] border border-[#9ff9f9]/30'>
                <SiTicktick className='text-[#9ff9f9] text-2xl' />
                <div>
                  <p className='text-xs text-[#aaf4e7] uppercase'>Total orders</p>
                  <p className='text-3xl font-bold text-[#f3f9fc]'>
                    {loading ? '—' : ordersCount}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 px-5 py-6 rounded-xl bg-[#51808030] border border-[#9ff9f9]/30'>
                <FaBox className='text-[#9ff9f9] text-2xl' />
                <div>
                  <p className='text-xs text-[#aaf4e7] uppercase'>Total listed items</p>
                  <p className='text-3xl font-bold text-[#f3f9fc]'>
                    {loading ? '—' : productsCount}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Home