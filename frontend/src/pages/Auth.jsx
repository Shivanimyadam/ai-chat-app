import { useState } from "react";
import '../styles/Auth.css';
import axios from "axios";


function Auth({ onLogin }) {

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

      const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
        const url = isLogin ? 'http://localhost:5001/api/auth/login' 
        : 'http://localhost:5001/api/auth/register';
        const payload = isLogin ? { email: formData.email, password: formData.password} :
        formData ;

        const res = await axios.post(url, payload);
        console.log("result axios login ", res);
        onLogin(res.data.token, res.data.username);
    } catch (error) {
         console.log("Full error:", error);
  console.log("Response:", error.response);
        console.error(error.response?.data?.error || 'Something went wrong');
    } finally {
        setLoading(false);
    }
  };

    return (
        <>
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-logo">🤖</div>
                    <h1>AI Chat</h1>
                    <p className="auth-subtitle">
                        {isLogin ? 'Welcome Back!' : 'Create your account'}
                    </p>
                    <div className="auth-tabs">
                        <button className={isLogin ? 'active' : ''}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Login
                        </button>
                        <button
                            className={!isLogin ? 'active' : ''}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Register
                        </button>
                    </div>
                    {!isLogin && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && <p className="auth-error">{error}</p>}
                    <button
                        className="auth-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Auth;