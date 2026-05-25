import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not register');
    }
  };

  return (
    <div className="container-pp py-16 max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="text-ink/60 text-sm mt-1">Order in seconds, save your favourites.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Full name</span>
            <input required maxLength={80} className="input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}/>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Email</span>
            <input type="email" required className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Password</span>
            <input type="password" required minLength={6} className="input" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}/>
            <span className="text-xs text-ink/50">At least 6 characters.</span>
          </label>
          <button disabled={loading} className="btn-primary w-full justify-center !py-3">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          Already have one? <Link to="/login" className="text-brand font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}