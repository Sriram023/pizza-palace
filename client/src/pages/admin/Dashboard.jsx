import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  Pizza,
  ArrowRight
} from 'lucide-react';

import { allOrders } from '../../api/orders';
import { listPizzas } from '../../api/pizzas';
import { inr } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([allOrders(), listPizzas()])
      .then(([o, p]) => {
        setOrders(o.orders);
        setPizzas(p.pizzas);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.totalAmount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) >= today
  ).length;

  const pending = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'].includes(
      o.status
    )
  ).length;

  const stats = [
    {
      Icon: IndianRupee,
      label: 'Total revenue',
      value: inr(revenue),
      tone:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
    },

    {
      Icon: ShoppingBag,
      label: 'Orders today',
      value: ordersToday,
      tone:
        'bg-brand-50 text-brand dark:bg-brand/15 dark:text-brand'
    },

    {
      Icon: Clock,
      label: 'Active orders',
      value: pending,
      tone:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
    },

    {
      Icon: Pizza,
      label: 'Pizzas',
      value: pizzas.length,
      tone:
        'bg-ink text-white dark:bg-white/10 dark:text-white'
    },
  ];

  return (
    <div className="container-pp py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-extrabold text-ink dark:text-white">
            Admin dashboard
          </h1>

          <p className="text-ink/60 dark:text-white/60 mt-1">
            Pizza Palace — control centre.
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            to="/admin/pizzas"
            className="
              px-5 py-3 rounded-2xl
              border border-ink/10
              bg-white
              text-ink
              font-semibold
              transition-all duration-300

              hover:scale-[1.02]
              hover:shadow-lg

              dark:bg-[#111827]
              dark:border-white/10
              dark:text-white
            "
          >
            Manage pizzas
          </Link>

          <Link
            to="/admin/orders"
            className="
              px-5 py-3 rounded-2xl
              bg-brand
              text-white
              font-semibold
              shadow-lg shadow-brand/20
              transition-all duration-300

              hover:scale-[1.02]
              hover:shadow-brand/40
            "
          >
            Manage orders
          </Link>

        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {stats.map(({ Icon, label, value, tone }) => (

          <div
            key={label}
            className="
              rounded-3xl
              border border-ink/5
              bg-white
              p-6
              shadow-sm
              transition-all duration-300

              hover:-translate-y-1
              hover:shadow-2xl

              dark:bg-[#0f172a]
              dark:border-white/10
            "
          >

            <div
              className={`w-12 h-12 rounded-2xl grid place-items-center ${tone}`}
            >
              <Icon size={20} />
            </div>

            <div className="mt-5 text-3xl font-extrabold text-ink dark:text-white">
              {loading ? '—' : value}
            </div>

            <div className="text-sm mt-1 text-ink/60 dark:text-white/60">
              {label}
            </div>

          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div
        className="
          mt-8
          rounded-3xl
          overflow-hidden
          border border-ink/5
          bg-white

          dark:bg-[#0f172a]
          dark:border-white/10
        "
      >

        {/* TOP */}
        <div
          className="
            p-5
            border-b border-ink/5
            dark:border-white/10

            flex items-center justify-between
          "
        >

          <h2 className="font-bold text-lg text-ink dark:text-white">
            Recent orders
          </h2>

          <Link
            to="/admin/orders"
            className="
              text-brand
              text-sm
              font-semibold
              inline-flex
              items-center
              gap-1

              hover:gap-2
              transition-all duration-300
            "
          >
            View all
            <ArrowRight size={14} />
          </Link>

        </div>

        {/* ORDERS */}
        <div className="divide-y divide-ink/5 dark:divide-white/10">

          {orders.slice(0, 6).map((o) => (

            <div
              key={o._id}
              className="
                p-5
                flex items-center justify-between gap-4
                text-sm

                hover:bg-black/[0.02]
                dark:hover:bg-white/[0.03]

                transition-all duration-300
              "
            >

              <span className="font-mono font-bold text-ink dark:text-white">
                #{o._id.slice(-6).toUpperCase()}
              </span>

              <span className="truncate flex-1 text-ink/60 dark:text-white/60">
                {o.customerId?.name || 'Guest'}
              </span>

              <StatusBadge status={o.status} />

              <span className="font-extrabold text-brand tabular-nums">
                {inr(o.totalAmount)}
              </span>

            </div>
          ))}

          {!loading && orders.length === 0 && (
            <div className="p-8 text-center text-sm text-ink/50 dark:text-white/50">
              No orders yet.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
