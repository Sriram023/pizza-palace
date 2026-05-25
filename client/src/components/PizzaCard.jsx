// ==========================================
// FILE PATH:
// client/src/components/PizzaCard.jsx
// ==========================================

import { Link } from 'react-router-dom';
import { Plus, Leaf, Drumstick, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { inr } from '../utils/format';
import { motion } from 'framer-motion';

const catIcon = {
  Veg: Leaf,
  'Non-Veg': Drumstick,
  Specialty: Sparkles,
};

export default function PizzaCard({ pizza }) {
  const { addItem } = useCart();

  const Icon = catIcon[pizza.category] || Leaf;

  const onAdd = (e) => {
    e.preventDefault();

    if (!pizza.isAvailable) return;

    addItem(pizza, 'Medium', 1);

    toast.success(`${pizza.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="h-full"
    >
      <Link
        to={`/menu/${pizza._id}`}
        className="card group overflow-hidden flex flex-col h-full transition-all duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 dark:bg-white/5">

          {/* IMAGE */}
          <motion.img
            src={pizza.imageUrl}
            alt={pizza.name}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />

          {/* CATEGORY BADGE */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 left-3 badge bg-white/95 dark:bg-gray-900/95 text-ink dark:text-white shadow-md"
          >
            <Icon size={12} /> {pizza.category}
          </motion.span>

          {/* UNAVAILABLE */}
          {!pizza.isAvailable && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 right-3 badge bg-ink dark:bg-white text-white dark:text-black"
            >
              Unavailable
            </motion.span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex-1 flex flex-col">

          {/* TITLE + PRICE */}
          <div className="flex items-start justify-between gap-3">

            <h3 className="font-bold text-ink dark:text-white leading-tight text-lg">
              {pizza.name}
            </h3>

            <motion.span
              whileHover={{ scale: 1.08 }}
              className="font-extrabold text-brand whitespace-nowrap"
            >
              {inr(pizza.price)}
            </motion.span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-ink/60 dark:text-white/60 mt-1 line-clamp-2">
            {pizza.description}
          </p>

          {/* RATINGS */}
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 mt-3"
          >
            <span className="text-yellow-500 text-base">⭐</span>

            <span className="text-sm text-ink/70 dark:text-white/70">
              {pizza.rating || 4.5} ({pizza.reviewsCount || 100} reviews)
            </span>
          </motion.div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0px 10px 25px rgba(230,57,70,0.35)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            disabled={!pizza.isAvailable}
            className="btn-primary mt-4 self-start"
          >
            <Plus size={16} /> Add to cart
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}