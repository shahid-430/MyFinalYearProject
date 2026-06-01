import React, { useContext } from 'react'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { adminDataContext } from './context/AdminContext'

function App() {
let {adminData}=useContext(adminDataContext)

  return (
    <>
    { 
    !adminData ? <Login /> : <>
    <Routes>
     <Route path='/' element={<Home />} />
     <Route path='/add' element={<Add/>} />
     <Route path='/list' element={<Lists />} />
     <Route path='/order' element={<Orders />} />
     <Route path='/login' element={<Login />} />

    </Routes>
    </>
}
    </>
  )
}

export default App