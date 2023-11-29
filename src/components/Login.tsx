import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  email: string;
  password: string;
}

const Login = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });

  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');

  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', user);
      setShow(response.data.login);
      if (response.data.msg) {
        setMsg(response.data.msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    if (show) {
      router.push('/profile');
    }
  }, [show, router]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('/api/login');
        if (response.data.user) {
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    checkLogin();
  }, [router]);

  const userInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="container" id="formm">
        <div className="row">
          <div className="col-lg-6 col-md-8 col-12 mx-auto">
            {msg ? (
              <div className="alert alert-danger alert-dismissible">
                <button type="button" className="close" data-dismiss="alert">
                  &times;
                </button>
                <strong>ERROR!</strong> {msg}
              </div>
            ) : null}
            <br />
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Email address:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name="email"
                  value={user.email}
                  onChange={userInput}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  value={user.password}
                  onChange={userInput}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            <br />
            <p>
              <a href="/register" className="text-light">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
