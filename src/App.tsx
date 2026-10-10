import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, writeBatch } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth as fbAuth } from './lib/firebase';
import { initialStudents } from './data';
import { Student, AuthState } from './types';
import Login from './components/Login';
import ParentView from './components/ParentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';

const STORAGE_KEY = 'ncq-students-v1';
const COLLECTION = 'students';

function mergeWithBase(saved: Student[]): Student[] {
  const byId = new Map(saved.map(s => [s.id, s]));
  return initialStudents.map(s => byId.get(s.id) ?? s);
}

// Bộ nhớ đệm cục bộ: hiển thị ngay khi mở trang / khi mất mạng
function loadCached(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeWithBase(JSON.parse(raw)) : initialStudents;
  } catch {
    return initialStudents;
  }
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(loadCached);
  const [auth, setAuth] = useState<AuthState>({ role: null });
  const [showWelcome, setShowWelcome] = useState(true);
  const [syncState, setSyncState] = useState<'connecting' | 'online' | 'offline'>('connecting');

  // Đồng bộ thời gian thực với Firestore
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    signInAnonymously(fbAuth)
      .then(() => {
        if (cancelled) return;
        unsub = onSnapshot(
          collection(db, COLLECTION),
          snap => {
            if (snap.empty) {
              // Lần đầu: đẩy dữ liệu gốc lên Firestore
              const batch = writeBatch(db);
              initialStudents.forEach(s => batch.set(doc(db, COLLECTION, s.id), s));
              batch.commit().catch(() => setSyncState('offline'));
              return;
            }
            setStudents(mergeWithBase(snap.docs.map(d => d.data() as Student)));
            setSyncState('online');
          },
          () => setSyncState('offline')
        );
      })
      .catch(() => setSyncState('offline'));

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  // Lưu bộ nhớ đệm cục bộ
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Bắt đầu tháng mới: khôi phục quỹ 100 điểm, xoá lịch sử biến động
  const handleResetMonth = () => {
    const reset = students.map(s => ({ ...s, points: 100, violations: [], bonuses: [] }));
    setStudents(reset);
    const batch = writeBatch(db);
    reset.forEach(s => batch.set(doc(db, COLLECTION, s.id), s));
    batch.commit().catch(() => setSyncState('offline'));
  };

  // Auto-hide the initial welcome toast after 4 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setDoc(doc(db, COLLECTION, updatedStudent.id), updatedStudent).catch(() => setSyncState('offline'));
  };

  const handleLogout = () => {
    setAuth({ role: null });
  };

  const syncBadge = (
    <div
      className={`fixed bottom-3 right-3 z-50 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border flex items-center gap-2 bg-white ${
        syncState === 'online' ? 'text-emerald-700 border-emerald-200' : syncState === 'offline' ? 'text-rose-700 border-rose-200' : 'text-slate-500 border-slate-200'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${syncState === 'online' ? 'bg-emerald-500' : syncState === 'offline' ? 'bg-rose-500' : 'bg-slate-400 animate-pulse'}`} />
      {syncState === 'online' ? 'Đã đồng bộ Firebase' : syncState === 'offline' ? 'Chế độ ngoại tuyến' : 'Đang kết nối...'}
    </div>
  );

  let view: React.ReactNode = <div>Lỗi trạng thái</div>;

  if (!auth.role) {
    view = (
      <>
        {showWelcome && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Hệ thống đã nạp thành công {initialStudents.length} hồ sơ học sinh khối 8
          </div>
        )}
        <Login onLogin={setAuth} />
      </>
    );
  } else if (auth.role === 'PARENT' && auth.studentId) {
    const student = students.find(s => s.id === auth.studentId);
    if (student) view = <ParentView student={student} onLogout={handleLogout} />;
  } else if (auth.role === 'TEACHER' && auth.classId) {
    view = <TeacherView classId={auth.classId} students={students} onLogout={handleLogout} onUpdateStudent={handleUpdateStudent} />;
  } else if (auth.role === 'ADMIN') {
    view = <AdminView students={students} onLogout={handleLogout} onUpdateStudent={handleUpdateStudent} onResetMonth={handleResetMonth} />;
  }

  return (
    <>
      {view}
      {syncBadge}
    </>
  );
}
