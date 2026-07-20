import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import { VerifyUserLogin } from "../Functions/AxiosFunction";

interface User {
    userCode: string;
    userName: string;
    completeName: string;
    groupCode: string;
    cnCode: string;
    token: string;
    expiresIn: number;
    expiryTimeStamp: number;
}

interface LegacySession {
    UserCode: string;
    UserName: string;
    FullName: string;
    GroupCode: string;
    CNCode: string;
    token: string;
    expiresIn: number;
    expiryTimeStamp?: number;
}

export type LoginResult = "ok" | "badPassword" | "noUser" | "error";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<LoginResult>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapLegacy = (legacy: LegacySession, expiryTimeStamp: number): User => ({
    userCode: legacy.UserCode,
    userName: legacy.UserName,
    completeName: legacy.FullName,
    groupCode: legacy.GroupCode,
    cnCode: legacy.CNCode,
    token: legacy.token,
    expiresIn: legacy.expiresIn,
    expiryTimeStamp,
});

const hydrate = (): User | null => {
    const newRaw = localStorage.getItem("auth_user");
    if (newRaw) {
        try {
            const parsed: User = JSON.parse(newRaw);
            if (parsed.expiryTimeStamp && Date.now() > parsed.expiryTimeStamp) {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("UserSession");
                return null;
            }
            // Backfill legacy UserSession key for sessions created before it was
            // persisted, so components still using UserSession() keep working.
            if (!localStorage.getItem("UserSession")) {
                localStorage.setItem(
                    "UserSession",
                    JSON.stringify({
                        UserCode: parsed.userCode,
                        UserName: parsed.userName,
                        FullName: parsed.completeName,
                        GroupCode: parsed.groupCode,
                        CNCode: parsed.cnCode,
                        expiresIn: parsed.expiresIn,
                        expiryTimeStamp: parsed.expiryTimeStamp,
                    })
                );
            }
            return parsed;
        } catch {
            localStorage.removeItem("auth_user");
        }
    }

    const legacyRaw = localStorage.getItem("UserSession");
    if (legacyRaw) {
        try {
            const legacy: LegacySession = JSON.parse(legacyRaw);
            const expiryTimeStamp =
                legacy.expiryTimeStamp ?? Date.now() + (legacy.expiresIn ?? 0) * 1000;
            if (Date.now() > expiryTimeStamp) {
                localStorage.removeItem("UserSession");
                return null;
            }
            const mapped = mapLegacy(legacy, expiryTimeStamp);
            localStorage.setItem("auth_user", JSON.stringify(mapped));
            return mapped;
        } catch {
            localStorage.removeItem("UserSession");
        }
    }

    return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(hydrate);
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useCallback(() => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        setUser(null);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("UserSession");
    }, []);

    useEffect(() => {
        if (user && user.expiryTimeStamp) {
            const remaining = user.expiryTimeStamp - Date.now();
            if (remaining <= 0) {
                logout();
            } else {
                logoutTimerRef.current = setTimeout(logout, remaining);
            }
        }
        return () => {
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, [user, logout]);

    const login = useCallback(
        async (username: string, password: string): Promise<LoginResult> => {
            try {
                const response = await VerifyUserLogin(username, password);

                if (response === "2") return "badPassword";
                if (response === "3" || response === "4" || response === "5") return "noUser";

                let raw: { UserCode: string; UserName: string; FullName: string; CNCode: string; GroupCode: string };
                try {
                    raw = typeof response === "string" ? JSON.parse(response) : response;
                } catch {
                    return "error";
                }

                if (!raw?.UserCode) return "error";

                const expiresIn = 28800; // 8 hours
                const expiryTimeStamp = Date.now() + expiresIn * 1000;

                const mapped: User = {
                    userCode: raw.UserCode,
                    userName: raw.UserName,
                    completeName: raw.FullName,
                    groupCode: raw.GroupCode,
                    cnCode: raw.CNCode,
                    token: "",
                    expiresIn,
                    expiryTimeStamp,
                };

                localStorage.setItem("auth_user", JSON.stringify(mapped));
                // Persist legacy UserSession key so components still using
                // UserSession() (Transaction, Entry, Reports, Search, modals) keep working.
                localStorage.setItem(
                    "UserSession",
                    JSON.stringify({
                        UserCode: raw.UserCode,
                        UserName: raw.UserName,
                        FullName: raw.FullName,
                        GroupCode: raw.GroupCode,
                        CNCode: raw.CNCode,
                        expiresIn,
                        expiryTimeStamp,
                    })
                );
                setUser(mapped);
                return "ok";
            } catch {
                return "error";
            }
        },
        []
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
