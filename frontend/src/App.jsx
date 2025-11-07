import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import CreatePostPage from './pages/CreatePost';
import Profile from './pages/Profile';

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Home />} />
          <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" replace />} />
          <Route path="/create" element={user ? <CreatePostPage /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;