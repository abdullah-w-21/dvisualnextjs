import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('/api/logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <h1 className="text-3xl">You have been successfully logged out!</h1>
    </div>
  );
};

export default Logout;
