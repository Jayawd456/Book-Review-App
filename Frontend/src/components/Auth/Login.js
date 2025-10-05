import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" type="email" required />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
