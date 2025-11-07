import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, User } from "lucide-react";
import API from "../api";
import { setUser } from "../redux/slices/userSlice";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(setUser(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl max-w-md w-full p-8 border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join <span className="font-semibold text-indigo-600">SocialConnect</span> today!
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 mt-2 text-white font-semibold rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-md ${loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline transition-all duration-200"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
