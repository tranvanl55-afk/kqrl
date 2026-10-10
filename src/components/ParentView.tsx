import { useState } from 'react';
import { Student } from '../types';
import StudentProfile from './StudentProfile';
import { Search, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function ParentView({ student, onLogout }: { student: Student, onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 px-6 flex justify-between border-b border-slate-200 bg-white items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            NCQ
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Cổng Thông Tin Phụ Huynh</h1>
            <p className="text-xs font-medium text-slate-500">THCS Ngô Chí Quốc</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">PHHS</span>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Xin chào, Phụ huynh em {student.name}</h2>
          <p className="text-slate-500 mt-1">Dưới đây là thông tin rèn luyện và sơ yếu lý lịch mới nhất của học sinh.</p>
        </div>
        
        <StudentProfile student={student} />
      </main>
    </div>
  );
}
