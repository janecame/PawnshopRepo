import axios from "axios";
import StringHost from "../Functions/ConnectionString";

export const AxiosConnection = axios.create({
    baseURL: StringHost(),
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosConnection.interceptors.request.use((config) => {
    const userJson = localStorage.getItem("auth_user") || localStorage.getItem("UserSession");
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch {
            // ignore malformed session
        }
    }
    return config;
});
