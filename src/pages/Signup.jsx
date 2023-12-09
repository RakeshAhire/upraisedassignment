import React, { useState } from 'react';
import { userRegister } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
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
      dispatch(userRegister(credentials))
      navigate("/")
    } catch (error) {
      console.log('error: ', error);
    }
  };

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
            Register
          </button>
          <Link to="/login">Login?</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup