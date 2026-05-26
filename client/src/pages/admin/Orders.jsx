import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  Trash2,
  PackageCheck,
  Clock3,
  Truck,
  CircleDollarSign,
} from 'lucide-react';

import {
  allOrders,
  updateOrderStatus,
  deleteOrder,
} from '../../api/orders';

import StatusBadge from '../../components/StatusBadge';
import { inr, dateTime } from '../../utils/format';

const STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // =========================================
  // FETCH ORDERS
  // =========================================

  const refresh = () =>
    allOrders()
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const onStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      toast.success('Order status updated');

      refresh();
    } catch {
      toast.error('Failed to update order');
    }
  };

  // =========================================
  // DELETE ORDER
  // =========================================

  const onDelete = async (id) => {

    if (!confirm('Delete this order permanently?')) return;

    try {

      await deleteOrder(id);

      toast.success('Order deleted');

      refresh();

    } catch {

      toast.error('Delete failed');
    }
  };

  // =========================================
  // FILTER
  // =========================================

  const visible =
    filter === 'All'
      ? orders
      : orders.filter((o) => o.status === filter);

  // =========================================
  // STATS
  // =========================================

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.totalAmount, 0);

  const activeOrders = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery'].includes(
      o.status
    )
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === 'Delivered'
  ).length;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container-pp py-10">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-extrabold text-ink dark:text-white">
          Orders management
        </h1>

        <p className="mt-1 text-ink/60 dark:text-white/60">
          Track, manage and update customer orders in real-time.
        </p>

      </div>

      {/* TOP STATS */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        {/* TOTAL REVENUE */}

        <div
          className="
            rounded-3xl
            p-5
            border border-ink/5
            bg-white
            shadow-sm

            dark:bg-[#0f172a]
            dark:border-white/10
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              grid place-items-center

              bg-emerald-100
              text-emerald-700

              dark:bg-emerald-500/15
              dark:text-emerald-400
            "
          >
            <CircleDollarSign size={20} />
          </div>

          <div className="mt-4 text-3xl font-extrabold text-ink dark:text-white">
            {inr(totalRevenue)}
          </div>

          <div className="text-sm text-ink/60 dark:text-white/60">
            Total revenue
          </div>

        </div>

        {/* ACTIVE ORDERS */}

        <div
          className="
            rounded-3xl
            p-5
            border border-ink/5
            bg-white
            shadow-sm

            dark:bg-[#0f172a]
            dark:border-white/10
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              grid place-items-center

              bg-amber-100
              text-amber-700

              dark:bg-amber-500/15
              dark:text-amber-400
            "
          >
            <Clock3 size={20} />
          </div>

          <div className="mt-4 text-3xl font-extrabold text-ink dark:text-white">
            {activeOrders}
          </div>

          <div className="text-sm text-ink/60 dark:text-white/60">
            Active orders
          </div>

        </div>

        {/* DELIVERED */}

        <div
          className="
            rounded-3xl
            p-5
            border border-ink/5
            bg-white
            shadow-sm

            dark:bg-[#0f172a]
            dark:border-white/10
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              grid place-items-center

              bg-sky-100
              text-sky-700

              dark:bg-sky-500/15
              dark:text-sky-400
            "
          >
            <PackageCheck size={20} />
          </div>

          <div className="mt-4 text-3xl font-extrabold text-ink dark:text-white">
            {deliveredOrders}
          </div>

          <div className="text-sm text-ink/60 dark:text-white/60">
            Delivered orders
          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-6">

        {['All', ...STATUSES].map((s) => (

          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`
              px-4 py-2 rounded-2xl
              text-sm font-semibold
              transition-all duration-300

              ${
                filter === s
                  ? `
                    bg-brand
                    text-white
                    shadow-lg shadow-brand/25
                  `
                  : `
                    bg-white
                    text-ink/70
                    border border-ink/10

                    hover:border-brand/30
                    hover:text-brand

                    dark:bg-[#0f172a]
                    dark:text-white/70
                    dark:border-white/10
                  `
              }
            `}
          >
            {s}
          </button>
        ))}

      </div>

      {/* ORDERS */}

      <div className="space-y-5">

        {loading && (

          <div
            className="
              rounded-3xl
              p-8
              text-center

              bg-white
              border border-ink/5

              dark:bg-[#0f172a]
              dark:border-white/10
              dark:text-white/50
            "
          >
            Loading orders...
          </div>
        )}

        {!loading && visible.length === 0 && (

          <div
            className="
              rounded-3xl
              p-8
              text-center

              bg-white
              border border-ink/5

              dark:bg-[#0f172a]
              dark:border-white/10
              dark:text-white/50
            "
          >
            No orders found.
          </div>
        )}

        {visible.map((o) => (

          <div
            key={o._id}
            className="
              rounded-3xl
              p-6

              bg-white
              border border-ink/5
              shadow-sm

              dark:bg-[#0f172a]
              dark:border-white/10
            "
          >

            {/* TOP */}

            <div className="flex items-start justify-between flex-wrap gap-5">

              {/* LEFT */}

              <div>

                <div className="font-mono font-bold text-lg text-ink dark:text-white">
                  #{o._id.slice(-8).toUpperCase()}
                </div>

                <div className="text-xs mt-1 text-ink/50 dark:text-white/50">
                  {dateTime(o.createdAt)}
                </div>

                <div className="mt-3 text-sm text-ink dark:text-white">
                  {o.customerId?.name}

                  <span className="text-ink/50 dark:text-white/50">
                    {' '}
                    · {o.customerId?.email}
                  </span>
                </div>

              </div>

              {/* STATUS */}

              <StatusBadge status={o.status} />

              {/* TOTAL */}

              <div className="text-right">

                <div className="text-xs text-ink/50 dark:text-white/50">
                  Total amount
                </div>

                <div className="text-3xl font-extrabold text-brand mt-1">
                  {inr(o.totalAmount)}
                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex items-center gap-2">

                <select
                  value={o.status}
                  onChange={(e) =>
                    onStatus(o._id, e.target.value)
                  }
                  className="
                    px-4 py-3
                    rounded-2xl
                    outline-none

                    bg-white
                    border border-ink/10
                    text-ink

                    dark:bg-[#111827]
                    dark:border-white/10
                    dark:text-white
                  "
                >

                  {STATUSES.map((s) => (
                    <option key={s}>
                      {s}
                    </option>
                  ))}

                </select>

                <button
                  onClick={() => onDelete(o._id)}
                  className="
                    p-3
                    rounded-2xl

                    text-red-500

                    hover:bg-red-500/10
                    transition-all duration-300
                  "
                  aria-label="Delete"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

            {/* DETAILS */}

            <div
              className="
                mt-6
                pt-6
                border-t border-ink/10

                dark:border-white/10

                grid md:grid-cols-2 gap-8
              "
            >

              {/* ITEMS */}

              <div>

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    mb-3

                    text-ink/40
                    dark:text-white/40
                  "
                >
                  Ordered items
                </div>

                <div className="space-y-2">

                  {o.items.map((i, idx) => (

                    <div
                      key={idx}
                      className="
                        flex items-center justify-between

                        text-sm
                        text-ink dark:text-white
                      "
                    >

                      <span>
                        {i.qty} × {i.name}

                        <span className="text-ink/40 dark:text-white/40">
                          {' '}
                          ({i.size})
                        </span>
                      </span>

                      <span className="font-semibold text-brand">
                        {inr(i.priceAtOrder * i.qty)}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

              {/* DELIVERY */}

              <div>

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-widest
                    mb-3

                    text-ink/40
                    dark:text-white/40
                  "
                >
                  Delivery address
                </div>

                <div className="space-y-2 text-sm text-ink dark:text-white">

                  <div className="font-semibold">
                    {o.deliveryAddress.fullName}
                  </div>

                  <div className="flex items-center gap-2 text-ink/70 dark:text-white/70">
                    <Truck size={14} />
                    {o.deliveryAddress.phone}
                  </div>

                  <div className="text-ink/70 dark:text-white/70">
                    {o.deliveryAddress.line1}
                  </div>

                  <div className="text-ink/70 dark:text-white/70">
                    {o.deliveryAddress.city} —{' '}
                    {o.deliveryAddress.pincode}
                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
