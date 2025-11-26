// src/pages/Signin.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiFetch from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/api/v1/users/login', {
        method: 'POST',
        body: form,
      });

      login(data.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-96">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border p-2 rounded w-full mb-3"
          value={form.username}
          onChange={onChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-3"
          value={form.password}
          onChange={onChange}
        />

        <button className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700">
          Login
        </button>

        <p className="text-center mt-3 text-sm">
          Create an account? <Link className="text-violet-600" to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
