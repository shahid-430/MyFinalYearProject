import React, { use, useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopDataContext } from '../context/ShopContext'
import Card from './Card'

function bestSeller() {

    let { products } = useContext(ShopDataContext)

    let [bestSeller, setBestSeller] = useState([])
    useEffect(() => {
        let filteredProducts = products.filter((item) => item.bestseller === true)
        setBestSeller(filteredProducts.slice(0, 100))
    }, [products])



    return (
        <div>

            <div className='h-[8%] w-[100%] text-center md:mt-[50px]'>
                <Title text1={"Best"} text2={"Sellers"} />
                <p className='w-[100%] mx-auto text-[13px] md:text-[20px] px-[10px] text-blue-100 text-center '>
                    Explore our best-selling products, loved by customers worldwide.
                </p>

                <div className='w-[100%] h-[50%]  mt-[30px] flex items-center justify-center gap-[50px] flex-wrap'>

                    {

                        bestSeller.map((item, index) => (
                            <Card key={index} name={item.name} image={item.image1} id={item._id} price={item.price} ratingAverage={item.ratingAverage} ratingCount={item.ratingCount} />
                        ))

                    }

                </div>


            </div>

        </div>
    )
}

export default bestSeller