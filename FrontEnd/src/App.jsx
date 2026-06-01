import React, { use, useContext } from 'react'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Login from './pages/login'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './component/Nav'
import { UserDataContext } from './context/UserContext'
import About from './pages/About'
import Contact from './pages/Contact'
import Collections from './pages/Collections'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Verify from './pages/Verify'
import OurPolicy from './component/OurPolicy'
import Orders from './pages/Orders'
import FloatingSupport from './component/FloatingSupport'

function App() {

  let { userData } = useContext(UserDataContext)

  let location = useLocation()

  return (
    <>
      {userData && <Nav />}
      <Routes>

        <Route path='/login'
          element={userData ? (<Navigate to={location.state?.from || '/'} />) : <Login />} />

        <Route path='/signup'
          element={userData ? (<Navigate to={location.state?.from || '/'} />) : <Registration />} />

        <Route path='/'
          element={userData ? <Home /> : <Navigate to="/login" state={{ from: location.pathname }} />} />


        <Route path='/orders'
          element={userData ? <Orders /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/about'
          element={userData ? <About /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/contact'
          element={userData ? <Contact /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/collections'
          element={userData ? <Collections /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/product'
          element={userData ? <Product /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/productdetail/:productId'
          element={userData ? <ProductDetail /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/cart'
          element={userData ? <Cart /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/placeorder'
          element={userData ? <PlaceOrder /> : <Navigate to="/login" state={{ from: location.pathname }} />} />

        <Route path='/verify' element={<Verify />} />

        <Route path='/privacypolicy'
          element={userData ? <OurPolicy /> : <Navigate to="/login" state={{ from: location.pathname }} />} />


      </Routes>

      {/* Global floating support buttons */}
      <FloatingSupport />


    </>
  )
}

export default App