import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Receipt,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { motion } from 'framer-motion';

import { useCart } from '../context/CartContext';

import { placeOrder } from '../api/orders';

import {
  createRazorpayOrder,
  verifyPayment,
} from '../api/payment';

import { inr } from '../utils/format';

export default function Checkout() {

  const { items, totals, clear } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  const change = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.value,
    }));

  // PAYMENT + ORDER
  const submit = async (e) => {

    e.preventDefault();

    if (items.length === 0) {
      return navigate('/menu');
    }

    try {

      setLoading(true);

      // CREATE RAZORPAY ORDER
      const razorpayOrder = await createRazorpayOrder(
        totals.grand
      );

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: 'Pizza Palace',

        description: 'Fresh Pizza Order Payment ',

        order_id: razorpayOrder.id,

        image:
          'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',

        theme: {
          color: '#e63946',
        },

        prefill: {
          name: form.fullName,
          contact: form.phone,
        },

        notes: {
          address: form.line1,
        },

        handler: async function (response) {

          try {

            // VERIFY PAYMENT
            await verifyPayment(response);

            // PLACE ORDER
            const payload = {

              items: items.map((i) => ({
                pizza: i.pizzaId,
                size: i.size,
                qty: i.qty,
              })),

              deliveryAddress: form,
            };

            const { order } = await placeOrder(payload);

            clear();

            setOrderId(order._id);

            toast.success(
              'Payment successful '
            );

          } catch (err) {

            console.error(err);

            toast.error(
              'Payment verification failed'
            );
          }
        },

        modal: {

          ondismiss: function () {

            toast.error(
              'Payment cancelled'
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'Payment failed'
      );

    } finally {

      setLoading(false);
    }
  };

  // SUCCESS PAGE
  if (orderId) {

    return (

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container-pp py-20 max-w-lg"
      >

        <div className="card p-10 text-center">

          <motion.div
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mx-auto"
          >
            <CheckCircle2 size={32} />
          </motion.div>

          <h1 className="text-2xl font-extrabold mt-4 text-ink dark:text-white">
            Order placed!
          </h1>

          <p className="text-ink/60 dark:text-white/60 mt-2">
            Order id:{' '}
            <span className="font-mono text-ink dark:text-white">
              {orderId.slice(-8).toUpperCase()}
            </span>
          </p>

          <p className="text-ink/60 dark:text-white/60 mt-1 text-sm">
            We'll have it at your door in ~30 minutes.
          </p>

          <div className="flex gap-3 mt-6 justify-center">

            <Link to="/orders" className="btn-primary">
              View my orders
            </Link>

            <Link to="/menu" className="btn-ghost">
              Order more
            </Link>

          </div>
        </div>
      </motion.div>
    );
  }

  return (

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pp py-10 grid lg:grid-cols-3 gap-8"
    >

      {/* FORM */}
      <form
        onSubmit={submit}
        className="lg:col-span-2 card p-6 space-y-4"
      >

        <h1 className="text-2xl font-extrabold text-ink dark:text-white">
          Delivery details
        </h1>

        <Field
          icon={User}
          label="Full name"
          value={form.fullName}
          onChange={change('fullName')}
          required
          maxLength={80}
        />

        <Field
          icon={Phone}
          label="Phone number"
          value={form.phone}
          onChange={change('phone')}
          required
          pattern="[0-9+\- ]{7,15}"
        />

        <Field
          icon={MapPin}
          label="Address"
          value={form.line1}
          onChange={change('line1')}
          required
          maxLength={200}
        />

        <div className="grid grid-cols-2 gap-4">

          <Field
            label="City"
            value={form.city}
            onChange={change('city')}
            required
            maxLength={60}
          />

          <Field
            label="Pincode"
            value={form.pincode}
            onChange={change('pincode')}
            required
            pattern="[0-9]{4,8}"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="btn-primary w-full justify-center !py-3 text-base"
        >
          {loading
            ? 'Opening payment gateway...'
            : `Pay ${inr(totals.grand)}`}
        </motion.button>
      </form>

      {/* SUMMARY */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-6 h-fit sticky top-20"
      >

        <div className="flex items-center gap-2 mb-4">

          <Receipt
            size={20}
            className="text-brand"
          />

          <h2 className="font-bold text-lg text-ink dark:text-white">
            Order summary
          </h2>
        </div>

        {items.map((i) => (
          <div
            key={i.key}
            className="flex justify-between text-sm py-2 gap-3"
          >

            <span className="text-ink/70 dark:text-white/70 truncate pr-2">
              {i.qty} × {i.name}{' '}
              <span className="text-ink/40 dark:text-white/40">
                ({i.size})
              </span>
            </span>

            <span className="tabular-nums text-ink dark:text-white font-semibold">
              {inr(i.unitPrice * i.qty)}
            </span>
          </div>
        ))}

        <div className="border-t border-ink/10 dark:border-white/10 my-3" />

        <Row label="Subtotal" value={inr(totals.subtotal)} />

        <Row label="Tax (5%)" value={inr(totals.tax)} />

        <Row label="Delivery" value={inr(totals.deliveryFee)} />

        <div className="border-t border-ink/10 dark:border-white/10 my-3" />

        <Row
          bold
          label="Total"
          value={inr(totals.grand)}
        />
      </motion.aside>
    </motion.div>
  );
}

// FIELD
function Field({ label, icon: Icon, ...props }) {

  return (

    <label className="block">

      <span className="block text-sm font-semibold mb-1.5 text-ink dark:text-white">
        {label}
      </span>

      <div className="relative">

        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40"
          />
        )}

        <input
          className={`input ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </label>
  );
}

// ROW
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

      <span className="tabular-nums">
        {value}
      </span>
    </div>
  );
}