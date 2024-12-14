import axios from "axios";
import errorHandler from "../errorHandler";

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SATUFARMASI_API_URL}`,
    withCredentials: true
}, {
    headers: {
         "Access-Control-Allow-Origin": "http://localhost:8000",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    }
});

instance.interceptors.response.use((response) => response.data, errorHandler);
export default instance;
