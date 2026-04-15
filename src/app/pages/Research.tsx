import React from 'react';
import { motion } from 'motion/react';
import { researchArticles } from '../services/mockData';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';

const articleImages = [
  "https://images.unsplash.com/photo-1579818191104-014df427aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBzb2lsJTIwbW9pc3R1cmUlMjBtYXAlMjBzY2llbmNlfGVufDF8fHx8MTc3MTUxOTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1715199281917-5e5b20d5c038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBhZ3JpY3VsdHVyZSUyMGRyb25lJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE1MTk4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1691431652853-336a59427d7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwY2xpbWF0ZSUyMGNoYW5nZSUyMGRyb3VnaHR8ZW58MXx8fHwxNzcxNTE5ODQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

export default function Research() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Research & Insights</h1>
        <p className="text-slate-500">Latest findings from global agriculture and remote sensing studies</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col"
          >
            <div className="h-48 overflow-hidden bg-slate-100 relative">
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
               <img 
                 src={articleImages[index % articleImages.length]} 
                 alt="Research Thumbnail" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                {article.summary}
              </p>
              <button className="flex items-center text-green-600 text-sm font-semibold hover:gap-2 transition-all group-hover:text-green-700 mt-auto">
                Read Full Paper <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
