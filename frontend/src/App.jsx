
import React, { useContext } from "react";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import Home from "../pages/Home/Home.jsx";

const App = () => {

    const {
        user,
        authLoading
    } = useContext(AuthContext);

    return (

        <Routes>

            <Route
                path="/login"
                element={
                    authLoading
                        ? <div>Checking authentication...</div>
                        : user
                            ? <Navigate to="/" replace />
                            : <Login />
                }
            />


            <Route
                path="/register"
                element={
                    authLoading
                        ? <div>Checking authentication...</div>
                        : user
                            ? <Navigate to="/" replace />
                            : <Register />
                }
            />

            <Route
                path="/"
                element={<Home />}
            />

        </Routes>
    );
};

export default App;