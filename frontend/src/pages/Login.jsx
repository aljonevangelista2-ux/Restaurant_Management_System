import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChefHat, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Notice } from '../components/UI'
function messageOf(e) { return e.response?.data?.message || e.response?.data?.errors?.email?.[0] || 'Could not sign in. Check the backend and your credentials.' }
export default function Login() {
 const { login }=useAuth(), nav=useNavigate(); const [email,setEmail]=useState('admin@restaurant.test'),[password,setPassword]=useState('password'),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 async function submit(e){e.preventDefault();setError('');setBusy(true);try{await login(email,password);nav('/')}catch(err){setError(messageOf(err))}finally{setBusy(false)}}
 return <div className="auth-page"><div className="auth-art"><div className="auth-brand"><ChefHat size={28}/><span>Table & Thyme</span></div><div className="auth-copy"><span className="eyebrow">THE FLOOR, IN GOOD HANDS</span><h1>Every table.<br/>Every detail.<br/><em>In sync.</em></h1><p>A calmer way to manage your menu, orders, and daily service.</p></div><div className="art-footer">Restaurant management workspace · 2026</div></div><div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p className="muted">Use your restaurant account to continue.</p><Notice>{error}</Notice><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="btn primary full" disabled={busy}>{busy?'Signing in...':'Sign in'} <ArrowRight size={17}/></button><div className="demo-box"><strong>Demo accounts</strong><span>Admin: admin@restaurant.test</span><span>Staff: staff@restaurant.test</span><small>Password for both: password</small></div><p className="muted center">Need an account? <Link to="/register">Create staff account</Link></p></form></div></div>
}
