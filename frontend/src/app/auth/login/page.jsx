'use client';

import { styles } from '../../../style';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography} from '@mui/material';

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
      router.push(`/user/${resData.data.userId}`); 
      console.log('Success:', resData.message);
    }

  };
  const formstyle = "bg-tertiary py-4 px-6 placeholder:text-secondary text-black rounded-full outline-none border-none font-medium"

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
      <Box
        sx={{            
          display: 'flex', 
          flexDirection: 'column', 
          width: '50%',
        }}
      >
        <Typography 
          variant="h1" 
          textAlign="center"
          sx={{ 
            padding: '30px',
            fontFamily: styles.fontFamily,
            fontSize: '70px',
            fontWeight: 'bold',
            color: styles.gray,
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
          }}
        >
          Foodie login
        </Typography>
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
              className={`${formstyle}`}
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
              className={`${formstyle}`}
            />
          </label>
          <button
              type="submit"
              style={{ backgroundColor: styles.red }}
              className={`${formstyle}`}
          >
            Login
          </button>
          {/* <button type="submit">Login</button> */}
          {error && <p style={{ color: 'red' }}>{error}</p>} 
        </form>
      </Box>
    </Box>
  );
}
