export interface ToastData {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  duration?: number;
}
