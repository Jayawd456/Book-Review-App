import React, { useEffect, useState } from 'react';
import API from '../../api';
import BookCard from './BookCard';
import { Link } from 'react-router-dom';

export default function BookList() {
  const [booksData, setBooksData] = useState({ books: [], page:1, totalPages:1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchBooks = async (p=1) => {
    const res = await API.get('/books', { params: { page: p, search } });
    setBooksData(res.data);
  };

  useEffect(()=>{ fetchBooks(page); }, [page]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks(1);
  };

  return (
    <div>
      <h1>Books</h1>
      <form onSubmit={onSearch} style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title/author/genre" />
        <button>Search</button>
      </form>

      <div>
        {booksData.books.map(b => <BookCard key={b._id} book={b} />)}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button disabled={booksData.page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {booksData.page} / {booksData.totalPages}</span>
        <button disabled={booksData.page>=booksData.totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
