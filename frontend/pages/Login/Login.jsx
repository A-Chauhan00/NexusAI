import React, { useContext, useState } from 'react';
import './Login.css';
import { AuthContext } from '../../src/context/AuthContext.jsx';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation } from "react-router-dom";

const Login = () => {
   console.log("LOGIN COMPONENT RENDERED");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

console.log("LOGIN PATH:", location.pathname);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
     const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

         if (password.length < 8) {
                   setError("Password must be at least 8 characters long.");
                   return;
               }
        setError("");
        setLoading(true);

        try {
            const data = await login(
                email,
                password
            );

            if (data.success) {
                navigate("/");
            } else {
                setError(data.message);
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>

            <form
                className='login-form'
                onSubmit={handleLogin}
                noValidate
            >

                <h1>Login</h1>


                <div className="login-fields">
                    <input
                        type='email'
                        placeholder='e-mail'
                        value={email}
                        onChange={(e) => {setEmail(e.target.value),setError("");}}
                        required
                    />
                </div>

                {/* <div className="login-fields">
                    <input
                        type="password"
                        placeholder='password'
                        value={password}
                        onChange={(e) => {setPassword(e.target.value),setError("");}}
                        required
                    />
                </div> */}

                 <div className="register-fields password-field">
                
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                
                                </div>
                   {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <button
                   className='login-button'
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p>
                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </form>

        </div>
    );
};

export default Login;