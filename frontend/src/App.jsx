// import React from 'react';
// import Register from '../pages/Register/Register.jsx';
// import Login from '../pages/Login/Login.jsx';
// import  { useContext } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext.jsx";
// import Home from '../pages/Home/Home.jsx';


// const App = () => {

//     const {
//         user,
//         authLoading
//     } = useContext(AuthContext);

//     if (authLoading) {
//         return <div>Checking authentication...</div>;
//     }

//     return (
//         <Routes>

//             <Route
//                 path="/login"
//                 element={
//                     user
//                         ? <Navigate to="/" replace />
//                         : <Login />
//                 }
//             />

//             <Route
//                 path="/register"
//                 element={
//                     user
//                         ? <Navigate to="/" replace />
//                         : <Register />
//                 }
//             />


//              <Route
//                 path="/"
//                 element={
//                     user
//                         ? (
//                            <Home/>
//                         )
//                         : <Navigate to="/login" replace />
//                 }
//             />

//         </Routes>
//     );
// };

// export default App;


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

    if (authLoading) {
        return <div>Checking authentication...</div>;
    }
        console.log(
    "RENDERING APP:",
    window.location.pathname
);
    return (

        <Routes>

            {/* Login */}
            {/* <Route
                path="/login"
                element={
                    user
                        ? <Navigate to="/" replace />
                        : <Login />
                }
            /> */}
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
            {/* Register */}
            {/* <Route
                path="/register"
                element={
                    user
                        ? <Navigate to="/" replace />
                        : <Register />
                }
            /> */}

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
            {/* Public NexusAI Home */}
            <Route
                path="/"
                element={<Home />}
            />

        </Routes>
    );
};

export default App;