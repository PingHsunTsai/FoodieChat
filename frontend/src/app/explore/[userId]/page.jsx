'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, List, ListItem, ListItemText, Avatar, ListItemAvatar, InputBase , IconButton , Paper, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

export default function ThreeRowsLayout() {
    
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [strangers, setStrangers] = useState([]);

    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        async function fetchStrangers() {

            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            const strangerRes = await fetch('/api/getStrangers', { method: 'GET', headers })
            const strangerData = await strangerRes.json()
            
            if (!strangerData.success) {
                throw new Error(strangerData.error || 'An error occurred while fetching user');
            }

            setStrangers(strangerData.data);
            console.log('Stranger fetched successfully:', strangerData.message);
        }
        fetchStrangers()
      }, [])

    const handleSearch = async () => {
        // console.log('Search query:', searchQuery);
        // try {
            
        //     const notFriendsRes = await apiRequest('http://localhost:5000/api/getNotFriends', 'GET');

        //     if (notFriendsRes){
        //         setNotFriends(notFriendsRes)
        //     } else {
        //         console.log('No results found');
        //     }
        // } catch (error) {
        //     console.error('Error fetching non-friends:', error);
        // }
    };

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            height: '15%', 
            paddingY: '16px',
          }}
        >
            <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
            >
                <IconButton 
                    sx={{ p: '10px' }} 
                    aria-label="menu"
                    onClick={handleBack}
                >
                    <MenuIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Foodie"
                    inputProps={{ 'aria-label': 'Search Foodie' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton 
                    type="button" 
                    sx={{ p: '10px' }} 
                    aria-label="search"
                    onClick={handleSearch}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Box>
        <Box
          sx={{
            height: '20%', 
            paddingY: '16px',
            border: '4px solid white',
            borderRadius: 5,
          }}
        >
          <Typography variant="h4" textAlign="center">Optimize search</Typography>
        </Box>
        <Box
          sx={{
            height: '65%', 
            paddingY: '16px',
            border: '4px solid white',
            borderRadius: 5,
          }}
        >
            {/* <Typography variant="h4" textAlign="center">Depth search</Typography> */}
            <List dense={false}>
                {strangers.map((notFriend) => (
                    <ListItem
                        key={notFriend.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="add">
                                <AddIcon />
                            </IconButton>
                    }
                    >
                    <ListItemAvatar>
                        <Avatar>
                            <SearchIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={notFriend.userName}
                    />
                    </ListItem>
                ))}
            </List>
        </Box>
      </Box>
    );
  }
