import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import PrivateRoutes from './PrivateRoutes'
const AllRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<PrivateRoutes><Home /></PrivateRoutes>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
        </Routes>
    )
}

export default AllRoutes