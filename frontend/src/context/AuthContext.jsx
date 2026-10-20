import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  useEffect(() => {
    const expired = () => { setUser(null); setChecking(false) }
    window.addEventListener('auth-expired', expired)
    const token = localStorage.getItem('restaurant_token')
    if (!token) { setChecking(false); return () => window.removeEventListener('auth-expired', expired) }
    api.get('/user').then(r => setUser(r.data.user)).catch(() => { localStorage.removeItem('restaurant_token'); setUser(null) }).finally(() => setChecking(false))
    return () => window.removeEventListener('auth-expired', expired)
  }, [])
  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    localStorage.setItem('restaurant_token', data.token); setUser(data.user); return data.user
  }
  async function register(form) {
    const { data } = await api.post('/register', form)
    localStorage.setItem('restaurant_token', data.token); setUser(data.user); return data.user
  }
  async function logout() {
    try { await api.post('/logout') } finally { localStorage.removeItem('restaurant_token'); setUser(null) }
  }
  return <AuthContext.Provider value={{ user, checking, login, register, logout }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
