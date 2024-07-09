import axios from "axios";
import errorHandler from "../errorHandler";

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SATUFARMASI_API_URL}`,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    // withCredentials: true
});

instance.interceptors.response.use((response) => response.data, errorHandler);
export default instance;