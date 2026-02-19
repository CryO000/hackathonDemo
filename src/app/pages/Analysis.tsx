import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Map, Layers, Download, Calendar } from 'lucide-react';
import { mockSoilData } from '../services/mockData';

const nutrientData = [
  { subject: 'Nitrogen', A: 120, B: 110, fullMark: 150 },
  { subject: 'Phosphorus', A: 98, B: 130, fullMark: 150 },
  { subject: 'Potassium', A: 86, B: 130, fullMark: 150 },
  { subject: 'Magnesium', A: 99, B: 100, fullMark: 150 },
  { subject: 'Calcium', A: 85, B: 90, fullMark: 150 },
  { subject: 'Sulfur', A: 65, B: 85, fullMark: 150 },
];

const phData = [
  { name: 'Field 1', ph: 6.5 },
  { name: 'Field 2', ph: 6.8 },
  { name: 'Field 3', ph: 6.2 },
  { name: 'Field 4', ph: 7.1 },
];

export default function Analysis() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analysis Center</h1>
          <p className="text-slate-500">Deep dive into soil composition and Sentinel-1 imagery</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
            <Calendar className="h-4 w-4" />
            Oct 2023
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm shadow-green-600/20">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </header>

      {/* Main Map Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 group"
      >
        <img 
          src="https://images.unsplash.com/photo-1720200793798-947f201e2028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjB2aWV3JTIwYWdyaWN1bHR1cmUlMjBmaWVsZHN8ZW58MXx8fHwxNzcxNTE5Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Satellite Map" 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60" />
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <Layers className="h-6 w-6 text-slate-700" />
        </div>

        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Map className="h-5 w-5 text-green-400" />
            <span className="font-semibold text-lg">Sentinel-1 Composite Layer</span>
          </div>
          <p className="text-sm text-slate-300 max-w-md">
            False-color composite showing high moisture retention areas in blue/green spectrums.
            Data acquired: 2023-10-27 10:45 UTC.
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nutrient Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Nutrient Balance</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={nutrientData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Current Levels" dataKey="A" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.5} />
                <Radar name="Target Levels" dataKey="B" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.1} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* pH Levels Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Soil pH Across Sectors</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 14]} tickCount={8} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="ph" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
