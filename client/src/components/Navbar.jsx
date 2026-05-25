import { Link, NavLink, useNavigate } from 'react-router-dom';

import {
  ShoppingCart,
  User,
  LogOut,
  Pizza,
  ShieldCheck,
  Home,
  Menu,
  ClipboardList,
  Moon,
  Sun,
  X,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {

  const { user, isAdmin, logout } = useAuth();

  const { totals } = useCart();

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-brand'
        : 'text-ink/70 dark:text-white/70 hover:text-ink dark:hover:text-white'
    }`;

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-cream/85 dark:bg-gray-900/90 backdrop-blur-xl border-b border-ink/5 dark:border-white/10">

        <div className="container-pp flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-lg dark:text-white transition hover:scale-[1.02]"
          >
            <span className="w-9 h-9 rounded-xl bg-brand text-white grid place-items-center shadow-glow">
              <Pizza size={18} />
            </span>

            Pizza <span className="text-brand">Palace</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">

            <NavLink to="/" end className={linkCls}>
              Home
            </NavLink>

            <NavLink to="/menu" className={linkCls}>
              Menu
            </NavLink>

            {user && (
              <NavLink to="/orders" className={linkCls}>
                My Orders
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={linkCls}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2">

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden btn-ghost !px-3 !py-2 dark:text-white hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Menu size={20} />
            </button>

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="btn-ghost !px-3 !py-2 dark:text-white hover:rotate-180 transition-all duration-500"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>

            {/* CART */}
            <Link
              to="/cart"
              className="relative btn-ghost !px-3 !py-2 dark:text-white hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />

              {totals.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 12,
                  }}
                  className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center"
                >
                  {totals.count}
                </motion.span>
              )}
            </Link>

            {/* USER NAME DESKTOP */}
            {user && (
              <>
                {isAdmin && (
                  <span className="hidden sm:inline-flex badge bg-ink dark:bg-white dark:text-black text-white">
                    <ShieldCheck size={12} />
                    Admin
                  </span>
                )}

                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-ink/70 dark:text-white/70 hover:text-brand transition-all duration-300"
                >
                  <User size={16} />
                  {user.name.split(' ')[0]}
                </Link>
              </>
            )}

            {!user && (
              <Link to="/login" className="btn-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>

        {mobileOpen && (

          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* SIDEBAR */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 18,
              }}
              className="fixed top-0 right-0 h-full w-72 bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl border-l border-black/10 dark:border-white/10 z-50 md:hidden shadow-2xl"
            >

              {/* HEADER */}
              <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10">

                <div className="flex items-center gap-2 font-extrabold text-lg dark:text-white">

                  <span className="w-9 h-9 rounded-xl bg-brand text-white grid place-items-center shadow-glow">
                    <Pizza size={18} />
                  </span>

                  Pizza <span className="text-brand">Palace</span>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost !px-3 !py-2 dark:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* USER INFO */}
              {user && (
                <div className="px-5 py-4 border-b border-black/10 dark:border-white/10">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>

                    <div>
                      <div className="font-bold dark:text-white">
                        {user.name}
                      </div>

                      <div className="text-sm text-ink/60 dark:text-white/60">
                        Welcome back 🍕
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LINKS */}
              <div className="flex flex-col p-4 gap-2">

                <MobileLink
                  to="/"
                  icon={<Home size={18} />}
                  text="Home"
                  setMobileOpen={setMobileOpen}
                />

                <MobileLink
                  to="/menu"
                  icon={<Menu size={18} />}
                  text="Menu"
                  setMobileOpen={setMobileOpen}
                />

                {user && (
                  <MobileLink
                    to="/orders"
                    icon={<ClipboardList size={18} />}
                    text="My Orders"
                    setMobileOpen={setMobileOpen}
                  />
                )}

                <MobileLink
                  to="/profile"
                  icon={<User size={18} />}
                  text="Profile"
                  setMobileOpen={setMobileOpen}
                />

                {isAdmin && (
                  <MobileLink
                    to="/admin"
                    icon={<ShieldCheck size={18} />}
                    text="Admin"
                    setMobileOpen={setMobileOpen}
                  />
                )}

                <div className="border-t border-black/10 dark:border-white/10 my-2" />

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileLink({ to, icon, text, setMobileOpen }) {

  return (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          isActive
            ? 'bg-brand text-white shadow-glow'
            : 'text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10'
        }`
      }
    >
      {icon}
      {text}
    </NavLink>
  );
}
