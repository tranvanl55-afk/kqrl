import { Student } from '../types';
import { getConductRating, isWarningStudent } from '../lib/utils';
import { Users, TrendingUp, AlertTriangle, Award } from 'lucide-react';

export default function StatsBar({ students }: { students: Student[] }) {
  const total = students.length;
  const avg = total ? students.reduce((sum, s) => sum + s.points, 0) / total : 0;
  const warnings = students.filter(isWarningStudent).length;
  const good = students.filter(s => getConductRating(s.points).label === 'TỐT').length;

  const cards = [
    { label: 'Sĩ số', value: total, icon: Users, tone: 'bg-indigo-50 text-indigo-700' },
    { label: 'Điểm RL trung bình', value: avg.toFixed(1), icon: TrendingUp, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Xếp loại Tốt', value: good, icon: Award, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Cần cảnh báo', value: warnings, icon: AlertTriangle, tone: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${c.tone}`}><c.icon className="w-5 h-5" /></div>
          <div>
            <div className="text-xl font-bold text-slate-900">{c.value}</div>
            <div className="text-xs font-medium text-slate-500">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
