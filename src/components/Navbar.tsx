import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Navbar = () => {
  const [login, setLogin] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('/api/login'); 
        setLogin(response.data.login);
        setForceRender((prev) => !prev); 
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLogin();
  }, [forceRender]); 

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-white text-2xl font-bold">Dvisual</a>
        </Link>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li className="text-white">
              <Link href="/">
                <a className="hover:text-gray-300">Home</a>
              </Link>
            </li>
            <li className="text-white">
              {!login ? (
                <Link href="/login">
                  <a className="hover:text-gray-300">Login</a>
                </Link>
              ) : (
                <Link href="/logout">
                  <a className="hover:text-gray-300">Logout</a>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
