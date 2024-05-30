import { ToastOptions, toast } from 'react-hot-toast';

export { handleErrors } from '@/utils';

export const errorToast = (message = 'Something went wrong', toastOptions?: ToastOptions) => {
    toast.error(message, toastOptions);
};

export const successToast = (message = 'Successful', toastOptions?: ToastOptions) => {
    toast.success(message, toastOptions);
};

export const saveLocalStorage = (data: any, key: string) => {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        return true;
    } catch (error) {
        return false;
    }
};

export const getLocalStorage = (key: string) => {
    try {
        const jsonData = localStorage.getItem(key);
        if (!jsonData) return null;
        return JSON.parse(jsonData);
    } catch (error) {
        return null;
    }
};

export const getQueryKeys = (namespace: string) => ({
    create: `${namespace}/create`,
    read: `${namespace}/read`,
    readOne: `${namespace}/readOne`,
    update: `${namespace}/update`,
    patch: `${namespace}/patch`,
    put: `${namespace}/put`,
    delete: `${namespace}/delete`,
});

export function handleSuccess(data: any, message: string) {
    return data?.description || message;
}
