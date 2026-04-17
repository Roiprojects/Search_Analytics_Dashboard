"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh(); // Force a refresh to ensure middleware checks the new cookie
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password");
        setLoading(false);
      }
    } catch (err) {
      setError("An network error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30">
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-multiply dark:bg-blue-500/5" />
      </div>

      <button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Admin Access</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter your password to manage the dashboard. (Hint: 'admin123')</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all font-medium disabled:opacity-50"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white py-3 rounded-xl font-bold shadow-sm transition-all mt-4 group"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                Login to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
