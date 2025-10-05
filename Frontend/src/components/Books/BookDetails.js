import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function BookDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({ rating:5, reviewText:'' });
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetch = async () => {
    const res = await API.get(`/books/${id}`);
    setBook(res.data);
  };

  useEffect(()=>{ fetch(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${id}`, form);
      setForm({ rating:5, reviewText:'' });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Login required');
      nav('/login');
    }
  };

  const deleteBook = async () => {
    if (!confirm('Delete book?')) return;
    try {
      await API.delete(`/books/${id}`);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return !book ? <div>Loading...</div> : (
    <div>
      <h2>{book.title}</h2>
      <div>By {book.author}</div>
      <div>{book.description}</div>
      <div>Avg Rating: {book.avgRating ?? 'N/A'} ({book.reviewCount})</div>
      {user && user.id === book.addedBy?._id && (
        <div style={{marginTop:8}}>
          <Link to={`/edit/${book._id}`}><button>Edit</button></Link>
          <button onClick={deleteBook}>Delete</button>
        </div>
      )}

      <hr />
      <h3>Reviews</h3>
      {book.reviews.length === 0 && <div>No reviews yet</div>}
      {book.reviews.map(r => (
        <div key={r._id} className="card">
          <div><strong>{r.user?.name}</strong> — {r.rating} stars</div>
          <div>{r.reviewText}</div>
        </div>
      ))}

      {user ? (
        <form onSubmit={submitReview} className="card" style={{marginTop:12}}>
          <h4>Leave a review</h4>
          <label>Rating</label>
          <select value={form.rating} onChange={e=>setForm({...form, rating: Number(e.target.value)})}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <textarea value={form.reviewText} onChange={e=>setForm({...form, reviewText:e.target.value})} placeholder="Review" />
          <button type="submit">Submit Review</button>
        </form>
      ) : <div><Link to="/login">Login</Link> to add a review</div>}
    </div>
  );
}
