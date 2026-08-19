import { createContext, useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    registerUser,
    logoutUser
} from "../api/authApi.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getCurrentUser();

                if (data.success) {
                    setUser(data.user);
                }

            } catch (error) {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);

        if (data.success) {
            setUser(data.user);
        }

        return data;
    };

    const register = async (name, email, password) => {
        const data = await registerUser(
            name,
            email,
            password
        );

        if (data.success) {
            setUser(data.user);
        }

        return data;
    };

    const logout = async() => {
        try {
        await logoutUser();
        setUser(null);
    } catch (error) {
        console.error("Logout failed:", error);
    }
    };

    const contextValue = {
        user,
        setUser,
        authLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;