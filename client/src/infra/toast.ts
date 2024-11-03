import toast, { ToastOptions } from 'react-hot-toast';


const defaultOptions: ToastOptions = {
  position: 'bottom-left',
  duration: 5000
};

export function showToast(message: string, options: ToastOptions = {}) {
  toast(message, { ...defaultOptions, ...options });
}
