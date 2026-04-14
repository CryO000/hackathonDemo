import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Thermometer, Wind, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { SoilModel } from '../components/SoilModel';
import { mockSoilData, suggestionMessages } from '../services/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', moisture: 40 },
  { name: 'Tue', moisture: 30 },
  { name: 'Wed', moisture: 45 },
  { name: 'Thu', moisture: 50 },
  { name: 'Fri', moisture: 55 },
  { name: 'Sat', moisture: 48 },
  { name: 'Sun', moisture: 52 },
];

export default function Dashboard() {
  const currentField = mockSoilData[0]; // Displaying first field for overview

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Real-time soil monitoring powered by copernicus</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
              +2.5% <ArrowUpRight className="h-3 w-3 ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Soil Moisture</h3>
          <p className="text-2xl font-bold text-slate-900">{currentField.moisture}%</p>
          <p className="text-xs text-slate-400 mt-1">Optimal Range: 40-60%</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Thermometer className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-slate-600 flex items-center bg-slate-100 px-2 py-1 rounded-full">
              Stable
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Temperature</h3>
          <p className="text-2xl font-bold text-slate-900">{currentField.temperature}°C</p>
          <p className="text-xs text-slate-400 mt-1">Daily Avg: 22°C</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wind className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-red-600 flex items-center bg-red-50 px-2 py-1 rounded-full">
              -5% <ArrowUpRight className="h-3 w-3 ml-1 rotate-180" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Nitrogen Levels</h3>
          <p className="text-2xl font-bold text-slate-900">{currentField.nitrogen} ppm</p>
          <p className="text-xs text-slate-400 mt-1">Requires Attention</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
             <span className="text-xs font-medium text-slate-600 flex items-center bg-slate-100 px-2 py-1 rounded-full">
              3 New
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Active Alerts</h3>
          <p className="text-2xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-400 mt-1">View details below</p>
        </motion.div>
      </div>

      {/* Middle Section: 3D Model & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Model Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Soil Structure Visualization</h2>
          <div className="flex-1 min-h-[300px] bg-slate-900 rounded-lg overflow-hidden">
             <SoilModel />
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Interactive 3D representation of field {currentField.id}
          </p>
        </motion.div>

        {/* Chart Card */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.6 }}
           className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Moisture Trends (7 Days)</h2>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 focus:ring-green-500 focus:border-green-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

       {/* Bottom Section: Recent Suggestions */}
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.7 }}
         className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
       >
         <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Suggestions</h2>
         <div className="space-y-4">
           {suggestionMessages.slice(0, 2).map((msg) => (
             <div key={msg.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
               <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
                 {msg.avatar}
               </div>
               <div>
                 <div className="flex items-baseline gap-2">
                   <h4 className="font-semibold text-slate-900">{msg.user}</h4>
                   <span className="text-xs text-slate-500">{msg.role} • {msg.timestamp}</span>
                 </div>
                 <p className="text-slate-600 text-sm mt-1">{msg.message}</p>
               </div>
             </div>
           ))}
         </div>
       </motion.div>

    </div>
  );
}
