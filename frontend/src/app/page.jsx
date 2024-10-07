import { styles } from '../style';
import  NavigateButtom  from '../components/NavigateButton';
import Link from 'next/link';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography, IconButton, ListItemAvatar, Avatar } from '@mui/material';

const Home = () => {

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
        justifyContent: 'center', 
        backgroundColor: styles.orange, 
      }}
    >
      <Box 
        sx={{ 
            padding: '50px',
            height: '30%', 
            display: 'flex', 
            flexDirection: 'column',
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
      </Box>
      <Box 
        sx={{ 
            padding: '16px',
            height: '70%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
        }}
      >
        <NavigateButtom page='auth/register' />
        <Box
          sx={{
            display: 'flex',           // Use flexbox to align items horizontally
            justifyContent: 'center',  // Center the text horizontally
            alignItems: 'center',      // Align the text vertically
            gap: '20px',               // Add some space between the texts
          }}
        >
          <Typography 
            variant="h1" 
            textAlign="center"
            sx={{ 
              padding: '10px',         // Fix padding here
              fontFamily: styles.fontFamily,
              fontSize: '40px',
              fontWeight: 'bold',
              color: styles.white,
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',
            }}
          >
            Click To Join Us!!
          </Typography>

          <Link href="/auth/login" passHref>
            <Typography 
              variant="h1" 
              textAlign="center"
              sx={{ 
                padding: '10px',       // Fix padding here
                fontFamily: styles.fontFamily,
                fontSize: '40px',
                fontWeight: 'bold',
                color: styles.red,
                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',     // Add pointer cursor to indicate it's clickable
              }}
            >
              login
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
