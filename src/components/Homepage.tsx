import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <section className="bg-gray-900 h-screen flex justify-center items-center">
      <div className="text-center p-8 border border-gray-800 rounded shadow-md bg-gray-800 text-white">
        <h1 className="text-3xl mb-8">Welcome to DVisual</h1>
        <p className="text-lg text-gray-500 mb-12">
          A data visualization app that helps you explore and analyze sensor
          consumptions with ease.
        </p>
        <Link href="/register">
          <a className="btn btn-warning">Register</a>
        </Link>
      </div>
    </section>
  );
};

export default Home;
