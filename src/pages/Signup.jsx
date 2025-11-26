// src/pages/Signup.jsx
import React, { useState } from 'react';
import apiFetch from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await apiFetch('/api/v1/users/register', {
        method: 'POST',
        body: form,
      });

      navigate('/signin');
    } catch (err) {
      setError(err.data?.message || 'Registration error');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-96">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input name="fullname" placeholder="Full Name"
          className="border p-2 rounded w-full mb-3"
          value={form.fullname} onChange={onChange} />

        <input name="email" placeholder="Email"
          className="border p-2 rounded w-full mb-3"
          value={form.email} onChange={onChange} />

        <input name="username" placeholder="Username"
          className="border p-2 rounded w-full mb-3"
          value={form.username} onChange={onChange} />

        <input name="password" placeholder="Password" type="password"
          className="border p-2 rounded w-full mb-3"
          value={form.password} onChange={onChange} />

        <button className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700">
          Sign Up
        </button>

        <p className="text-center mt-3 text-sm">
          Already have an account? <Link className="text-violet-600" to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
