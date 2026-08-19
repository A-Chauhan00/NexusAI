import React, { useContext, useState } from 'react';
import './Register.css';
import { AuthContext } from '../../src/context/AuthContext.jsx';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

   

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
    setError("Please enter your name.");
    return;
}
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
        const data = await register(
            name.trim(),
            email.trim().toLowerCase(),
            password
        );

            if (data.success) {
                navigate("/");
            } else {
                setError(data.message);
            }

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='register-container'>

            <form
                className='register-form'
                onSubmit={handleRegister}
                noValidate
            >

                <h1>Register</h1>

               

                <div className="register-fields">
                    <input
                        type='text'
                        placeholder='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                          required
                    />
                </div>

                <div className="register-fields">
                    <input
                        type='email'
                        placeholder='e-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                         required
                    />
                </div>

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
                    <p className="registration-error">
                        {error}
                    </p>
                )}

                <button
                    className='register-button'
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p>
                    Already have an account?

                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </form>

        </div>
    );
};

export default Register;