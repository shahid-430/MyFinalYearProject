import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaArrowUp } from 'react-icons/fa'

export default function BackToHomeButton() {
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)

    // hide the button on the Home page (path = '/')
    const isHome = location?.pathname === '/' || location?.pathname === ''

    if (isHome) return null

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 100)
        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <button
            onClick={() => navigate('/')}
            title='Back to Admin Home'
            className={`absolute left-1/2 top-full z-50 translate-x-[40%] -translate-y-6 inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-600 text-black font-semibold rounded-full shadow-lg transform transition-all hover:scale-105`}
        >
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-teal-700 ${scrolled ? 'animate-pulse' : ''}`}>
                <FaArrowUp />
            </span>
            <span className='whitespace-nowrap'>Back to Home</span>
        </button>
    )
}
