import { toast } from "react-toastify";

export default function errorHandler(error) {
    if (typeof error === "string") toast.error(error);
    if (error) {
        if (error.response) {
            let message;
            if (error.response.status === 500) {
                message = "Something went terribly wrong";
                return Promise.reject(message);
            }
            return Promise.reject(error);
        }
    }
}