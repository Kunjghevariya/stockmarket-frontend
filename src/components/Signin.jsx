import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from "react-icons/bs";
import axios from 'axios';
import { Link } from "react-router-dom";


const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8001/api/v1/users/login', {
        username,
        password
      }, {
        withCredentials: true 
      });

      console.log(response.data); 
  
      alert("Login successful");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Invalid username or password");
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
        <div className="submit">
          <button
            type="submit"
            className='w-full bg-violet-500 text-white rounded-xl p-3'
          >
            Submit
          </button>
        </div>
      </form>
      <div className="text-violet-500 pt-10">
        <Link to="/signup">Create New Account</Link>
      </div>
    </div>
  );
};

export default Signin;
