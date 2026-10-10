import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function BatchActionModal({ 
  onClose, 
  onConfirm, 
  studentCount, 
  isAdmin 
}: { 
  onClose: () => void, 
  onConfirm: (record: { type: 'VIOLATION' | 'BONUS', description: string, points: number, severity?: string }) => void, 
  studentCount: number, 
  isAdmin: boolean 
}) {
  const [recordType, setRecordType] = useState<'VIOLATION' | 'BONUS'>('VIOLATION');
  const [actionDesc, setActionDesc] = useState('');
  const [severity, setSeverity] = useState<'Lần đầu' | 'Tái phạm'>('Lần đầu');
  const [points, setPoints] = useState<number>(0);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionDesc.trim()) {
      onConfirm({
        type: recordType,
        description: actionDesc.trim(),
        points: points,
        severity: severity
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg relative overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className={`w-5 h-5 ${isAdmin ? 'text-indigo-900' : 'text-indigo-600'}`} />
              Ghi nhận hàng loạt
            </h3>
            <p className="text-sm text-slate-500 mt-1">Đang thao tác cho <strong>{studentCount}</strong> học sinh</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-200/50 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleAction} className="space-y-5">
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={recordType === 'VIOLATION'} onChange={() => setRecordType('VIOLATION')} className="text-indigo-600 focus:ring-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Ghi lỗi vi phạm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={recordType === 'BONUS'} onChange={() => setRecordType('BONUS')} className="text-emerald-600 focus:ring-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Cộng điểm</span>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                required
                value={actionDesc}
                onChange={e => setActionDesc(e.target.value)}
                placeholder={recordType === 'VIOLATION' ? 'Lỗi vi phạm (VD: Không thuộc bài...)' : 'Lý do cộng điểm (VD: Trực nhật tốt...)'}
                className="w-full bg-white px-4 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 shadow-sm"
              />
              
              <div className="flex flex-wrap md:flex-nowrap gap-3">
                {recordType === 'VIOLATION' && (
                  <select 
                    value={severity} 
                    onChange={e => setSeverity(e.target.value as any)}
                    className="bg-white px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900 shadow-sm"
                  >
                    <option value="Lần đầu">Lần đầu</option>
                    <option value="Tái phạm">Tái phạm</option>
                  </select>
                )}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm flex-1">
                  <span className="text-sm text-slate-500 whitespace-nowrap">{recordType === 'VIOLATION' ? 'Điểm trừ:' : 'Điểm cộng:'}</span>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={points}
                    onChange={e => setPoints(parseInt(e.target.value) || 0)}
                    className="w-full outline-none text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Hủy
              </button>
              <button type="submit" className={`px-6 py-2 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${isAdmin ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                Xác nhận áp dụng
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
