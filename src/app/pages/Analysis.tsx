import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Map, Layers, Download, Calendar, Thermometer, Droplets, Sparkles, AlertTriangle } from 'lucide-react';
import { mockSoilData } from '../services/mockData';

export default function Analysis() {
  const currentField = mockSoilData[0];
  const nutrientData = currentField.sensorReadings.map((reading) => ({
    subject: reading.nutrient,
    A: reading.current,
    B: reading.target,
    fullMark: Math.max(reading.current, reading.target, 160),
  }));

  const moistureReadings = [
    { label: 'Surface moisture', value: currentField.surfaceMoisture, description: 'Top 10 cm sensor layer' },
    { label: 'Root-zone moisture', value: currentField.rootZoneMoisture, description: '20-40 cm root probe' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analysis Center</h1>
          <p className="text-slate-500 max-w-2xl">
            Liquid intelligence-driven field diagnostics. Nutrients are linked to sensor feeds and moisture analysis now includes surface/root-zone layers plus freeze/thaw state.
          </p>
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
            False-color composite showing high moisture retention areas in blue/green spectrums. Data acquired: 2023-10-27 10:45 UTC.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Nutrient Balance & Sensor Links</h2>
          <div className="h-[320px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={nutrientData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 160]} tick={false} axisLine={false} />
                <Radar name="Current Levels" dataKey="A" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.5} />
                <Radar name="Target Levels" dataKey="B" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.1} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[1fr_80px_110px] gap-2 bg-slate-100 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>Nutrient Sensor</span>
              <span>Current</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-200">
              {currentField.sensorReadings.map((reading) => (
                <div key={reading.sensorId} className="flex items-center gap-2 px-4 py-4 text-sm text-slate-700">
                  <div className="min-w-[240px]">
                    <p className="font-medium text-slate-900">{reading.nutrient}</p>
                    <p className="text-xs text-slate-500">Sensor {reading.sensorId}</p>
                  </div>
                  <div className="min-w-[80px] text-slate-900">{reading.current} ppm</div>
                  <div className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    reading.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {reading.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-3 mb-5">
              <Droplets className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Surface & Root-zone Moisture</h3>
                <p className="text-sm text-slate-500">Live feed from soil moisture probes and satellite intelligence.</p>
              </div>
            </div>
            <div className="space-y-4">
              {moistureReadings.map((reading) => (
                <div key={reading.label} className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">{reading.label}</p>
                      <p className="text-xs text-slate-400">{reading.description}</p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{reading.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Thermometer className="h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900">Freeze / Thaw State</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">The field state is updated from sensor fusion across temperature, moisture, and satellite inputs.</p>
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200 text-slate-900">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">{currentField.freezeState}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">This summary helps risk-manage planting windows and irrigation when the root-zone transitions from frozen to active growing conditions.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              <h3 className="text-lg font-semibold text-slate-900">AI recommendations</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />Balance nitrogen with phosphorous feed for root resilience.</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />Use liquid intelligence to tie surface moisture levels to irrigation timing.</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />Monitor the freeze/thaw state before applying fertilizer or seed.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
