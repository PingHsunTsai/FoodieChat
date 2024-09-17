'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });      

    const resData = await res.json();

    if (!resData.success) {
      setError(resData.error || 'An register error occurred');
    } else {
      localStorage.setItem('token', resData.data.token);
      router.push(`/user/${resData.data.userId}`); 
      console.log('Success:', resData.message);
    }

  };

  return (
    <section>
      <h1 className='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2'>
        FoodieChat Login
      </h1>
      <form onSubmit={handleLogin} className="mt-12 flex flex-col gap-8">
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Email
          </span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary
            text-black rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Password
          </span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary
            text-black rounded-lg outline-none border-none font-medium"
          />
        </label>

        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </form>
    </section>
  );
}
