import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthDataContext } from './AuthContext'
import { UserDataContext } from './UserContext'
import axios from 'axios'

export const ShopDataContext = createContext()

function ShopContext({ children }) {

    let [products, setProducts] = useState([])
    let [search, setSearch] = useState("")
    let [showSearch, setShowSearch] = useState(false)

    let { serverUrl } = useContext(AuthDataContext)
    let { userData } = useContext(UserDataContext)

    let [cartItem, setCartItem] = useState({})

    // yahan {} ki jagah [] use nahi hota

    let [currency] = useState("PKR")
    let [delivery_Charges] = useState(100)

    const getProducts = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/product/list")
            console.log(result.data)
            setProducts(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    // addtoCart function

    const addtoCart = async (itemId, size) => {

        if (!size) {
            console.log("Select Product Size")
            return
        }

        // clone cart object
        let cartData = structuredClone(cartItem)

        if (cartData[itemId]) {

            if (cartData[itemId][size]) {

                cartData[itemId][size] += 1

            } else {

                cartData[itemId][size] = 1
            }

        } else {

            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        setCartItem(cartData)


        if (userData) {

            try {

                let result = await axios.post(serverUrl + '/api/cart/add', { itemId, size }, { withCredentials: true })
                console.log(result.data)


            } catch (error) {

                console.log(error)


            }


        }



    }

    //get user cart function 
    const getUserCart = async () => {
        if (!userData) {
            return
        }

        try {


            const result = await axios.post(serverUrl + '/api/cart/get', {}, { withCredentials: true })
            setCartItem(result.data)
        } catch (error) {
            console.log(error)


        }

    }



    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItem);
        cartData[itemId][size] = quantity
        setCartItem(cartData)

        if (userData) {

            try {
                await axios.post(serverUrl + '/api/cart/update', { itemId, size, quantity }, { withCredentials: true })


            } catch (error) {
                console.log(error)


            }
        }
    }

    // cart count function


    const getCartCount = () => {

        let totalCount = 0

        for (const items in cartItem) {

            for (const item in cartItem[items]) {

                try {

                    if (cartItem[items][item] > 0) {

                        totalCount += cartItem[items][item]
                    }

                } catch (error) {
                    console.log(error)
                }
            }
        }

        return totalCount
    }



    const getCartAmount = () => {

        let totalAmount = 0

        for (const productId in cartItem) {
            const itemInfo = products.find((product) => product._id === productId)
            if (!itemInfo) continue

            for (const size in cartItem[productId]) {
                try {
                    const quantity = cartItem[productId][size]
                    if (quantity > 0) {
                        totalAmount += itemInfo.price * quantity
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }

        return totalAmount;

    }






    useEffect(() => {
        getProducts()
    }, [])


    useEffect(() => {
        if (userData) {
            getUserCart()
        } else {
            setCartItem({})
        }
    }, [userData])





    const value = {
        products,
        currency,
        delivery_Charges,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addtoCart,
        getCartCount,
        setCartItem,
        getProducts,
        updateQuantity,
        getCartAmount,
    }

    return (
        <ShopDataContext.Provider value={value}>
            {children}
        </ShopDataContext.Provider>
    )
}

export default ShopContext