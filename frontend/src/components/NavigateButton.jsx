"use client"; 

import { styles } from '../style';
import Link from 'next/link';
import { motion } from "framer-motion";
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';

// Define the pizza animation using motion
const AnimatedPizza = styled(motion.div)(({ }) => ({
  width: '290px',
  height: '290px',
  backgroundImage: `url('/assets/pizza.png')`,
  backgroundSize: 'cover',           // Make sure the image covers the thumb
  backgroundPosition: 'center',      // Center the image
  borderRadius: '50%',
  position: 'relative',
  filter: 'grayscale(0%) brightness(0.95)',
}));

// Create the button with animated pizza
const AnimatedButton = styled(Button)(({ theme }) => ({
  width: '800px',
  height: '300px',
  borderRadius: '150px',
  backgroundColor: styles.red,
//   backgroundImage: `url('/assets/tomato.png')`,  
//   backgroundSize: 'cover',                     
//   backgroundPosition: 'center',                
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.8)',  
}));

const NavigateButton = ({ page }) => {
  let pageName = page.includes("/") ? page.split("/").pop() : page;

  return (
    <Link href={`/${page}`} passHref>
      <motion.div
        className="animatable"
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Button with animated pizza */}
        <AnimatedButton>
          <AnimatedPizza
            animate={{ x: [0, 250, 0] }} // Animate pizza left to right
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </AnimatedButton>
      </motion.div>
    </Link>
  );
};

export default NavigateButton;
