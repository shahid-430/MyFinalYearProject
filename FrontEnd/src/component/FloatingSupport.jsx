import React, { useState } from 'react'
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa'
import Chatbot from './Chatbot'

function FloatingSupport() {
    const [isChatOpen, setIsChatOpen] = useState(false)

    return (
        <>
            {/*
                            Default (mobile): place buttons slightly higher to avoid overlapping bottom-fixed cart/buttons.
                            On md+ screens keep original bottom-right placement.
                        */}
            <div className='fixed bottom-20 md:bottom-5 right-4 md:right-5 z-50 flex flex-col items-end gap-3'>
                <div className='group relative flex items-center justify-center'>
                    <div className='pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1f343b] px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/30 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'>
                        How I can help you
                    </div>

                    <button
                        type='button'
                        aria-label='Open shopping assistant'
                        title='How I can help you'
                        onClick={() => setIsChatOpen(true)}
                        className='flex h-9 w-9 md:h-11 md:w-11 cursor-pointer items-center justify-center rounded-full bg-[#1f343b] text-white shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#2d4a55] animate-pulse'
                    >
                        <FaCommentDots className='h-4 w-4 md:h-5 md:w-5' />
                    </button>
                </div>

                <div className='group relative flex items-center justify-center'>
                    <div className='pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1f343b] px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/30 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2'>
                        contact with us
                    </div>

                    <a
                        href='https://wa.me/923416788430'
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Chat with us on WhatsApp'
                        title='contact with us'
                        className='flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#1fa855] animate-pulse'
                    >
                        <FaWhatsapp className='h-5 w-5 md:h-6 md:w-6' />
                    </a>
                </div>
            </div>

            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    )
}

export default FloatingSupport