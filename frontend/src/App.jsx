import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Orders from './pages/Orders'
import { Loading } from './components/UI'
function Protected(){const {user,checking}=useAuth(),loc=useLocation();if(checking)return <Loading/>;return user?<Layout/>:<Navigate to="/login" state={{from:loc}} replace/>}
function Guest({children}){const {user,checking}=useAuth();if(checking)return <Loading/>;return user?<Navigate to="/" replace/>:children}
export default function App(){return <Routes><Route path="/login" element={<Guest><Login/></Guest>}/><Route path="/register" element={<Guest><Register/></Guest>}/><Route element={<Protected/>}><Route index element={<Dashboard/>}/><Route path="/menu" element={<Menu/>}/><Route path="/orders" element={<Orders/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
