// ==========================================
// FILE PATH:
// client/src/pages/Menu.jsx
// ==========================================

import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, PizzaIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { listPizzas } from '../api/pizzas';
import PizzaCard from '../components/PizzaCard';
import PizzaCardSkeleton from '../components/PizzaCardSkeleton';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Specialty'];

export default function Menu() {
  const [params, setParams] = useSearchParams();

  const initialCat = params.get('cat') || 'All';

  const [pizzas, setPizzas] = useState(null);

  const [search, setSearch] = useState('');

  const [category, setCategory] = useState(initialCat);

  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const searchRef = useRef(null);

  useEffect(() => {
    setPizzas(null);

    listPizzas()
      .then((d) => setPizzas(d.pizzas))
      .catch(() => setPizzas([]));
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(params);

    if (category === 'All') {
      p.delete('cat');
    } else {
      p.set('cat', category);
    }

    setParams(p, { replace: true });
  }, [category]); // eslint-disable-line

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    if (!pizzas) return;

    const matches = pizzas
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(matches);

  }, [search, pizzas]);

  const filtered = useMemo(() => {
    if (!pizzas) return null;

    return pizzas.filter((p) => {

      if (category !== 'All' && p.category !== category) return false;

      if (onlyAvailable && !p.isAvailable) return false;

      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase())
      ) return false;

      return true;
    });

  }, [pizzas, category, search, onlyAvailable]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container-pp py-10"
    >

      {/* TOP SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between flex-wrap gap-4 mb-6"
      >

        <div>
          <motion.h1
  initial={{
    opacity: 0,
    x: -40,
    rotate: -2,
  }}
  animate={{
    opacity: 1,
    x: 0,
    rotate: 0,
  }}
  transition={{
    duration: 0.6,
    type: 'spring',
    stiffness: 120,
  }}
  whileHover={{
    scale: 1.03,
  }}
  className="text-3xl font-extrabold text-ink dark:text-white"
>
  Our menu
</motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ink/60 dark:text-white/60 mt-1"
          >
            Hand-tossed, oven-fresh — pick your favourite.
          </motion.p>
        </div>

        {/* SEARCH */}
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          whileFocus={{ scale: 1.02 }}
          className="relative w-full sm:w-80"
        >

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40 z-10"
          />

          <motion.input
             whileFocus={{
             scale: 1.03,
              boxShadow: '0px 0px 30px rgba(230,57,70,0.35)',
            }}
            whileHover={{
             scale: 1.01,
           }}
             transition={{
            duration: 0.2,
            }}
            transition={{ duration: 0.2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas…"
            className="input pl-9"
            aria-label="Search pizzas"
          />

          {/* SUGGESTIONS */}
          <AnimatePresence>
            {suggestions.length > 0 && (

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-ink/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20"
              >

                {suggestions.map((pizza, index) => (

                  <motion.button
                    key={pizza._id}
                    type="button"

                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}

                    whileHover={{
                      x: 4,
                      backgroundColor: 'rgba(230,57,70,0.05)',
                    }}

                    onClick={() => {
                      navigate(`/menu/${pizza._id}`);
                      setSuggestions([]);
                      setSearch('');
                    }}

                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition"
                  >

                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      src={pizza.imageUrl}
                      alt={pizza.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">

                      <div className="font-semibold text-ink dark:text-white truncate">
                        {pizza.name}
                      </div>

                      <div className="text-xs text-ink/50 dark:text-white/50">
                        {pizza.category}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between gap-3 mb-6 flex-wrap"
      >

        <div className="flex flex-wrap gap-2">

          {CATEGORIES.map((c, index) => (

            <motion.button
              key={c}

              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{
                delay: index * 0.05,
              }}

              whileHover={{
                scale: 1.06,
                y: -2,
              }}

              whileTap={{
                scale: 0.95,
              }}

              onClick={() => setCategory(c)}

              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
                category === c
                  ? 'bg-brand text-black border-brand shadow-glow'
                  : 'bg-white text-ink/70 dark:text-black/70 border-ink/10 dark:border-white/10 hover:border-ink/30'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>

        <motion.label
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2 text-sm text-ink/70 dark:text-white/70 cursor-pointer select-none"
        >

          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="accent-brand w-4 h-4"
          />

          Available only
        </motion.label>
      </motion.div>

      {/* CONTENT */}
      {filtered === null ? (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >

          {Array.from({ length: 6 }).map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}

        </motion.div>

      ) : filtered.length === 0 ? (

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >

          <EmptyState
            icon={PizzaIcon}
            title="No pizzas match your filters"
            message="Try a different category or search term."
          />

        </motion.div>

      ) : (

        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >

          <AnimatePresence>

            {filtered.map((p) => (

              <motion.div
                key={p._id}
                layout

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}

                transition={{
                  duration: 0.3,
                }}
              >

                <PizzaCard pizza={p} />

              </motion.div>
            ))}

          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}