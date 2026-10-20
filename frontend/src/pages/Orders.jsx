import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { Loading, Notice, Pagination, SearchBox, Modal } from '../components/UI'
import { Status } from './Dashboard'

const money = n => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0)
const nextStatus = { pending: ['preparing', 'cancelled'], preparing: ['ready', 'cancelled'], ready: ['completed'], completed: [], cancelled: [] }
const emptyForm = () => ({ customer_name: '', table_number: '', notes: '', items: [{ menu_item_id: '', quantity: 1 }] })

export default function Orders() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [orders, setOrders] = useState([]), [menu, setMenu] = useState([]), [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1), [search, setSearch] = useState(''), [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [success, setSuccess] = useState('')
  const [modal, setModal] = useState(false), [editing, setEditing] = useState(null), [busy, setBusy] = useState(false), [form, setForm] = useState(emptyForm)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/orders', { params: { page, search, status } })
      .then(r => { setOrders(r.data.data); setMeta(r.data.meta) })
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false))
  }, [page, search, status])
  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null); setForm(emptyForm()); setError(''); setModal(true)
    api.get('/menu-items', { params: { available: true, page: 1 } }).then(r => setMenu(r.data.data)).catch(() => setError('Could not load menu items.'))
  }
  function openEdit(order) {
    setEditing(order); setError(''); setModal(true)
    setForm({ customer_name: order.customer_name, table_number: order.table_number || '', notes: order.notes || '', items: (order.items || []).map(i => ({ menu_item_id: String(i.menu_item_id), quantity: i.quantity })) })
    api.get('/menu-items', { params: { available: true, page: 1 } }).then(r => {
      const available = r.data.data
      setMenu([...available, ...(order.items || []).filter(i => !available.some(m => m.id === i.menu_item_id)).map(i => ({ id: i.menu_item_id, name: `${i.name} (unavailable)`, price: i.unit_price }))])
    }).catch(() => setError('Could not load menu items.'))
  }
  function updateLine(index, key, value) {
    setForm(old => ({ ...old, items: old.items.map((item, i) => i === index ? { ...item, [key]: value } : item) }))
  }
  async function save(e) {
    e.preventDefault(); setError(''); setSuccess('')
    if (!form.customer_name.trim() || form.items.some(i => !i.menu_item_id || Number(i.quantity) < 1)) {
      setError('Enter the customer name and choose a menu item and quantity for each line.'); return
    }
    setBusy(true)
    const payload = { ...form, items: form.items.map(i => ({ ...i, menu_item_id: Number(i.menu_item_id), quantity: Number(i.quantity) })) }
    try {
      if (editing) await api.put(`/orders/${editing.id}`, payload)
      else await api.post('/orders', payload)
      setModal(false); setSuccess(editing ? `Order #${editing.id} updated.` : 'Order created successfully.')
      setPage(1); if (page === 1) load()
    } catch (e) {
      setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat()[0] || `Could not ${editing ? 'update' : 'create'} order.`)
    } finally { setBusy(false) }
  }
  async function changeStatus(order, newStatus) {
    setError(''); setSuccess('')
    try { await api.patch(`/orders/${order.id}/status`, { status: newStatus }); setSuccess(`Order #${order.id} moved to ${newStatus}.`); load() }
    catch (e) { setError(e.response?.data?.message || 'Could not update order status.') }
  }
  async function remove(order) {
    if (!window.confirm(`Delete order #${order.id} for ${order.customer_name}?`)) return
    setError(''); setSuccess('')
    try { await api.delete(`/orders/${order.id}`); setSuccess('Order deleted.'); load() }
    catch (e) { setError(e.response?.data?.message || 'Only admin can delete orders.') }
  }

  return <>
    <div className="welcome-row"><div><h2>Orders</h2><p className="muted">{isAdmin ? 'Manage orders and keep service moving.' : 'Create orders and follow each one through service.'}</p></div><button className="btn primary" onClick={openCreate}><Plus size={17}/> New order</button></div>
    <Notice type="success">{success}</Notice><Notice>{error}</Notice>
    <div className="filters"><SearchBox value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search customer or order number..."/><select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}><option value="">All statuses</option>{['pending', 'preparing', 'ready', 'completed', 'cancelled'].map(s => <option key={s}>{s}</option>)}</select></div>
    {loading ? <Loading label="Loading orders..."/> : <>
      <div className="content-card"><div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER / TABLE</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th><th>UPDATE STATUS</th><th>ACTIONS</th></tr></thead><tbody>
        {orders.map(o => {
          const canEdit = ['pending', 'preparing'].includes(o.status)
          const statuses = (nextStatus[o.status] || []).filter(s => s !== 'cancelled' || isAdmin)
          return <tr key={o.id}><td className="order-number">#{String(o.id).padStart(4, '0')}<small className="table-sub">{new Date(o.created_at).toLocaleDateString()}</small></td><td><strong>{o.customer_name}</strong><small className="table-sub">Table {o.table_number || '—'}</small></td><td>{o.items?.map(i => `${i.quantity}× ${i.name}`).join(', ') || '—'}</td><td>{money(o.total)}</td><td><Status status={o.status}/></td><td><select className="status-select" value="" onChange={e => e.target.value && changeStatus(o, e.target.value)} disabled={!statuses.length}><option value="">{statuses.length ? 'Move to...' : 'Finished'}</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></td><td><div className="actions">{canEdit && <button className="icon-btn" title="Edit order" onClick={() => openEdit(o)}><Pencil size={16}/></button>}{isAdmin && <button className="icon-btn danger" title="Delete order" onClick={() => remove(o)}><X size={16}/></button>}</div></td></tr>
        })}
      </tbody></table></div>{orders.length === 0 && <div className="empty">No orders match these filters.</div>}</div><Pagination meta={meta} onPage={setPage}/>
    </>}
    {modal && <Modal title={editing ? `Edit order #${editing.id}` : 'Create new order'} onClose={() => setModal(false)}><form className="stack-form" onSubmit={save}><Notice>{error}</Notice><label>Customer name<input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} required maxLength="120" placeholder="e.g. Maria Santos"/></label><div className="form-row"><label>Table number<input value={form.table_number} onChange={e => setForm({ ...form, table_number: e.target.value })} maxLength="20" placeholder="e.g. 4"/></label><label>Notes<input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional"/></label></div><div className="section-heading"><h3>Order items</h3><button type="button" className="btn light small" onClick={() => setForm({ ...form, items: [...form.items, { menu_item_id: '', quantity: 1 }] })}><Plus size={15}/> Add line</button></div>{form.items.map((line, i) => <div className="order-line" key={i}><select required value={line.menu_item_id} onChange={e => updateLine(i, 'menu_item_id', e.target.value)}><option value="">Choose menu item</option>{menu.map(m => <option value={m.id} key={m.id}>{m.name} — {money(m.price)}</option>)}</select><input aria-label="Quantity" type="number" min="1" max="100" value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)} required/><button type="button" className="icon-btn danger" onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== i) })} disabled={form.items.length === 1}><X size={16}/></button></div>)}<div className="modal-actions"><button type="button" className="btn light" onClick={() => setModal(false)}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Create order'}</button></div></form></Modal>}
  </>
}
