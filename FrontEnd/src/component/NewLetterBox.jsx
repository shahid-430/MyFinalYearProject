
import React, { useState } from 'react'

function NewLetterBox() {
    const [email, setEmail] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(email)
        alert(`Subscribed with: ${email}`)
        setEmail("")
    }

    return (
        <div className='w-full py-20 px-5 bg-gradient-to-l from-[#141414] to-[#0c2025]'>

            {/* Newsletter Card */}
            <div className='max-w-4xl mx-auto bg-[#13262c]/60 backdrop-blur-md border border-[#29444c] rounded-3xl shadow-lg px-6 md:px-12 py-14 text-center'>

                {/* Heading */}
                <h2 className='text-2xl md:text-4xl font-bold text-[#a5faf7] mb-4'>
                    Subscribe to our Newsletter
                </h2>

                {/* Subtext */}
                <p className='text-blue-100 text-sm md:text-lg max-w-2xl mx-auto mb-8 leading-7'>
                    Join our mailing list to receive updates on new arrivals,
                    exclusive offers, and get <span className='text-[#a5faf7] font-semibold'>30% OFF</span> on your first order.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className='flex flex-col md:flex-row gap-4 justify-center items-center'
                >

                    {/* Input */}
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full md:w-[380px] h-[52px] px-5 rounded-xl bg-[#1f343b] text-white placeholder:text-gray-400 border border-[#3d5961] outline-none focus:border-[#90b9ff] transition-all'
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        className='w-full md:w-auto px-8 h-[52px] rounded-xl bg-[#90b9ff] text-black font-semibold hover:scale-105 hover:bg-[#a5faf7] transition-all duration-300 shadow-md'
                    >
                        Subscribe
                    </button>

                </form>

            </div>

        </div>
    )
}

export default NewLetterBox