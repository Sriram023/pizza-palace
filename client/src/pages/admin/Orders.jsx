import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { allOrders, updateOrderStatus, deleteOrder } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';
import { inr, dateTime } from '../../utils/format';
import { Trash2 } from 'lucide-react';

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const refresh = () => allOrders().then((d) => setOrders(d.orders)).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const onStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); refresh(); }
    catch { toast.error('Update failed'); }
  };
  const onDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    try { await deleteOrder(id); toast.success('Deleted'); refresh(); }
    catch { toast.error('Delete failed'); }
  };

  const visible = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="container-pp py-10">
      <h1 className="text-3xl font-extrabold mb-6">Orders</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              filter === s ? 'bg-ink text-white border-ink' : 'bg-white text-ink/70 border-ink/10 hover:border-ink/30'
            }`}
          >{s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <div className="card p-6 text-center text-ink/50">Loading…</div>}
        {!loading && visible.length === 0 && <div className="card p-6 text-center text-ink/50">No orders.</div>}
        {visible.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-mono font-bold">#{o._id.slice(-8).toUpperCase()}</div>
                <div className="text-xs text-ink/50">{dateTime(o.createdAt)}</div>
                <div className="text-sm mt-1">
                  {o.customerId?.name} · <span className="text-ink/50">{o.customerId?.email}</span>
                </div>
              </div>
              <StatusBadge status={o.status}/>
              <div className="text-right">
                <div className="text-xs text-ink/50">Total</div>
                <div className="text-lg font-extrabold text-brand">{inr(o.totalAmount)}</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => onStatus(o._id, e.target.value)}
                  className="input !py-2 !w-auto"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => onDelete(o._id)} className="p-2 hover:bg-brand-50 hover:text-brand rounded-lg" aria-label="Delete"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="border-t border-ink/10 mt-4 pt-3 text-sm text-ink/70 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">Items</div>
                {o.items.map((i, idx) => (
                  <div key={idx}>{i.qty} × {i.name} <span className="text-ink/40">({i.size})</span></div>
                ))}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">Deliver to</div>
                <div>{o.deliveryAddress.fullName} · {o.deliveryAddress.phone}</div>
                <div>{o.deliveryAddress.line1}</div>
                <div>{o.deliveryAddress.city} — {o.deliveryAddress.pincode}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}