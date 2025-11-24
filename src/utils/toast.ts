import { toast, ToastOptions } from 'react-toastify';
import { CustomToast } from '../components/ui/CustomToast';

/**
 * Toast notification utility with custom configurations
 */

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  closeButton: false,
  icon: false,
  className: '!bg-white dark:!bg-gray-800 !shadow-lg !rounded-lg !border !border-gray-200 dark:!border-gray-700 relative overflow-hidden p-4',
};

/**
 * Show success toast notification
 */
export const showSuccess = (
  message: string,
  options?: ToastOptions & { title?: string; actionLabel?: string; onAction?: () => void }
) => {
  const { title, actionLabel, onAction, ...toastOptions } = options || {};
  
  toast(CustomToast, {
    ...defaultOptions,
    ...toastOptions,
    data: {
      type: 'success',
      message,
      title,
      actionLabel,
      onAction,
    },
  });
};

/**
 * Show error toast notification
 */
export const showError = (
  message: string,
  options?: ToastOptions & { title?: string; actionLabel?: string; onAction?: () => void }
) => {
  const { title, actionLabel, onAction, ...toastOptions } = options || {};
  
  toast(CustomToast, {
    ...defaultOptions,
    ...toastOptions,
    data: {
      type: 'error',
      message,
      title,
      actionLabel,
      onAction,
    },
  });
};

/**
 * Show info toast notification
 */
export const showInfo = (
  message: string,
  options?: ToastOptions & { title?: string; actionLabel?: string; onAction?: () => void }
) => {
  const { title, actionLabel, onAction, ...toastOptions } = options || {};
  
  toast(CustomToast, {
    ...defaultOptions,
    ...toastOptions,
    data: {
      type: 'info',
      message,
      title,
      actionLabel,
      onAction,
    },
  });
};

/**
 * Show warning toast notification
 */
export const showWarning = (
  message: string,
  options?: ToastOptions & { title?: string; actionLabel?: string; onAction?: () => void }
) => {
  const { title, actionLabel, onAction, ...toastOptions } = options || {};
  
  toast(CustomToast, {
    ...defaultOptions,
    ...toastOptions,
    data: {
      type: 'warning',
      message,
      title,
      actionLabel,
      onAction,
    },
  });
};

/**
 * Show loading toast notification
 * Returns toast id that can be used to update or dismiss the toast
 */
export const showLoading = (message: string = 'Loading...', options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

/**
 * Update an existing toast
 */
export const updateToast = (
  toastId: string | number,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  options?: ToastOptions
) => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Dismiss a specific toast or all toasts
 */
export const dismissToast = (toastId?: string | number) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// Export toast object for advanced usage
export { toast };
