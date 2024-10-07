'use client';

import { styles } from '../../../style';
import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography} from '@mui/material';
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
    
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': form.email, 
        'password': form.password,
        'userName': form.userName,
        'favoriteDrink': form.favoriteDrink,
        'favoriteFood': form.favoriteFood,
        'livingCountry': form.livingCountry, 
      }),
    });     

    setLoading(false);

    const resData = await res.json();

    if (!resData.success) {
      setError(resData.error || 'An register error occurred');
    } else {
      router.push('/auth/login');
      console.log('Success:', resData.message);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed',       
        top: 0,                  
        left: 0,                 
        right: 0,                
        bottom: 0,               
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: styles.orange, 
        overflow: 'auto',
      }}
    >
      <Typography 
        variant="h1" 
        textAlign="center"
        sx={{ 
          padding: '60px',
          fontFamily: styles.fontFamily,
          fontSize: '100px',
          fontWeight: 'bold',
          color: styles.white,
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        FoodieChat
      </Typography>
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
            style={{ backgroundColor: styles.red }}
            className=" py-3 px-8 outline-none w-fit
            text-white font-bold shadow-md shadow-primary rounded-xl"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </form>
      </Box>
  );
}
