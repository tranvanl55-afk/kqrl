import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to generate random fake skills
export const SKILL_TAGS = ['KHTN', 'Khéo tay', 'Văn nghệ', 'Thể thao', 'Lãnh đạo', 'Công nghệ', 'Lập trình', 'Hùng biện', 'Tiếng Anh'];
export function getRandomSkills(): string[] {
  const shuffled = [...SKILL_TAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2); // 2-3 skills
}

export function getRandomGrade7(): 'Tốt' | 'Khá' | 'Đạt' {
  const rand = Math.random();
  if (rand > 0.6) return 'Tốt';
  if (rand > 0.2) return 'Khá';
  return 'Đạt';
}

export function getConductRating(points: number) {
  if (points >= 85) return { label: 'TỐT', color: 'bg-emerald-500', text: 'text-emerald-600', note: 'Tuyên dương' };
  if (points >= 65) return { label: 'KHÁ', color: 'bg-blue-500', text: 'text-blue-600', note: 'Khuyến khích tham gia phong trào gỡ điểm' };
  if (points >= 50) return { label: 'ĐẠT', color: 'bg-amber-500', text: 'text-amber-600', note: 'Cần chú ý, nhắc nhở' };
  return { label: 'CHƯA ĐẠT', color: 'bg-rose-500', text: 'text-rose-600', note: 'Báo động, mời phụ huynh' };
}

export const GRADE_OPTIONS = ['Tốt', 'Khá', 'Đạt', 'Chưa cập nhật'] as const;

// Cảnh báo: điểm rèn luyện dưới 65 (Chưa đạt/Đạt thấp)
export function isWarningStudent(s: { points: number }) {
  return s.points < 65;
}

// Cảnh báo sa sút: hạnh kiểm lớp 7 Tốt/Khá nhưng điểm hiện tại < 65
export function isDecliningStudent(s: { points: number; grade7Behavior: string }) {
  return (s.grade7Behavior === 'Tốt' || s.grade7Behavior === 'Khá') && s.points < 65;
}

export function exportStudentsCsv(
  students: { class: string; stt: number; id: string; name: string; dob: string; points: number; violations: unknown[]; bonuses: unknown[]; skills: string[]; grade7Academic: string; grade7Behavior: string }[],
  filename: string
) {
  const header = ['Lớp', 'STT', 'Số định danh', 'Họ và tên', 'Ngày sinh', 'Điểm RL', 'Xếp loại', 'Số lỗi', 'Số lần cộng', 'Năng lực', 'Học lực L7', 'Hạnh kiểm L7'];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = students.map(s => [
    s.class, s.stt, s.id, s.name, s.dob, s.points, getConductRating(s.points).label,
    s.violations.length, s.bonuses.length, s.skills.join('; '), s.grade7Academic, s.grade7Behavior,
  ].map(esc).join(','));
  const csv = '\uFEFF' + [header.map(esc).join(','), ...rows].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
