"use client"; 

import Link from 'next/link';
import { motion } from "framer-motion";
import { Button, Switch } from '@mui/material';
import { styled } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';

// Create a custom MUI button style using styled API
// const CustomButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#37474F',  // Gray color similar to the previous button
//   color: '#fff',               // White text color
//   fontSize: '30px',            // Font size for the button
//   padding: '10px 40px',        // Adjust padding for the button
//   borderRadius: '8px',         // Rounded corners
//   '&:hover': {
//     backgroundColor: '#455A64', // Darker gray on hover
//   },
// }));

// Define the thumb animation using motion
const AnimatedThumb = styled(motion.div)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: '#001e3c',
  borderRadius: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
}));

const MaterialUISwitch = styled(({ ...props }) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    checkedIcon={
      <AnimatedThumb
        animate={{ x: [0, 20, 0] }} // Animate the thumb left to right
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    }
  />
))(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-track': {
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const NavigateButton = ({ page }) => {
  let pageName = page.includes("/") ? page.split("/").pop() : page;

  return (
    <Link href={`/${page}`} passHref>
        <motion.div
            className="animatable"
            whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
        >
            <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                label={pageName}
            />
        </motion.div>
    </Link>
  );
};

export default NavigateButton;
