import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" required />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" type="email" required />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
