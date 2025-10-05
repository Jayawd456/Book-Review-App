import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <div className="card">
      <h3><Link to={`/book/${book._id}`}>{book.title}</Link></h3>
      <div>Author: {book.author}</div>
      <div>Genre: {book.genre} | Year: {book.year}</div>
      <div>Avg Rating: {book.avgRating ?? 'N/A'} ({book.reviewCount})</div>
    </div>
  );
}
