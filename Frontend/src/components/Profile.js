import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [myBooks, setMyBooks] = useState([]);

  useEffect(()=> {
    const fetchMyBooks = async () => {
      const res = await API.get('/books', { params: { page:1 } });
      setMyBooks(res.data.books.filter(b => b.addedBy === user.id || (b.addedBy && b.addedBy._id === user.id)));
    };
    if (user) fetchMyBooks();
  }, []);

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      <div>Email: {user.email}</div>
      <h3>My Books</h3>
      {myBooks.length === 0 && <div>No books added</div>}
      {myBooks.map(b => (
        <div key={b._id} className="card">
          <Link to={`/book/${b._id}`}>{b.title}</Link>
        </div>
      ))}
    </div>
  );
}
