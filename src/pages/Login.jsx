import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { userLogin } from '../redux/actions'
const Login = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleInputs = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({ ...prev, [id]: value }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(userLogin(credentials))
    } catch (error) {
      console.log('error: ', error);
    }
  };

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleInputs}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="********"
            value={credentials.password}
            onChange={handleInputs}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <Link to="/signup">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
