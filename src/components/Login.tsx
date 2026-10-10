import { useState } from 'react';
import { AuthState } from '../types';
import { Shield, UserCircle, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { initialStudents } from '../data';

const CLASSES = Array.from(new Set(initialStudents.map(s => s.class)));
// Mật khẩu demo (nên thay bằng xác thực phía máy chủ khi triển khai thật)
const PASSWORDS = { ADMIN: 'gv123', TEACHER: 'LinhHaNham' };

export default function Login({ onLogin }: { onLogin: (auth: AuthState) => void }) {
  const [role, setRole] = useState<'ADMIN' | 'TEACHER' | 'PARENT' | null>(null);
  const [idInput, setIdInput] = useState('');
  const [classInput, setClassInput] = useState(CLASSES[0]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'ADMIN' || role === 'TEACHER') {
      if (password !== PASSWORDS[role]) {
        setError('Mật khẩu không đúng.');
        return;
      }
    }

    if (role === 'ADMIN') {
      onLogin({ role: 'ADMIN' });
    } else if (role === 'TEACHER') {
      onLogin({ role: 'TEACHER', classId: classInput });
    } else if (role === 'PARENT') {
      if (!idInput.trim()) {
        setError('Vui lòng nhập Số định danh cá nhân');
        return;
      }
      const student = initialStudents.find(s => s.id === idInput.trim());
      if (!student) {
        setError('Không tìm thấy học sinh với số định danh này.');
        return;
      }
      onLogin({ role: 'PARENT', studentId: student.id });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Hệ Thống Quản Trị</h1>
          <p className="text-indigo-100 mt-1 text-sm font-medium">Trường THCS Ngô Chí Quốc</p>
        </div>

        <div className="p-8">
          {!role ? (
            <div className="space-y-3">
              <h2 className="text-center text-slate-500 font-semibold text-sm mb-6 uppercase tracking-wider">Chọn vai trò đăng nhập</h2>
              
              <button 
                onClick={() => setRole('PARENT')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left bg-white group"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 p-3 rounded-xl transition-colors">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Phụ Huynh (PHHS)</div>
                  <div className="text-sm text-slate-500">Tra cứu thông tin học sinh</div>
                </div>
              </button>

              <button 
                onClick={() => setRole('TEACHER')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left bg-white group"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 p-3 rounded-xl transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Giáo Viên Chủ Nhiệm</div>
                  <div className="text-sm text-slate-500">Quản lý lớp, ghi nhận điểm</div>
                </div>
              </button>

              <button 
                onClick={() => setRole('ADMIN')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left bg-white group"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 p-3 rounded-xl transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Ban Giám Hiệu (Admin)</div>
                  <div className="text-sm text-slate-500">Toàn quyền hệ thống</div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <button 
                type="button"
                onClick={() => setRole(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Quay lại
              </button>

              <div className="pt-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {role === 'PARENT' ? 'Phụ Huynh' : role === 'TEACHER' ? 'Giáo Viên' : 'Admin'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">Vui lòng điền thông tin để tiếp tục</p>
              </div>

              {role === 'PARENT' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-900">Số định danh cá nhân</label>
                  <input 
                    type="text" 
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    className="w-full bg-white px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 transition-shadow"
                    placeholder="Nhập 12 số định danh..."
                  />
                  <p className="text-xs text-slate-500">Ví dụ: 79313034171</p>
                </div>
              )}

              {role === 'TEACHER' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-900">Chọn lớp chủ nhiệm</label>
                  <select 
                    value={classInput}
                    onChange={(e) => setClassInput(e.target.value)}
                    className="w-full bg-white px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 transition-shadow"
                  >
                    {CLASSES.map(c => <option key={c} value={c}>Lớp {c}</option>)}
                  </select>
                </div>
              )}

              {(role === 'TEACHER' || role === 'ADMIN') && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-900">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 transition-shadow"
                    placeholder="Nhập mật khẩu..."
                  />
                  <p className="text-xs text-slate-500">Demo: {role === 'ADMIN' ? PASSWORDS.ADMIN : PASSWORDS.TEACHER}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors shadow-sm mt-2"
              >
                Đăng nhập hệ thống
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
