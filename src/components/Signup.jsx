import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from "react-icons/bs";
import axios from 'axios';
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
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

    setLoading(true); // Start loading
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
      navigate('/signin');

    } catch (error) {
      console.error(error);
      alert("Signup failed");
    } finally {
      setLoading(false); // End loading
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
            disabled={loading} // Disable input when loading
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
            disabled={loading} // Disable input when loading
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
            disabled={loading} // Disable input when loading
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
            disabled={loading} // Disable input when loading
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 bg-transparent text-sm text-violet-500"
            disabled={loading} // Disable button when loading
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
            disabled={loading} // Disable input when loading
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 bg-transparent text-sm text-violet-500"
            disabled={loading} // Disable button when loading
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="submit">
          <button
            type="submit"
            className='w-full bg-violet-500 text-white rounded-xl p-3'
            disabled={loading} // Disable submit button when loading
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Signup"
            )}
          </button>
        </div>
      </form>
      <div className="text-violet-500 pt-10">
        <Link to="/signin">Log In</Link>
      </div>
    </div>
  );
};

export default Signup;
