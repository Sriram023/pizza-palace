import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Flame, Clock, Leaf, Award, ArrowRight, Star } from 'lucide-react';
import { listPizzas } from '../api/pizzas';
import PizzaCard from '../components/PizzaCard';
import PizzaCardSkeleton from '../components/PizzaCardSkeleton';

const categories = [
  { name: 'Veg',       img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', tag: 'Garden fresh' },
  { name: 'Non-Veg',   img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600', tag: 'Meat lovers' },
  { name: 'Specialty', img: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tag: "Chef's picks" },
];

const testimonials = [
  { name: 'Aarav S.',   text: 'Best wood-fired crust in the city. Hot, fast and addictive.', rating: 5 },
  { name: 'Meera K.',   text: 'The Truffle Mushroom is restaurant-quality. Will reorder weekly.', rating: 5 },
  { name: 'Rohan P.',   text: 'Tracked my order live and it arrived in 28 minutes. Top notch.', rating: 4 },
];

export default function Home() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    listPizzas({ available: 'true' })
      .then((d) => setFeatured(d.pizzas.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cream via-cream to-brand-50" />
        <div className="container-pp py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge bg-brand-50 text-brand mb-4">
              <Flame size={12}/> Hot from the stone oven
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]  text-ink/90">
              Pizza that arrives <span className="text-brand">hot</span>,
              <br/> not just delivered.
            </h1>
            <p className="mt-5 text-lg text-ink/70">
              Hand-tossed dough, San Marzano sauce and ingredients we'd serve our family.
              30-minute delivery, every time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary text-base">
                Order now <ArrowRight size={16}/>
              </Link>
              <Link to="/menu" className="btn-ghost text-base">View menu</Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink/60">
              <span className="flex items-center gap-2"><Clock size={16} className="text-brand"/> 30-min delivery</span>
              <span className="flex items-center gap-2"><Award size={16} className="text-brand"/> 10k+ happy customers</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2rem] bg-white dark:bg-gray-900 shadow-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000"
                alt="Hot pizza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 card px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-white grid place-items-center font-bold">4.9</div>
              <div className="text-sm"><div className="font-semibold">Rated excellent</div><div className="text-ink/50 dark:text-white/50 text-xs">2,341 reviews</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-pp py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold">This week's favourites</h2>
            <p className="text-ink/60 dark:text-white/60 mt-1">Three pizzas our customers can't stop reordering.</p>
          </div>
          <Link to="/menu" className="text-brand font-semibold hidden sm:inline-flex items-center gap-1">
            See all <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured === null
            ? Array.from({ length: 3 }).map((_, i) => <PizzaCardSkeleton key={i}/>)
            : featured.map((p) => <PizzaCard key={p._id} pizza={p}/>)
          }
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-pp py-12">
        <h2 className="text-3xl font-extrabold mb-8">Browse by category</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/menu?cat=${encodeURIComponent(c.name)}`}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] group"
            >
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"/>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs opacity-80">{c.tag}</div>
                <div className="text-2xl font-extrabold">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="container-pp py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">Why Pizza Palace</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Flame, t: 'Stone-baked', d: '900°F ovens for that perfect leopard char.' },
            { Icon: Clock, t: '30-min promise', d: 'Hot to your door, or your next slice is on us.' },
            { Icon: Leaf,  t: 'Real ingredients', d: 'No preservatives. Daily fresh dough.' },
            { Icon: Award, t: 'Loved by 10k+', d: 'Highest rated pizzeria in the neighbourhood.' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-brand text-white grid place-items-center mb-4"><Icon size={22}/></div>
              <h3 className="font-bold">{t}</h3>
              <p className="text-sm text-ink/60 dark:text-white/60 mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-pp py-16">
        <h2 className="text-3xl font-extrabold mb-10 text-center">What our customers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
              </div>
              <p className="mt-3 text-ink/80 dark:text-white/80">"{t.text}"</p>
              <div className="mt-4 font-semibold">{t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}