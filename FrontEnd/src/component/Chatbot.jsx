import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdSend } from 'react-icons/md'
import { FaRobot } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa';
import axios from 'axios'
import { AuthDataContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Chatbot({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "👋 Hi! I'm your MyCart shopping assistant. Ask me about products, orders, delivery, returns, or offers.",
            sender: 'bot',
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    // product suggestions are attached to bot messages so they stay grouped
    const messagesEndRef = useRef(null)
    const { serverUrl } = useContext(AuthDataContext)
    const navigate = useNavigate()

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose?.()
        }

        if (isOpen) {
            window.addEventListener('keydown', handleEscape)
        }

        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const getLocalReply = (text) => {
        const lowerText = text.toLowerCase()

        if (lowerText.includes('order') || lowerText.includes('track')) {
            return 'Sure — I can help you with order tracking, delivery updates, and order details.'
        }

        if (lowerText.includes('return') || lowerText.includes('refund')) {
            return 'I can guide you about returns and refunds. Later, Gemini will make this even smarter.'
        }

        if (lowerText.includes('shipping') || lowerText.includes('delivery')) {
            return 'Delivery support is available. You can ask about shipping time, charges, or delivery status.'
        }

        if (lowerText.includes('payment method') || lowerText.includes('payment methods') || lowerText.includes('payment option') || lowerText.includes('payment options') || lowerText.includes('how can i pay') || lowerText.includes('which payment')) {
            return 'You can pay by Cash on Delivery (COD) or Stripe card payment.'
        }

        if (lowerText.includes('product') || lowerText.includes('price') || lowerText.includes('offer')) {
            return 'I can help you find products, compare prices, and check available offers.'
        }

        if (lowerText.includes('top rating') || lowerText.includes('top rated') || lowerText.includes('highest rated') || lowerText.includes('best rated')) {
            return 'I can fetch the top-rated products from the database and show them to you.'
        }

        return 'Thanks! This chat interface is ready, and Gemini API can be connected here next.'
    }

    const handleSendMessage = async () => {
        const trimmedValue = inputValue.trim()
        if (!trimmedValue) return

        const userMessage = {
            id: Date.now(),
            text: trimmedValue,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            const result = await axios.post(
                serverUrl + '/api/chatbot/message',
                { message: trimmedValue },
                { withCredentials: true }
            )

            const botMessage = {
                id: Date.now() + 1,
                text: result?.data?.message || getLocalReply(trimmedValue),
                sender: 'bot',
                timestamp: new Date(),
                products: result?.data?.products || [],
            }

            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
        } catch (error) {
            const botMessage = {
                id: Date.now() + 1,
                text: getLocalReply(trimmedValue),
                sender: 'bot',
                timestamp: new Date(),
                products: [],
            }

            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
            console.log('Chatbot API error:', error)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }

    const quickPrompts = [
        'Show best products',
        'Show top rated products',
        'What payment methods are available?',
        'Track my order',
        'What are your return policies?',
    ]

    const clearHistory = () => {
        // Reset messages
        setMessages([])
        // If using localStorage to persist history, remove it
        try {
            localStorage.removeItem('chat_history')
        } catch (e) {
            // ignore
        }
    }

    return (
        <div className='fixed inset-0 z-80 flex items-end justify-end bg-black/35 px-4 py-4 sm:px-6 sm:py-6'>
            <button
                type='button'
                aria-label='Close chatbot overlay'
                className='absolute inset-0 cursor-default'
                onClick={onClose}
            />

            <div className='relative z-81 flex h-[78vh] w-full max-w-105 flex-col overflow-hidden rounded-[28px] border border-[#244047] bg-[#0f1f24] text-white shadow-2xl shadow-black/40 animate-[slideUp_0.25s_ease-out]'>
                <div className='flex items-center justify-between border-b border-white/10 bg-linear-to-r from-[#1a3a40] to-[#10272d] px-5 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#90b9ff] text-[#0b1214] shadow-md'>
                            <FaRobot className='h-5 w-5' />
                        </div>
                        <div>
                            <h2 className='text-lg font-bold text-[#a5faf7]'>MyCart Assistant</h2>
                            <p className='text-xs text-blue-100/80'>Ask about shopping, delivery, or orders</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={clearHistory}
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10'
                            aria-label='Clear chat history'
                            title='Clear chat history'
                        >
                            <FaTrash className='h-4 w-4' />
                        </button>

                        <button
                            type='button'
                            onClick={onClose}
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20'
                            aria-label='Close chatbot'
                        >
                            <IoClose className='h-6 w-6' />
                        </button>
                    </div>
                </div>

                <div className='flex-1 space-y-4 overflow-y-auto bg-linear-to-b from-[#102128] to-[#0d171b] px-4 py-5'>
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-md ${message.sender === 'user'
                                    ? 'rounded-br-md bg-[#90b9ff] text-[#081014]'
                                    : 'rounded-bl-md border border-[#2c4a51] bg-[#152830] text-blue-100'
                                    }`}
                            >
                                <p>{message.text}</p>
                                <span className='mt-2 block text-[11px] opacity-70'>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Products for this message (keeps them grouped with the bot reply) */}
                            {message.products && message.products.length > 0 && (
                                <div className='mt-2 space-y-3 w-full'>
                                    {message.products.slice(0, 4).map((product) => (
                                        <button
                                            key={product.id}
                                            type='button'
                                            onClick={() => {
                                                onClose?.()
                                                navigate(`/productdetail/${product.id}`)
                                            }}
                                            className='w-full rounded-xl border border-[#2c4a51] bg-[#152830] p-3 text-left text-blue-100 transition hover:border-[#90b9ff]'
                                        >
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.name}
                                                className='mb-2 h-28 w-full rounded-lg object-cover'
                                            />
                                            <h4 className='text-sm font-semibold text-white'>{product.name}</h4>
                                            <p className='text-xs opacity-80'>
                                                {product.category} • {product.subcategory}
                                            </p>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <p className='text-xs mt-1 text-blue-100/80'>Sizes: {product.sizes.join(', ')}</p>
                                            )}
                                            <p className='mt-1 text-sm font-bold text-[#a5faf7]'>PKR {product.price}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className='flex justify-start'>
                            <div className='rounded-2xl rounded-bl-md border border-[#2c4a51] bg-[#152830] px-4 py-3 text-blue-100 shadow-md'>
                                <div className='flex items-center gap-2'>
                                    <span className='h-2.5 w-2.5 animate-bounce rounded-full bg-[#90b9ff]' />
                                    <span className='h-2.5 w-2.5 animate-bounce rounded-full bg-[#90b9ff] [animation-delay:0.12s]' />
                                    <span className='h-2.5 w-2.5 animate-bounce rounded-full bg-[#90b9ff] [animation-delay:0.24s]' />
                                </div>
                            </div>
                        </div>
                    )}


                    <div ref={messagesEndRef} />
                </div>

                <div className='border-t border-white/10 bg-[#0f1c21] px-4 py-4'>
                    <div className='mb-3 flex flex-wrap gap-2'>
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                type='button'
                                onClick={() => setInputValue(prompt)}
                                className='rounded-full border border-[#2b4750] bg-[#152830] px-3 py-1.5 text-xs text-blue-100 transition hover:border-[#90b9ff] hover:text-white'
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type='text'
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder='Type your shopping question...'
                            className='h-12 flex-1 rounded-full border border-[#2c4a51] bg-[#152830] px-4 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-[#90b9ff]'
                        />

                        <button
                            type='button'
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className='flex h-12 w-12 items-center justify-center rounded-full bg-[#90b9ff] text-[#081014] transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-[#5a6b7b] disabled:text-white'
                            aria-label='Send message'
                        >
                            <MdSend className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatbot