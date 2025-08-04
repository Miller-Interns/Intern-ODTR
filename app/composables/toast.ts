import {  type ToastOptions } from "~/interfaces/interfaces";
export const useAppToast = () => {
  const toast = useState<ToastOptions | null>('app-toast', () => null);

  function setToast(options: ToastOptions) {
    toast.value = options;
  }


  function clearToast() {
    toast.value = null;
  }

  return {
    toast,
    setToast,
    clearToast
  };
};