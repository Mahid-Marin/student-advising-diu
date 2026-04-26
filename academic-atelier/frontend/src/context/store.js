import create from 'zustand';

const defaultUser = {
  id: 1,
  name: 'Mahid Alam Marin',
  email: '251-16-017@diu.edu.bd',
  studentId: '251-16-017',
  department: 'Computing And Information System',
  batch: '21-A',
  semester: 'Spring 2026',
  major: 'Computer Science',
  year: '2nd Year',
  photo: '/profile-photo.jpeg',
};

export const useAuthStore = create((set) => ({
  user: defaultUser,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export const useChatStore = create((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setMessages: (messages) => set({ messages }),
  setSessionId: (sessionId) => set({ sessionId }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearChat: () => set({ messages: [], sessionId: null }),
}));

export const useNotificationStore = create((set) => ({
  notifications: [
    { id: 1, title: 'CIS Final Exam Routine', description: 'Spring 2026 Final Exam Schedule Released', time: 'now', type: 'exam', icon: '📅', read: false },
    { id: 2, title: '14 April - Pohela Boishakh', description: 'University Holiday - Bengali New Year', time: '2d ago', type: 'holiday', icon: '🎉', read: false },
    { id: 3, title: 'Assignment Deadline', description: 'Database Project Phase 2 due in 3 days', time: '3d ago', type: 'assignment', icon: '📝', read: true },
  ],
  unreadCount: 2,

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  updateUnreadCount: (count) => set({ unreadCount: count }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export const useLearningStore = create((set) => ({
  performances: [],
  recommendations: [],
  isLoading: false,

  setPerformances: (performances) => set({ performances }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
