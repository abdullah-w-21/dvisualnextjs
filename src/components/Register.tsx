import React, { useState, useEffect, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    organisationname: '',
  });

  const [msg, setMsg] = useState('');
  const router = useRouter();
  axios.defaults.withCredentials = true;

  const onSub = async (e: FormEvent) => {
    e.preventDefault();
    const userData = {
      email: user.email,
      password: user.password,
      organisationname: user.organisationname,
    };

    try {
      let response = await axios.post('/api/register', userData);

      if (response.data.msg) {
        setMsg(response.data.msg);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const userInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-black text-white min-h-screen p-20">
      <div className="mx-auto max-w-md">
        {msg && (
          <div className="alert alert-danger alert-dismissible">
            <button type="button" className="close" data-dismiss="alert">
              &times;
            </button>
            <strong>ERROR!</strong> {msg}
          </div>
        )}
        <form onSubmit={onSub}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email address:</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={userInput}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Password:</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              name="password"
              value={user.password}
              onChange={userInput}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Organisation Name:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter organization name"
              name="organisationname"
              value={user.organisationname}
              onChange={userInput}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
