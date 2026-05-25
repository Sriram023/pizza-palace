import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { inr } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, updateQty, removeItem, totals } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-pp py-16 max-w-xl">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Add a hot, fresh pizza to get started."
          action={
            <Link to="/menu" className="btn-primary mt-2">
              Browse menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-pp py-10 grid lg:grid-cols-3 gap-8">

      {/* CART ITEMS */}
      <div className="lg:col-span-2 space-y-4">

        <h1 className="text-3xl font-extrabold mb-2 text-ink dark:text-white">
          Your cart
        </h1>

        {items.map((i) => (
          <div
            key={i.key}
            className="card p-4 flex gap-4 items-center transition hover:-translate-y-0.5"
          >

            {/* IMAGE */}
            <img
              src={i.imageUrl}
              alt={i.name}
              className="w-20 h-20 rounded-xl object-cover"
            />

            {/* DETAILS */}
            <div className="flex-1 min-w-0">

              <div className="font-bold truncate text-ink dark:text-white">
                {i.name}
              </div>

              <div className="text-xs text-ink/60 dark:text-white/60">
                {i.size} · {inr(i.unitPrice)} each
              </div>

              {/* QUANTITY */}
              <div className="mt-2 inline-flex items-center border border-ink/10 dark:border-white/10 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">

                <button
                  onClick={() => updateQty(i.key, i.qty - 1)}
                  className="px-2 py-1 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/10"
                  aria-label="Decrease"
                >
                  <Minus size={12} />
                </button>

                <span className="px-3 text-sm font-bold tabular-nums text-ink dark:text-white">
                  {i.qty}
                </span>

                <button
                  onClick={() => updateQty(i.key, i.qty + 1)}
                  className="px-2 py-1 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/10"
                  aria-label="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* PRICE + REMOVE */}
            <div className="text-right">

              <div className="font-extrabold text-brand">
                {inr(i.unitPrice * i.qty)}
              </div>

              <button
                onClick={() => removeItem(i.key)}
                className="text-ink/40 dark:text-white/40 hover:text-brand mt-2 transition"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <aside className="card p-6 h-fit sticky top-20">

        <h2 className="font-bold text-lg mb-4 text-ink dark:text-white">
          Order summary
        </h2>

        <Row label="Subtotal" value={inr(totals.subtotal)} />

        <Row label="Tax (5%)" value={inr(totals.tax)} />

        <Row label="Delivery" value={inr(totals.deliveryFee)} />

        <div className="border-t border-ink/10 dark:border-white/10 my-3" />

        <Row label="Total" value={inr(totals.grand)} bold />

        <Link
          to="/checkout"
          className="btn-primary w-full mt-5 justify-center"
        >
          Checkout <ArrowRight size={16} />
        </Link>
      </aside>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex justify-between text-sm py-1 ${
        bold
          ? 'font-extrabold text-base text-ink dark:text-white'
          : 'text-ink/70 dark:text-white/70'
      }`}
    >
      <span>{label}</span>

      <span className="tabular-nums">{value}</span>
    </div>
  );
}