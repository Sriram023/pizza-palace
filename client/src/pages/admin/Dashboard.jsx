import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Clock, Pizza, ArrowRight } from 'lucide-react';
import { allOrders } from '../../api/orders';
import { listPizzas } from '../../api/pizzas';
import { inr } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([allOrders(), listPizzas()]).then(([o, p]) => {
      setOrders(o.orders); setPizzas(p.pizzas);
    }).finally(() => setLoading(false));
  }, []);

  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.totalAmount, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter((o) => new Date(o.createdAt) >= today).length;
  const pending = orders.filter((o) => ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'].includes(o.status)).length;

  const stats = [
    { Icon: IndianRupee, label: 'Total revenue', value: inr(revenue), tone: 'bg-emerald-100 text-emerald-700' },
    { Icon: ShoppingBag, label: 'Orders today',  value: ordersToday,  tone: 'bg-brand-50 text-brand' },
    { Icon: Clock,       label: 'Active orders', value: pending,      tone: 'bg-amber-100 text-amber-700' },
    { Icon: Pizza,       label: 'Pizzas',         value: pizzas.length, tone: 'bg-ink text-white' },
  ];

  return (
    <div className="container-pp py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Admin dashboard</h1>
          <p className="text-ink/60 mt-1">Pizza Palace — control centre.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/pizzas" className="btn-ghost">Manage pizzas</Link>
          <Link to="/admin/orders" className="btn-primary">Manage orders</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ Icon, label, value, tone }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${tone}`}><Icon size={18}/></div>
            <div className="mt-3 text-2xl font-extrabold">{loading ? '—' : value}</div>
            <div className="text-sm text-ink/60">{label}</div>
          </div>
        ))}
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="p-5 border-b border-ink/5 flex items-center justify-between">
          <h2 className="font-bold">Recent orders</h2>
          <Link to="/admin/orders" className="text-brand text-sm font-semibold inline-flex items-center gap-1">
            View all <ArrowRight size={14}/>
          </Link>
        </div>
        <div className="divide-y divide-ink/5">
          {orders.slice(0, 6).map((o) => (
            <div key={o._id} className="p-4 flex items-center justify-between gap-4 text-sm">
              <span className="font-mono">#{o._id.slice(-6).toUpperCase()}</span>
              <span className="text-ink/60 truncate flex-1">{o.customerId?.name || 'Guest'}</span>
              <StatusBadge status={o.status}/>
              <span className="font-bold text-brand tabular-nums">{inr(o.totalAmount)}</span>
            </div>
          ))}
          {!loading && orders.length === 0 && (
            <div className="p-6 text-center text-ink/50 text-sm">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}