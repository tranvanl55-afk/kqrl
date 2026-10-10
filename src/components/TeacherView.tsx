import { useState } from 'react';
import { Student, Violation, Bonus } from '../types';
import StudentProfile from './StudentProfile';
import BatchActionModal from './BatchActionModal';
import StatsBar from './StatsBar';
import { LogOut, Filter, AlertTriangle, Check, ShieldAlert, Award, AlertCircle, Shield, ChevronLeft, Search, User, BookOpen, Activity, Download } from 'lucide-react';
import { getConductRating, isWarningStudent, exportStudentsCsv } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TeacherView({ 
  classId, 
  students, 
  onLogout,
  onUpdateStudent
}: { 
  classId: string, 
  students: Student[], 
  onLogout: () => void,
  onUpdateStudent: (s: Student) => void
}) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'conduct'>('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showWarnings, setShowWarnings] = useState(false);
  
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Derive class students
  const classStudents = students.filter(s => s.class === classId);
  
  // Apply filters
  let filtered = classStudents;
  if (searchQuery) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery));
  }
  if (skillFilter) {
    filtered = filtered.filter(s => s.skills.includes(skillFilter));
  }
  if (showWarnings) {
    filtered = filtered.filter(isWarningStudent);
  }

  const allSkills = Array.from(new Set(classStudents.flatMap(s => s.skills))).sort();

  const handleAddRecord = (record: { type: 'VIOLATION' | 'BONUS', description: string, points: number, severity?: string }) => {
    if (!selectedStudent) return;

    const dateStr = new Date().toLocaleDateString('vi-VN');
    const updatedStudent = { ...selectedStudent };

    if (record.type === 'BONUS') {
      const newBonus: Bonus = {
        id: Date.now().toString(),
        description: record.description,
        pointsAdded: record.points,
        date: dateStr
      };
      updatedStudent.bonuses = [newBonus, ...updatedStudent.bonuses];
      updatedStudent.points = Math.min(100, updatedStudent.points + record.points);
    } else {
      const newViolation: Violation = {
        id: Date.now().toString(),
        type: record.severity || 'Vi phạm',
        description: record.description,
        pointsDeducted: record.points,
        date: dateStr
      };
      updatedStudent.violations = [newViolation, ...updatedStudent.violations];
      updatedStudent.points = Math.max(0, updatedStudent.points - record.points);
    }

    onUpdateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
  };

  const handleBatchAction = (record: { type: 'VIOLATION' | 'BONUS', description: string, points: number, severity?: string }) => {
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const ids = Array.from(selectedStudentIds);
    
    ids.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;
      
      const updatedStudent = { ...student };
      if (record.type === 'BONUS') {
        const newBonus: Bonus = { id: Date.now().toString() + Math.random(), description: record.description, pointsAdded: record.points, date: dateStr };
        updatedStudent.bonuses = [newBonus, ...updatedStudent.bonuses];
        updatedStudent.points = Math.min(100, updatedStudent.points + record.points);
      } else {
        const newViolation: Violation = { id: Date.now().toString() + Math.random(), type: record.severity || 'Vi phạm', description: record.description, pointsDeducted: record.points, date: dateStr };
        updatedStudent.violations = [newViolation, ...updatedStudent.violations];
        updatedStudent.points = Math.max(0, updatedStudent.points - record.points);
      }
      onUpdateStudent(updatedStudent);
    });

    setSelectedStudentIds(new Set());
    setShowBatchModal(false);
  };

  const handleUpdateProfile = (patch: Partial<Student>) => {
    if (!selectedStudent) return;
    const updated = { ...selectedStudent, ...patch };
    onUpdateStudent(updated);
    setSelectedStudent(updated);
  };

  const handleDeleteRecord = (type: 'violation' | 'bonus', id: string) => {
    if (!selectedStudent) return;
    
    const updatedStudent = { ...selectedStudent };
    
    if (type === 'bonus') {
      const bonus = updatedStudent.bonuses.find(b => b.id === id);
      if (bonus) {
        updatedStudent.points = Math.max(0, updatedStudent.points - bonus.pointsAdded);
        updatedStudent.bonuses = updatedStudent.bonuses.filter(b => b.id !== id);
      }
    } else {
      const violation = updatedStudent.violations.find(v => v.id === id);
      if (violation) {
        updatedStudent.points = Math.min(100, updatedStudent.points + violation.pointsDeducted);
        updatedStudent.violations = updatedStudent.violations.filter(v => v.id !== id);
      }
    }
    
    onUpdateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 px-6 flex justify-between border-b border-slate-200 bg-white items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            NCQ
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Quản lý lớp {classId}</h1>
            <p className="text-xs font-medium text-slate-500">Sĩ số: {classStudents.length} học sinh</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">GVCN</span>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-8">
        {/* Dashboard Always Visible */}
        <div className="flex flex-col gap-6">
          <StatsBar students={classStudents} />

          <div className="flex justify-between items-center">
            <button
              onClick={() => exportStudentsCsv(classStudents, `ren-luyen-${classId}.csv`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Xuất CSV lớp {classId}
            </button>
            
            <AnimatePresence>
              {selectedStudentIds.size > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => setShowBatchModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Ghi lỗi/cộng điểm chung ({selectedStudentIds.size})
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs Nav */}
              <div className="bg-white border-b border-slate-200 px-6 rounded-t-xl overflow-x-auto whitespace-nowrap">
                <nav className="flex gap-8">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    <User className="w-4 h-4" /> Sơ yếu lý lịch
                  </button>
                  <button 
                    onClick={() => setActiveTab('academic')}
                    className={`py-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'academic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    <BookOpen className="w-4 h-4" /> Học tập
                  </button>
                  <button 
                    onClick={() => setActiveTab('conduct')}
                    className={`py-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'conduct' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                  >
                    <Activity className="w-4 h-4" /> Kết quả rèn luyện
                  </button>
                </nav>
              </div>

              {/* Filters */}
              <div className="bg-white p-5 rounded-b-xl border border-slate-200 border-t-0 shadow-sm flex flex-col md:flex-row gap-4 items-center -mt-6">
                <div className="flex-1 w-full relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc ID..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 transition-shadow"
                  />
                </div>
                
                <div className="w-full md:w-64">
                  <select 
                    value={skillFilter}
                    onChange={e => setSkillFilter(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 transition-shadow"
                  >
                    <option value="">-- Lọc theo năng lực --</option>
                    {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer w-full md:w-auto">
                  <input 
                    type="checkbox" 
                    checked={showWarnings}
                    onChange={e => setShowWarnings(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="whitespace-nowrap">Chỉ hiện Cảnh báo</span>
                </label>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-900 w-12">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                            checked={selectedStudentIds.size === filtered.length && filtered.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds(new Set(filtered.map(s => s.id)));
                              } else {
                                setSelectedStudentIds(new Set());
                              }
                            }}
                          />
                        </th>
                        <th className="px-6 py-3 font-semibold text-slate-900 w-16">STT</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Mã định danh</th>
                        <th className="px-6 py-3 font-semibold text-slate-900">Họ và tên</th>
                        
                        {activeTab === 'profile' && (
                          <>
                            <th className="px-6 py-3 font-semibold text-slate-900">Ngày sinh</th>
                            <th className="px-6 py-3 font-semibold text-slate-900">Năng lực nổi bật</th>
                          </>
                        )}

                        {activeTab === 'academic' && (
                          <>
                            <th className="px-6 py-3 font-semibold text-slate-900 text-center">Học lực (Lớp 7)</th>
                            <th className="px-6 py-3 font-semibold text-slate-900 text-center">Hạnh kiểm (Lớp 7)</th>
                            <th className="px-6 py-3 font-semibold text-slate-900">Đánh giá</th>
                          </>
                        )}

                        {activeTab === 'conduct' && (
                          <>
                            <th className="px-6 py-3 font-semibold text-slate-900 text-center">Điểm RL</th>
                            <th className="px-6 py-3 font-semibold text-slate-900">Xếp loại</th>
                          </>
                        )}

                        <th className="px-6 py-3 font-semibold text-slate-900 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((s, i) => {
                         const isWarning = isWarningStudent(s);
                         return (
                         <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedStudent(s); setActiveTab('conduct'); }}>
                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                checked={selectedStudentIds.has(s.id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedStudentIds);
                                  if (e.target.checked) newSet.add(s.id);
                                  else newSet.delete(s.id);
                                  setSelectedStudentIds(newSet);
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">{i+1}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{s.id}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{s.name}</span>
                                {isWarning && 
                                  <span title="Cảnh báo sa sút"><AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" /></span>
                                }
                              </div>
                            </td>

                            {activeTab === 'profile' && (
                              <>
                                <td className="px-6 py-4 text-slate-600">{s.dob}</td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {s.skills.slice(0, 2).map((skill, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-medium text-slate-600">{skill}</span>
                                    ))}
                                    {s.skills.length > 2 && <span className="text-[10px] text-slate-400">+{s.skills.length - 2}</span>}
                                  </div>
                                </td>
                              </>
                            )}

                            {activeTab === 'academic' && (
                              <>
                                <td className="px-6 py-4 text-center font-medium text-slate-700">{s.grade7Academic}</td>
                                <td className="px-6 py-4 text-center font-medium text-slate-700">{s.grade7Behavior}</td>
                                <td className="px-6 py-4">
                                  {isWarning ? (
                                    <span className="flex items-center gap-1 text-xs font-medium text-rose-600"><AlertTriangle className="w-3.5 h-3.5" /> Báo động</span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><Check className="w-3.5 h-3.5" /> Ổn định</span>
                                  )}
                                </td>
                              </>
                            )}

                            {activeTab === 'conduct' && (
                              <>
                                <td className="px-6 py-4 text-center">
                                  <span className={`px-2.5 py-1 rounded-full text-white text-xs font-bold inline-block w-12 text-center ${getConductRating(s.points).color}`}>{s.points}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{getConductRating(s.points).label}</td>
                              </>
                            )}

                            <td className="px-6 py-4 text-right">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setSelectedStudent(s); setActiveTab('conduct'); }} 
                                 className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                               >
                                 Chi tiết
                               </button>
                            </td>
                         </tr>
                      )})}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-slate-500 font-medium">Không có học sinh nào phù hợp với bộ lọc.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
        </div>

        <AnimatePresence>
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="w-full max-w-4xl m-auto"
               >
                 <StudentProfile 
                   key={selectedStudent.id}
                   student={selectedStudent} 
                   onDeleteRecord={handleDeleteRecord} 
                   onAddRecord={handleAddRecord}
                   onUpdateProfile={handleUpdateProfile}
                   onClose={() => setSelectedStudent(null)}
                   isAdmin={false}
                   initialTab="conduct"
                 />
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBatchModal && (
            <BatchActionModal 
              studentCount={selectedStudentIds.size}
              isAdmin={false}
              onClose={() => setShowBatchModal(false)}
              onConfirm={handleBatchAction}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
