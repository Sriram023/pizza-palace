import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPizza } from '../api/pizzas';
import { useCart } from '../context/CartContext';
import { inr } from '../utils/format';

const SIZES = [
  { name: 'Small', mult: 0.85 },
  { name: 'Medium', mult: 1.0 },
  { name: 'Large', mult: 1.2 },
];

export default function PizzaDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addItem } = useCart();

  const [pizza, setPizza] = useState(null);

  const [size, setSize] = useState('Medium');

  const [qty, setQty] = useState(1);

  useEffect(() => {
    getPizza(id)
      .then((d) => setPizza(d.pizza))
      .catch(() => setPizza(false));
  }, [id]);

  if (pizza === null) {
    return (
      <div className="container-pp py-12 grid md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl" />

        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
        </div>
      </div>
    );
  }

  if (pizza === false) {
    return (
      <div className="container-pp py-20 text-center">
        <h1 className="text-2xl font-bold text-ink dark:text-white">
          Pizza not found
        </h1>

        <Link to="/menu" className="btn-primary mt-4 inline-flex">
          Back to menu
        </Link>
      </div>
    );
  }

  const mult = SIZES.find((s) => s.name === size).mult;

  const unit = Math.round(pizza.price * mult * 100) / 100;

  const total = Math.round(unit * qty * 100) / 100;

  const onAdd = () => {
    addItem(pizza, size, qty);

    toast.success(`Added ${qty} × ${pizza.name} (${size})`);

    navigate('/cart');
  };

  return (
    <div className="container-pp py-10">

      <Link
        to="/menu"
        className="text-sm text-ink/60 dark:text-white/60 inline-flex items-center gap-1 mb-6 hover:text-ink dark:hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to menu
      </Link>

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="card overflow-hidden">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* DETAILS */}
        <div>

          <span className="badge bg-brand-50 text-brand">
            {pizza.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 text-ink dark:text-white">
            {pizza.name}
          </h1>

          <p className="text-ink/70 dark:text-white/70 mt-3 leading-relaxed">
            {pizza.description}
          </p>

          {/* RATINGS */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-yellow-500">⭐</span>

            <span className="text-sm text-ink/70 dark:text-white/70">
              {pizza.rating || 4.5} ({pizza.reviewsCount || 100} reviews)
            </span>
          </div>

          {/* SIZE */}
          <div className="mt-6">

            <div className="text-sm font-semibold mb-2 text-ink dark:text-white">
              Size
            </div>

            <div className="flex gap-2 flex-wrap">

              {SIZES.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSize(s.name)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                    size === s.name
                      ? 'bg-ink dark:bg-white text-white dark:text-black border-ink dark:border-white'
                      : 'bg-white dark:bg-gray-900 text-ink dark:text-white border-ink/10 dark:border-white/10 hover:border-ink/30 dark:hover:border-white/30'
                  }`}
                >
                  {s.name} · {inr(pizza.price * s.mult)}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mt-6">

            <div className="text-sm font-semibold mb-2 text-ink dark:text-white">
              Quantity
            </div>

            <div className="inline-flex items-center border border-ink/10 dark:border-white/10 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">

              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/10"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>

              <span className="px-5 font-bold tabular-nums text-ink dark:text-white">
                {qty}
              </span>

              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="px-3 py-2 text-ink dark:text-white hover:bg-ink/5 dark:hover:bg-white/10"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">

            <div>
              <div className="text-xs text-ink/50 dark:text-white/50">
                Total
              </div>

              <div className="text-3xl font-extrabold text-brand">
                {inr(total)}
              </div>
            </div>

            <button
              onClick={onAdd}
              disabled={!pizza.isAvailable}
              className="btn-primary !px-6 !py-3 text-base"
            >
              <ShoppingCart size={18} />

              {pizza.isAvailable ? 'Add to cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}