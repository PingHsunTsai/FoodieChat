'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../route/api';
import { handleError } from '../../../components';

export default function Register() {
  const router = useRouter(); 
  const formRef = useRef()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    console.log(form);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    try {
      const res = await apiRequest(
        'http://localhost:5000/api/register', 
        'POST', 
        { 'email': form.email, 'password': form.password });

      if (res.message) {
        router.push('/auth/login');
      }
      setLoading(false);
    } catch (error) {
      setError(handleError(error));
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2'>
        FoodieChat Register
      </h1>
      <form 
        ref={formRef}
        onSubmit={handleRegister} 
        className="mt-12 flex flex-col gap-8"
      >
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Email
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
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
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary
            text-black rounded-lg outline-none border-none font-medium"
          />
        </label>

        <button
            type="submit"
            className="bg-sky-400 py-3 px-8 outline-none w-fit
            text-white font-bold shadow-md shadow-primary rounded-xl"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </form>
    </section>
  );
}
