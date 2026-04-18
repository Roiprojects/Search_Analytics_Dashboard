"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';

interface LocationData {
  name: string;
  searches: number;
}

interface DashboardData {
  keyword: string;
  locations: LocationData[];
}

// Elegant, professional color palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl space-y-4">
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
            <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center">Error loading dashboard.</div>;

  const totalSearches = data.locations.reduce((acc, curr) => acc + curr.searches, 0);

  return (
    <>
      <main className="h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 px-2 md:px-4 py-2 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-multiply dark:bg-blue-500/5" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-multiply dark:bg-emerald-500/5" />
        </div>

        <motion.div 
          className="w-full space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-blue-200 dark:border-blue-500/30">
                  SEO Marketing Report
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 mt-1">
                Search Analytics
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-sm max-w-xl">
                Analyzing local search volume distribution for primary keywords.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
              >
                Export PDF
              </button>
              <Link 
                href="/admin" 
                className="inline-flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white rounded-xl shadow-sm hover:shadow transition-all duration-200 group"
                title="Settings"
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            
            {/* Top Metric Cards */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300">
              <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-20 h-20" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Targeted Keyword
              </p>
              <h2 className="text-xl sm:text-2xl font-black mb-2 leading-tight tracking-tight">"{data.keyword}"</h2>
              
              <div className="mt-auto">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">Total Google Searches <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg></p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{totalSearches.toLocaleString()}</span>
                  <span className="text-emerald-500 flex items-center font-semibold text-sm"><TrendingUp className="w-3.5 h-3.5 mr-1"/> High Volume</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-center items-start hover:border-emerald-500/30 transition-colors duration-300">
               <div className="p-2.5 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl mb-3">
                  <Users className="w-6 h-6" />
               </div>
               <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Active Locations</p>
               <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{data.locations.length}</h3>
               <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-xs leading-relaxed">
                 Regions currently tracked and mapped for this keyword.
               </p>
            </motion.div>

            {/* Bottom Row: Chart & List */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm animate-in fade-in flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.locations}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="searches"
                    stroke="none"
                    className="drop-shadow-sm"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {data.locations.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="transition-all duration-300 hover:opacity-80 outline-none" 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toLocaleString()} searches`, 'Volume']}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      color: '#fff',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      fontWeight: '500'
                    }}
                    itemStyle={{ color: '#e4e4e7', fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3 sm:p-4 shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-sm font-bold mb-2 flex items-center justify-between">
                Location Breakdown
                <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">{totalSearches} searches</span>
              </h3>
              
              <div className="flex flex-col gap-1.5 flex-grow justify-start">
                {data.locations.map((loc, index) => {
                  const percentage = ((loc.searches / totalSearches) * 100).toFixed(1);
                  
                  return (
                    <div key={index} className="group relative px-2.5 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300 overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-5 sm:opacity-10 dark:opacity-20 transition-all duration-500 ease-out group-hover:w-full w-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 truncate">{loc.name}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{percentage}%</span>
                        </div>
                        <span className="font-bold text-sm tabular-nums tracking-tight" style={{ color: COLORS[index % COLORS.length] }}>{loc.searches.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
      <footer className="fixed bottom-0 w-full py-2 px-6 flex justify-between items-center text-[10px] text-zinc-400 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 pointer-events-none">
        <div className="flex gap-4">
          <span>&copy; 2024 Search Analytics Dashboard</span>
          <span>Standard License</span>
        </div>
        <div>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Data Sync Active
          </span>
        </div>
      </footer>
    </>
  );
}
