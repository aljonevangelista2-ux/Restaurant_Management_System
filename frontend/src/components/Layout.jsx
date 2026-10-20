import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ChefHat, LayoutDashboard, Utensils, ClipboardList, LogOut, CircleUserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  async function handleLogout() { await logout(); navigate('/login') }
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-icon"><ChefHat size={22}/></div><div><strong>Table & Thyme</strong><small>Restaurant workspace</small></div></div><div className="nav-label">WORKSPACE</div><nav><NavLink to="/" end><LayoutDashboard size={18}/>Dashboard</NavLink><NavLink to="/menu"><Utensils size={18}/>Menu items</NavLink><NavLink to="/orders"><ClipboardList size={18}/>Orders</NavLink></nav><div className="sidebar-bottom"><div className="user-mini"><CircleUserRound size={31}/><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div><button className="logout-btn" onClick={handleLogout}><LogOut size={17}/>Sign out</button></div></aside><main className="main"><header className="topbar"><div><span className="eyebrow">RESTAURANT OPERATIONS</span><h1>Good service starts here.</h1></div><span className="date-pill">Management portal</span></header><div className="page-content"><Outlet/></div></main></div>
}
