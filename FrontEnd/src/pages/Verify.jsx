import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthDataContext } from '../context/AuthContext'
import axios from 'axios'
import { ShopDataContext } from '../context/ShopContext'
import Start from '../component/Start'
import { toast } from 'react-toastify'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const { serverUrl } = useContext(AuthDataContext)
    const navigate = useNavigate()
    const { products, getProducts } = useContext(ShopDataContext)
    const [order, setOrder] = useState(null)
    const [ratings, setRatings] = useState({})
    const [submittedRatings, setSubmittedRatings] = useState({})
    const [loading, setLoading] = useState(true)

    const productById = useMemo(() => {
        const map = new Map()
        products.forEach((product) => map.set(String(product._id), product))
        return map
    }, [products])

    useEffect(() => {
        const verify = async () => {
            try {
                const result = await axios.post(serverUrl + '/api/order/verify', { success, orderId }, { withCredentials: true })
                if (String(success) === 'true') {
                    setOrder(result.data.order)
                } else {
                    navigate('/')
                }
            } catch (err) {
                console.error(err)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        verify()
    }, [navigate, orderId, serverUrl, success])

    const getOrderItems = () => {
        if (!order?.items) return []

        const uniqueItems = new Map()

        order.items.forEach((item) => {
            const productId = String(item._id || item.id)
            if (!uniqueItems.has(productId)) {
                uniqueItems.set(productId, {
                    ...item,
                    productId,
                    product: productById.get(productId),
                })
            }
        })

        return Array.from(uniqueItems.values())
    }

    const handleSubmitRating = async (productId) => {
        const rating = ratings[productId]

        if (!rating) {
            toast.error('Please select a rating first')
            return
        }

        try {
            const result = await axios.post(
                serverUrl + `/api/product/rate/${productId}`,
                { rating, orderId },
                { withCredentials: true }
            )

            setSubmittedRatings((prev) => ({ ...prev, [productId]: true }))
            setOrder((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    items: prev.items.map((item) =>
                        String(item._id || item.id) === String(productId)
                            ? { ...item, ...result.data.product }
                            : item
                    ),
                }
            })
            getProducts()
            toast.success('Rating saved')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Rating failed')
        }
    }

    const orderItems = getOrderItems()
    const allRated = orderItems.length > 0 && orderItems.every((item) => submittedRatings[item.productId])

    return (
        <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white px-4 py-10'>
            {loading ? (
                <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>Verifying payment...</div>
                </div>
            ) : (
                <div className='mx-auto w-full max-w-5xl pt-16'>
                    <div className='rounded-2xl border border-[#2f4b52] bg-[#11181d] p-6 shadow-lg'>
                        <h1 className='text-2xl font-bold text-[#a5faf7]'>Order successful</h1>
                        <p className='mt-2 text-sm text-slate-300'>Thank you for your order. Please rate the products you purchased.</p>
                        <p className='mt-3 text-sm text-slate-400'>Order ID: <span className='break-all text-white'>{orderId}</span></p>
                    </div>

                    <div className='mt-6 grid gap-4'>
                        {orderItems.map((item) => {
                            const currentProduct = item.product || item
                            const currentRating = ratings[item.productId] || 0
                            const alreadySubmitted = submittedRatings[item.productId]

                            return (
                                <div key={item.productId} className='rounded-2xl border border-[#2f4b52] bg-[#11181d] p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                    <div className='flex items-center gap-4'>
                                        <img
                                            src={currentProduct.image1}
                                            alt={currentProduct.name}
                                            className='h-20 w-20 rounded-xl object-cover border border-[#2f4b52]'
                                        />
                                        <div>
                                            <h2 className='text-lg font-semibold text-white'>{currentProduct.name}</h2>
                                            <p className='text-sm text-slate-400'>Price: {currentProduct.price}</p>
                                            <div className='mt-2 flex items-center gap-2'>
                                                <Start value={Number(currentProduct.ratingAverage || 0)} starValue={5} />
                                                <span className='text-sm text-slate-300'>
                                                    {Number(currentProduct.ratingAverage || 0).toFixed(1)} ({currentProduct.ratingCount || 0})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-start gap-3 md:items-end'>
                                        {!alreadySubmitted ? (
                                            <>
                                                <Start
                                                    value={currentRating}
                                                    starValue={5}
                                                    onRate={(value) => setRatings((prev) => ({ ...prev, [item.productId]: value }))}
                                                />
                                                <button
                                                    className='rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700'
                                                    onClick={() => handleSubmitRating(item.productId)}
                                                >
                                                    Submit rating
                                                </button>
                                            </>
                                        ) : (
                                            <p className='rounded-lg bg-emerald-600/20 px-4 py-2 text-emerald-300'>Thanks for rating this item</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className='mt-6 flex justify-center gap-3'>
                        <button
                            className='rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-slate-200'
                            onClick={() => navigate('/orders')}
                        >
                            Go to orders
                        </button>
                        {allRated && (
                            <button
                                className='rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700'
                                onClick={() => navigate('/')}
                            >
                                Continue shopping
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Verify
