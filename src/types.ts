export interface Violation {
  id: string;
  type: string;
  description: string;
  pointsDeducted: number;
  date: string;
}

export interface Bonus {
  id: string;
  description: string;
  pointsAdded: number;
  date: string;
}

export interface Student {
  class: string;
  stt: number;
  id: string; // Số định danh cá nhân
  name: string;
  dob: string;
  
  // Rèn luyện
  points: number; // Quỹ 100 điểm/tháng
  violations: Violation[];
  bonuses: Bonus[];
  
  // Sơ yếu lý lịch (giả lập)
  parentsName?: string;
  parentsJob?: string;
  phoneNumber?: string;
  hobbies?: string;
  talents?: string;
  skills: string[]; // Thế mạnh
  grade7Behavior: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa cập nhật';
  grade7Academic: 'Tốt' | 'Khá' | 'Đạt' | 'Chưa cập nhật';
}

export type Role = 'ADMIN' | 'TEACHER' | 'PARENT' | null;

export interface AuthState {
  role: Role;
  classId?: string; // For TEACHER
  studentId?: string; // For PARENT
}
