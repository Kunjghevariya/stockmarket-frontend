import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from "react-icons/bs";
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('https://stockmarket-portfolio-backend.onrender.com/api/v1/users/register', {
        fullname,
        email,
        username,
        password,
      }, {
        withCredentials: true,
      });

      console.log(response); 
      alert("Signup successful");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-52'>
      <div className="profile mb-8">
        <div className="bg-white rounded-full p-2">
          <BsFillPersonFill size={90} color='violet' />
        </div>
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="fullname">
          <input
            type="text"
            placeholder='Enter Your Full Name'
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="email">
          <input
            type="email"
            placeholder='Enter Your Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="username">
          <input
            type="text"
            placeholder='Enter Your Username'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="password relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter Your Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 bg-transparent text-sm text-violet-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="confirm-password relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm Your Password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 bg-transparent text-sm text-violet-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="submit">
          <button
            type="submit"
            className='w-full bg-violet-500 text-white rounded-xl p-3'
          >
            Signup
          </button>
        </div>
      </form>
      <div className=" text-violet-500 pt-10">
      <Link to="/signin">Log In</Link>      </div>
    </div>
  );
}

export default Signup;
