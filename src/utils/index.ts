import { AxiosError } from "axios";

export function handleErrors(error: AxiosError) {
    let errorMessage = '';

    if (error.response) {
        const serverResponse = (error.response?.data || {}) as any;
        errorMessage = serverResponse?.error || serverResponse?.message;

        if (typeof errorMessage === 'string') {
            return errorMessage;
        }

        if (Array.isArray(errorMessage)) {
            return errorMessage[0];
        }
    } else if (error.request) {
        errorMessage = (error.request as any)?.message;
        if (errorMessage) {
            return errorMessage;
        }
    }

    return error.message || 'Something went wrong';
}


export const monthLookup: any = {
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "May": 4,
    "June": 5,
    "July": 6,
    "August": 7,
    "September": 8,
    "October": 9,
    "November": 10,
    "December": 11
};


