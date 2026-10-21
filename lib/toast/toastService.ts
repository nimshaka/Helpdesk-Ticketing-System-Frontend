type ToastMethods = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
};

let toastRef: ToastMethods | null = null;

export const setToastRef = (toastInstance: ToastMethods) => {
  toastRef = toastInstance;
};

export const toast = {
  success: (msg: string) => toastRef?.success(msg),
  error: (msg: string) => toastRef?.error(msg),
  warning: (msg: string) => toastRef?.warning(msg),
  info: (msg: string) => toastRef?.info(msg),
};
