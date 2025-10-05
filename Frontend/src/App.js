import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import BookList from './components/Books/BookList';
import BookDetails from './components/Books/BookDetails';
import AddEditBook from './components/Books/AddEditBook';
import Profile from './components/Profile';

function App() {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Home</Link>
        {user ? <Link to="/add">Add Book</Link> : null}
        {user ? <Link to="/profile">Profile</Link> : null}
        {user ? <button onClick={logout}>Logout</button> : <><Link to="/login">Login</Link><Link to="/signup">Signup</Link></>}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/add" element={<AddEditBook />} />
          <Route path="/edit/:id" element={<AddEditBook editMode />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
