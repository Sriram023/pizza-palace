import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cancelOrder } from '../api/orders';
import {
  Receipt,
  Clock3,
  PackageCheck,
  Pizza,
} from 'lucide-react';

import { myOrders } from '../api/orders';

import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

import { inr, dateTime } from '../utils/format';
import { Download } from 'lucide-react';
import { generateInvoice } from '../utils/generateInvoice';
export default function MyOrders() {

  const [orders, setOrders] = useState(null);
  const handleCancel = async (id) => {

  try {

    await cancelOrder(id);

    setOrders((prev) =>
      prev.map((o) =>
        o._id === id
          ? { ...o, status: 'Cancelled' }
          : o
      )
    );

    toast.success('Order cancelled');

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      'Could not cancel order'
    );
  }
};

  useEffect(() => {
    myOrders()
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]));
  }, []);

  /* LOADING */
  if (orders === null) {
    return (
      <div className="container-pp py-10 space-y-4">

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="card p-6 skeleton h-32"
          />
        ))}
      </div>
    );
  }

  /* EMPTY */
  if (orders.length === 0) {
    return (
      <div className="container-pp py-16 max-w-xl">

        <EmptyState
          icon={Receipt}
          title="No orders yet"
          message="When you place your first order, it'll show up here."
          action={
            <Link to="/menu" className="btn-primary mt-2">
              Order now
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-pp py-10">

      {/* HEADING */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-2xl bg-brand text-white grid place-items-center shadow-glow">
          <Pizza size={22} />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-ink dark:text-white">
            My orders
          </h1>

          <p className="text-sm text-ink/60 dark:text-white/60 mt-1">
            Track all your delicious pizza orders 🍕
          </p>
        </div>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">

        {orders.map((o) => (

          <div
            key={o._id}
            className="card p-5 transition hover:-translate-y-0.5"
          >

            {/* TOP */}
            <div className="flex items-center justify-between flex-wrap gap-3">

              {/* LEFT */}
              <div>

                <div className="text-xs text-ink/50 dark:text-white/50">
                  Order
                </div>

                <div className="font-mono font-bold text-lg text-ink dark:text-white">
                  #{o._id.slice(-8).toUpperCase()}
                </div>

                <div className="text-xs text-ink/50 dark:text-white/50 mt-1 flex items-center gap-1">

                  <Clock3 size={12} />

                  {dateTime(o.createdAt)}
                </div>
              </div>

              {/* STATUS */}
              <StatusBadge status={o.status} />

              {/* RIGHT */}
              <div className="text-right">

                <div className="text-xs text-ink/50 dark:text-white/50">
                  Total
                </div>

                <div className="text-2xl font-extrabold text-brand">
                  {inr(o.totalAmount)}
                </div>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border-t border-ink/10 dark:border-white/10 mt-4 pt-3 space-y-2">

              {o.items.map((i, idx) => (

                <div
                  key={idx}
                  className="flex justify-between items-center gap-3 text-sm"
                >

                  {/* LEFT */}
                  <div className="text-ink/70 dark:text-white/70">

                    <span className="font-semibold">
                      {i.qty} ×
                    </span>{' '}

                    {i.name}{' '}

                    <span className="text-ink/40 dark:text-white/40">
                      ({i.size})
                    </span>
                  </div>

                  {/* RIGHT */}
                  <span className="tabular-nums text-ink dark:text-white font-medium">
                    {inr(i.priceAtOrder * i.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">

  <button
    onClick={() => generateInvoice(o)}
    className="text-sm px-4 py-2 rounded-xl border border-brand/20 text-brand hover:bg-brand/10 transition inline-flex items-center gap-2"
  >
    <Download size={14} />
    Invoice
  </button>

  {o.status === 'Pending' && (
    <button
      onClick={() => handleCancel(o._id)}
      className="text-sm px-4 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
    >
      Cancel order
    </button>
  )}
</div>
              <div className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">

                <PackageCheck size={14} />

                {o.status === 'Delivered'
                  ? 'Delivered successfully'
                  : 'Your order is being prepared'}
              </div>

              {/* CANCEL BUTTON BONUS */}
              {o.status === 'Pending' && (
                <button
                 onClick={() => handleCancel(o._id)} className="text-sm px-4 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition">
                  Cancel order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}