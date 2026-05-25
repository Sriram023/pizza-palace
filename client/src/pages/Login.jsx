import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const to = location.state?.from || (user.role === 'admin' ? '/admin' : '/');
      navigate(to, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container-pp py-16 max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold">Sign in</h1>
        <p className="text-ink/60 text-sm mt-1">Welcome back to Pizza Palace.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Email</span>
            <input type="email" required className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Password</span>
            <input type="password" required minLength={6} className="input" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}/>
          </label>
          <button disabled={loading} className="btn-primary w-full justify-center !py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          New here? <Link to="/register" className="text-brand font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}