import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Social Connect
          </Link>

          <div className="flex items-center gap-4 text-sm sm:text-base">
            {user ? (
              <>
                <span className="text-gray-800">Hi, {user.name}</span>
                <Link to="/feed" className="text-gray-800 hover:text-blue-600 transition-colors">Feed</Link>
                <Link to="/create" className="text-gray-800 hover:text-blue-600 transition-colors">Create</Link>
                <Link to={`/profile/${user.id || user._id}`} className="text-gray-800 hover:text-blue-800 transition-colors">Profile</Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}