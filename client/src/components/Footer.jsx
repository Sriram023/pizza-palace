import { Pizza, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream/90">
      <div className="container-pp py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg text-white">
            <span className="w-9 h-9 rounded-xl bg-brand grid place-items-center"><Pizza size={18}/></span>
            Pizza Palace
          </div>
          <p className="mt-3 text-sm text-cream/60 max-w-xs">
            Hand-tossed pizzas baked in stone ovens, delivered hot to your door.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Visit us</h4>
          <p className="text-sm flex items-start gap-2"><MapPin size={16} className="mt-0.5"/> 24 Brick Oven Lane, Bengaluru 560001</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <p className="text-sm flex items-center gap-2"><Phone size={16}/> +91 98765 43210</p>
          <p className="text-sm flex items-center gap-2 mt-1"><Mail size={16}/> hello@pizzapalace.test</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Hours</h4>
          <p className="text-sm">Mon–Sun · 11:00 am – 11:30 pm</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Pizza Palace — Student project.
      </div>
    </footer>
  );
}