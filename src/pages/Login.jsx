
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import CustomLoading from '../components/CustomLoading';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // loading state

  if (user?.token) {
    return <Navigate to={user.role === 'admin' ? '/admin/members' : '/member/classes'} replace />;
  }

  const handle = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(window.localStorage.getItem('role') === 'admin' ? '/admin/members' : '/member/classes');
    } catch {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };


  
  const baseBtn =
    "px-4 py-2 text-white font-semibold rounded shadow transition duration-300";
  
  const greenGradient =
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="p-6 bg-white shadow-lg space-y-4" onSubmit={handle}>
        <h2 className="text-xl font-semibold">Login</h2>
        <input
          className="border p-2 w-full"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className={`${baseBtn} ${greenGradient} text-sm w-full py-2`}>Login</button>
        <p className="text-sm">
          No account? <Link className="text-blue-500" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
