import { useState } from 'react';
import { Student } from '../types';
import { getConductRating, isDecliningStudent, SKILL_TAGS, GRADE_OPTIONS } from '../lib/utils';
import { AlertCircle, ShieldAlert, Award, Star, BookOpen, AlertTriangle, Trash2, User, Activity, History, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentProfile({ 
  student, 
  onDeleteRecord,
  onAddRecord,
  onUpdateProfile,
  onClose,
  isAdmin = false,
  initialTab = 'profile'
}: { 
  student: Student,
  onDeleteRecord?: (type: 'violation' | 'bonus', id: string) => void,
  onAddRecord?: (record: { type: 'VIOLATION' | 'BONUS', description: string, points: number, severity?: string }) => void,
  onUpdateProfile?: (patch: Partial<Student>) => void,
  onClose?: () => void,
  isAdmin?: boolean,
  initialTab?: 'profile' | 'academic' | 'conduct'
}) {
  const rating = getConductRating(student.points);
  const isDeclining = isDecliningStudent(student);
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'conduct'>(initialTab);

  // Form State
  const [recordType, setRecordType] = useState<'VIOLATION' | 'BONUS'>('VIOLATION');
  const [actionDesc, setActionDesc] = useState('');
  const [severity, setSeverity] = useState<'Lần đầu' | 'Tái phạm'>('Lần đầu');
  const [points, setPoints] = useState<number>(0);

  const [profileForm, setProfileForm] = useState({
    parentsName: student.parentsName || '',
    parentsJob: student.parentsJob || '',
    phoneNumber: student.phoneNumber || '',
    hobbies: student.hobbies || '',
    talents: student.talents || ''
  });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddRecord && actionDesc.trim()) {
      onAddRecord({
        type: recordType,
        description: actionDesc.trim(),
        points: points,
        severity: severity
      });
      setActionDesc('');
      setPoints(0);
      onClose?.();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col relative w-full"
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-200/50 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="bg-slate-50 px-8 py-6 flex justify-between items-start border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">Hồ sơ học sinh</span>
            <span className="text-sm font-mono text-slate-500">ID: {student.id}</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{student.name}</h3>
          <p className="text-sm text-slate-500 mt-1">Lớp {student.class} | Ngày sinh: {student.dob}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-5xl font-bold tracking-tight ${rating.text}`}>{student.points}</div>
          <div className={`text-xs uppercase font-bold tracking-wider mt-1 ${rating.text}`}>Xếp loại: {rating.label}</div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-8">
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

      <div className="p-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-slate-900">Thông tin gia đình</h4>
                  <div className="space-y-4">
                    {onUpdateProfile ? (
                      <>
                        <label className="block text-sm">
                          <span className="text-slate-500 block mb-1 font-medium">Họ tên cha/mẹ</span>
                          <input type="text" value={profileForm.parentsName} onChange={e => setProfileForm({...profileForm, parentsName: e.target.value})} className="w-full border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-600 outline-none border" placeholder="Nhập họ tên cha mẹ..." />
                        </label>
                        <label className="block text-sm">
                          <span className="text-slate-500 block mb-1 font-medium">Nghề nghiệp</span>
                          <input type="text" value={profileForm.parentsJob} onChange={e => setProfileForm({...profileForm, parentsJob: e.target.value})} className="w-full border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-600 outline-none border" placeholder="Nhập nghề nghiệp..." />
                        </label>
                        <label className="block text-sm">
                          <span className="text-slate-500 block mb-1 font-medium">Số điện thoại liên hệ</span>
                          <input type="text" value={profileForm.phoneNumber} onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})} className="w-full border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-600 outline-none border" placeholder="Nhập số điện thoại..." />
                        </label>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Họ tên cha/mẹ</p>
                          <p className="text-sm font-medium text-slate-900">{student.parentsName || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Nghề nghiệp</p>
                          <p className="text-sm font-medium text-slate-900">{student.parentsJob || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Số điện thoại liên hệ</p>
                          <p className="text-sm font-medium text-slate-900">{student.phoneNumber || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-slate-900">Thông tin cá nhân</h4>
                  <div className="space-y-4">
                    {onUpdateProfile ? (
                      <>
                        <label className="block text-sm">
                          <span className="text-slate-500 block mb-1 font-medium">Sở thích</span>
                          <input type="text" value={profileForm.hobbies} onChange={e => setProfileForm({...profileForm, hobbies: e.target.value})} className="w-full border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-600 outline-none border" placeholder="Nhập sở thích..." />
                        </label>
                        <label className="block text-sm">
                          <span className="text-slate-500 block mb-1 font-medium">Năng khiếu</span>
                          <input type="text" value={profileForm.talents} onChange={e => setProfileForm({...profileForm, talents: e.target.value})} className="w-full border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-600 outline-none border" placeholder="Nhập năng khiếu..." />
                        </label>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Sở thích</p>
                          <p className="text-sm font-medium text-slate-900">{student.hobbies || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Năng khiếu</p>
                          <p className="text-sm font-medium text-slate-900">{student.talents || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {onUpdateProfile && (
                <div className="flex justify-end mb-8">
                  <button 
                    onClick={() => {
                      onUpdateProfile(profileForm);
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Lưu Sơ yếu lý lịch
                  </button>
                </div>
              )}

              <div className="h-px bg-slate-200 w-full mb-8"></div>

              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <Star className="w-4 h-4 text-slate-400" /> Bản đồ Năng lực
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {student.skills.map((skill, idx) => (
                   <span key={idx} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                     {skill}
                   </span>
                ))}
                {student.skills.length === 0 && <span className="text-sm text-slate-500 italic">Chưa cập nhật năng lực</span>}
              </div>

              {onUpdateProfile && (
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Chỉnh sửa năng lực (bấm để bật/tắt)</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_TAGS.map(tag => {
                      const on = student.skills.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onUpdateProfile({ skills: on ? student.skills.filter(s => s !== tag) : [...student.skills, tag] })}
                          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${on ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'academic' && (
            <motion.div key="academic" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <History className="w-4 h-4 text-slate-400" /> Đối chiếu Lớp 7
              </h4>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-1">Học lực cũ</p>
                  <p className="text-lg font-semibold text-slate-900">{student.grade7Academic}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-1">Hạnh kiểm cũ</p>
                  <p className="text-lg font-semibold text-slate-900">{student.grade7Behavior}</p>
                </div>
              </div>

              {onUpdateProfile && (
                <div className="grid grid-cols-2 gap-4 max-w-md mt-4">
                  <label className="text-xs font-medium text-slate-500">
                    Cập nhật học lực
                    <select value={student.grade7Academic} onChange={e => onUpdateProfile({ grade7Academic: e.target.value as Student['grade7Academic'] })}
                      className="mt-1 w-full bg-white px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-slate-500">
                    Cập nhật hạnh kiểm
                    <select value={student.grade7Behavior} onChange={e => onUpdateProfile({ grade7Behavior: e.target.value as Student['grade7Behavior'] })}
                      className="mt-1 w-full bg-white px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900">
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {isDeclining ? (
                <div className="mt-6 max-w-md p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                  <p className="text-sm font-medium flex gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>BÁO ĐỘNG SA SÚT: Hạnh kiểm lớp 7 "{student.grade7Behavior}" nhưng hiện tại "{rating.label}". Cần lưu ý!</span>
                  </p>
                </div>
              ) : (
                <div className="mt-6 max-w-md p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                  <p className="text-sm font-medium flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Phân tích: Học sinh duy trì phong độ. Tiếp tục phát huy thế mạnh.</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'conduct' && (
            <motion.div key="conduct" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
              
              {onAddRecord && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${isAdmin ? 'text-indigo-900' : 'text-indigo-600'}`} />
                    {isAdmin ? 'Quyền Admin: Can thiệp điểm rèn luyện' : 'Ghi nhận vi phạm / Cộng điểm'}
                  </h3>
                  
                  <form onSubmit={handleAction} className="space-y-4">
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
                        <button type="submit" className={`px-6 py-2 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${isAdmin ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                          Ghi nhận
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-6 text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  Lịch sử Biến động (Tháng này)
                </h4>
                <div className="space-y-6">
                  {student.violations.length === 0 && student.bonuses.length === 0 ? (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Đầu tháng</p>
                        <p className="text-sm font-medium text-slate-900">Khởi tạo quỹ điểm</p>
                        <p className="text-sm text-slate-500 font-mono">100 Điểm</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {student.bonuses.map((b, i) => (
                        <div key={b.id} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                            <div className="w-[1px] h-full bg-slate-200 mt-1"></div>
                          </div>
                          <div className="pb-4 flex-1">
                            <p className="text-xs font-medium text-slate-500">{b.date}</p>
                            <p className="text-sm font-medium text-slate-900">{b.description}</p>
                            <p className="text-sm text-emerald-600 font-mono font-medium">+{b.pointsAdded} Điểm</p>
                          </div>
                          {onDeleteRecord && (
                            <button 
                              onClick={() => onDeleteRecord('bonus', b.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-500 hover:bg-rose-50 rounded-md self-start"
                              title="Xóa bản ghi này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {student.violations.map((v, i) => (
                        <div key={v.id} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5"></div>
                            {i !== student.violations.length - 1 && <div className="w-[1px] h-full bg-slate-200 mt-1"></div>}
                          </div>
                          <div className="pb-4 flex-1">
                            <p className="text-xs font-medium text-slate-500">{v.date}</p>
                            <p className="text-sm font-medium text-slate-900">{v.type}: {v.description}</p>
                            <p className="text-sm text-rose-600 font-mono font-medium">-{v.pointsDeducted} Điểm</p>
                          </div>
                          {onDeleteRecord && (
                            <button 
                              onClick={() => onDeleteRecord('violation', v.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-500 hover:bg-rose-50 rounded-md self-start"
                              title="Xóa bản ghi này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
