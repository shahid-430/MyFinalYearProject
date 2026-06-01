import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'

function Start({ starValue = 5, value = 0, onRate }) {
    const [rating, setRating] = useState(value)
    const [hover, setHover] = useState(0)

    useEffect(() => {
        setRating(value || 0)
    }, [value])

    return (
        <div className='flex gap-1'>
            {[...Array(starValue)].map((_, index) => {
                const starNumber = index + 1
                const activeValue = onRate ? (hover || rating) : rating
                const isFilled = starNumber <= activeValue

                return (
                    <span
                        key={starNumber}
                        onClick={() => {
                            if (!onRate) return
                            setRating(starNumber)
                            onRate(starNumber)
                        }}
                        onMouseEnter={() => onRate && setHover(starNumber)}
                        onMouseLeave={() => onRate && setHover(0)}
                        className={onRate ? 'cursor-pointer' : 'cursor-default'}
                    >
                        <FaStar className={`text-xl ${isFilled ? 'text-yellow-400' : 'text-gray-400'}`} />
                    </span>
                )
            })}
        </div>
    )
}

export default Start