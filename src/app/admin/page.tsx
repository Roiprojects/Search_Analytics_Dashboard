"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, Database, Search, MapPin, MousePointerClick, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationData {
  name: string;
  searches: number;
}

interface DashboardData {
  keyword: string;
  report_label: string;
  main_title: string;
  sub_title: string;
  keyword_label: string;
  searches_label: string;
  locations_label: string;
  breakdown_title: string;
  footer_text: string;
  license_text: string;
  locations: LocationData[];
}

export default function AdminPanel() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>({ 
    keyword: "", 
    report_label: "",
    main_title: "",
    sub_title: "",
    keyword_label: "",
    searches_label: "",
    locations_label: "",
    breakdown_title: "",
    footer_text: "",
    license_text: "",
    locations: [] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          locations: data.locations.map(l => ({
            ...l,
            searches: Number(l.searches) 
          }))
        })
      });
      if (res.ok) {
        setStatus('success');
        alert("✅ Dashboard successfully updated!");
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const err = await res.json();
        alert("❌ Failed to save: " + (err.error || "Server error"));
        setStatus('error');
      }
    } catch (e) {
      alert("❌ Error: Could not reach the server.");
      setStatus('error');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const updateLocation = (index: number, field: 'name' | 'searches', value: string | number) => {
    const newLocs = [...data.locations];
    newLocs[index] = { ...newLocs[index], [field]: value };
    setData({ ...data, locations: newLocs });
  };

  const removeLocation = (index: number) => {
    const newLocs = [...data.locations];
    newLocs.splice(index, 1);
    setData({ ...data, locations: newLocs });
  };

  const addLocation = () => {
    setData({
      ...data,
      locations: [...data.locations, { name: "", searches: 0 }]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-800 animate-spin dark:border-zinc-800 dark:border-t-zinc-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
            <Database className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none">Settings Workspace</h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">Data Source Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border-r border-zinc-200 dark:border-zinc-800 pr-4"
          >
            <ArrowLeft className="w-4 h-4" /> Live Preview
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors mr-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all"
          >
            {saving ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 pb-32">
        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="text-sm font-bold">Successfully saved</p>
                <p className="text-sm opacity-90">Dashboard data has been updated and is live.</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-bold">Failed to save</p>
                <p className="text-sm opacity-90">Please check your network and try again.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Content & Labels Control */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Visual & Content Control</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Main Title</label>
                <input 
                  type="text" 
                  value={data.main_title}
                  onChange={(e) => setData({ ...data, main_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Report Label</label>
                <input 
                  type="text" 
                  value={data.report_label}
                  onChange={(e) => setData({ ...data, report_label: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Subtitle / Description</label>
                <textarea 
                  value={data.sub_title}
                  onChange={(e) => setData({ ...data, sub_title: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Keyword UI Label</label>
                <input 
                  type="text" 
                  value={data.keyword_label}
                  onChange={(e) => setData({ ...data, keyword_label: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Search UI Label</label>
                <input 
                  type="text" 
                  value={data.searches_label}
                  onChange={(e) => setData({ ...data, searches_label: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Location UI Label</label>
                <input 
                  type="text" 
                  value={data.locations_label}
                  onChange={(e) => setData({ ...data, locations_label: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Footer Brand Name</label>
                <input 
                  type="text" 
                  value={data.footer_text}
                  onChange={(e) => setData({ ...data, footer_text: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">License Text</label>
                <input 
                  type="text" 
                  value={data.license_text}
                  onChange={(e) => setData({ ...data, license_text: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm"
                />
              </div>
            </div>
          </section>

          {/* Targeted Keyword Section */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Main Data Keyword</h2>
            </div>
            
            <div className="space-y-2 max-w-2xl">
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Target Search Query</label>
              <input 
                type="text" 
                value={data.keyword}
                onChange={(e) => setData({ ...data, keyword: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all font-medium text-lg placeholder:text-zinc-400"
                placeholder="e.g. Best Hospital In Bangalore"
              />
            </div>
          </section>

          {/* Locations Section */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Location Metrics</h2>
                  <p className="text-xs text-zinc-500 font-medium">Core statistics for the regions list.</p>
                </div>
              </div>
              
              <button 
                onClick={addLocation}
                className="flex items-center justify-center gap-2 text-sm bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-zinc-900/10 dark:shadow-none"
              >
                <Plus className="w-4 h-4" /> Add New Region
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {data.locations.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-zinc-50 dark:bg-zinc-900/50"
                  >
                    <MousePointerClick className="w-10 h-10 text-zinc-300" />
                    <p className="text-zinc-500 font-medium">No locations tracking data available.</p>
                  </motion.div>
                )}
                
                {data.locations.map((loc, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl items-start sm:items-center relative group transition-colors hover:border-zinc-300 dark:hover:border-zinc-600"
                  >
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Area Region</label>
                      <input 
                        type="text" 
                        value={loc.name}
                        onChange={(e) => updateLocation(idx, 'name', e.target.value)}
                        placeholder="e.g. Indiranagar"
                        className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium transition-all"
                      />
                    </div>
                    <div className="w-full sm:w-1/3 min-w-[140px] space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Search Volume</label>
                      <input 
                        type="number" 
                        value={loc.searches === 0 ? '' : loc.searches}
                        onChange={(e) => updateLocation(idx, 'searches', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium tabular-nums transition-all"
                      />
                    </div>
                    
                    <button 
                      onClick={() => removeLocation(idx)}
                      className="mt-6 sm:mt-7 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2.5 rounded-xl transition-all active:scale-95 absolute sm:static right-2 top-0"
                      title="Remove Region"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
