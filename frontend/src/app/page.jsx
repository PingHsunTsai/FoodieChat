import { styles } from '../style';
import  NavigateButtom  from '../components/NavigateButton';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography, IconButton, ListItemAvatar, Avatar } from '@mui/material';

const Home = () => {

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column'}}>

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
            fontFamily: '',
            fontSize: '80px',
            fontWeight: 'bold',
            color: styles.primary,
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
        <NavigateButtom page='auth/login' />
        {/* <NavigateButtom page='auth/register' /> */}
      </Box>
    </Box>
  );
};

export default Home;
