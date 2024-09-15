'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../route/api';
import { handleError, drinkOptions, foodOptions, countryOptions } from '../../../components';


const renderOptions = (options) => {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
};


export default function Register() {
  const router = useRouter(); 
  const formRef = useRef()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    userName: '',
    favoriteDrink: '',
    favoriteFood: '',
    livingCountry: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    try {
      const res = await apiRequest(
        'http://localhost:5000/api/register', 
        'POST', 
        { 'email': form.email, 
          'password': form.password,
          'userName': form.userName,
          'favoriteDrink': form.favoriteDrink,
          'favoriteFood': form.favoriteFood,
          'livingCountry': form.livingCountry, 
        });
      setLoading(false);
      if (res.message) { router.push('/auth/login'); }
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
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your User Name
          </span>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Enter your user name"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary
            text-black rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Favorite Drink
          </span>
          <select
            name="favoriteDrink"
            value={form.favoriteDrink}
            onChange={handleChange}
            className="bg-tertiary py-4 px-6 text-black rounded-lg outline-none border-none font-medium"
          >
            <option value="">Select your favorite drink</option>
            {renderOptions(drinkOptions)}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Favorite Food
          </span>
          <select
            name="favoriteFood"
            value={form.favoriteFood}
            onChange={handleChange}
            className="bg-tertiary py-4 px-6 text-black rounded-lg outline-none border-none font-medium"
          >
            <option value="">Select your favorite food</option>
            {renderOptions(foodOptions)}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-4">
            Your Living Country
          </span>
          <select
            name="livingCountry"
            value={form.livingCountry}
            onChange={handleChange}
            className="bg-tertiary py-4 px-6 text-black rounded-lg outline-none border-none font-medium"
          >
            <option value="">Select your living country</option>
            {renderOptions(countryOptions)}
          </select>
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
