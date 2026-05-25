import { User, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {

  const { user, isAdmin } = useAuth();

  return (
    <div className="container-pp py-10 max-w-2xl">

      <div className="card p-8">

        <div className="flex flex-col items-center text-center">

          <div className="w-24 h-24 rounded-full bg-brand text-white flex items-center justify-center text-4xl font-bold shadow-glow">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <h1 className="text-3xl font-extrabold mt-5 text-ink dark:text-white">
            {user?.name}
          </h1>

          <div className="flex items-center gap-2 text-ink/60 dark:text-white/60 mt-2">
            <Mail size={16} />
            {user?.email}
          </div>

          {isAdmin && (
            <div className="mt-4 badge bg-ink text-white">
              <ShieldCheck size={14} />
              Admin Account
            </div>
          )}
        </div>

        {/* ACCOUNT INFO */}
        <div className="mt-10 grid gap-4">

          <div className="p-4 rounded-2xl bg-ink/5 dark:bg-white/5">
            <div className="text-sm text-ink/50 dark:text-white/50">
              Account Type
            </div>

            <div className="font-bold text-lg text-ink dark:text-white">
              {isAdmin ? 'Administrator' : 'Customer'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-ink/5 dark:bg-white/5">
            <div className="text-sm text-ink/50 dark:text-white/50">
              User ID
            </div>

            <div className="font-mono text-sm text-ink dark:text-white break-all">
              {user?._id}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}