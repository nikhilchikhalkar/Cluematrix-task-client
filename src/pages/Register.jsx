

import React, { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import CustomLoading from '../components/CustomLoading';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(name, email, password);
      await api.post('/auth/register', { name, email, password, role: 'member' });
      alert('Registered! You can now log in.');
      navigate('/');
    } catch (error) {
      alert('Registration failed. Please try again.');
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
        <h2 className="text-xl font-semibold">Member Registration</h2>
        <input
          className="border p-2 w-full"
          type="text"
          required
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <button  className={`${baseBtn} ${greenGradient} text-sm w-full py-2`}>Register</button>
        <p className="text-sm">
          No account? <Link className="text-blue-500" to="/">Login</Link>
        </p>
      </form>
      
    </div>
  );
}
