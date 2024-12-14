import axios from "axios";
import errorHandler from "../errorHandler";

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SATUFARMASI_API_URL}`,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // "X-Requested-With": "XMLHttpRequest",
    }
})

instance.interceptors.response.use((response) => response.data, errorHandler);
export default instance;
