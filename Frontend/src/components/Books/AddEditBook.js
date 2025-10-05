import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddEditBook({ editMode }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', author:'', description:'', genre:'', year:'' });

  useEffect(()=> {
    if (editMode && id) {
      API.get(`/books/${id}`).then(res => {
        const b = res.data;
        setForm({ title: b.title, author: b.author, description: b.description, genre: b.genre, year: b.year || '' });
      });
    }
  }, [editMode, id]);

  const submit = async e => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/books/${id}`, form);
      } else {
        await API.post('/books', form);
      }
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card">
      <h2>{editMode ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={submit}>
        <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" required />
        <input value={form.author} onChange={e=>setForm({...form, author: e.target.value})} placeholder="Author" />
        <input value={form.genre} onChange={e=>setForm({...form, genre: e.target.value})} placeholder="Genre" />
        <input value={form.year} onChange={e=>setForm({...form, year: e.target.value})} placeholder="Published Year" />
        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description"></textarea>
        <button type="submit">{editMode ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}
