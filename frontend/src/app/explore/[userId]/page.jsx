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
    const [recommendations, setRecommendations] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false);

    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        async function fetchStrangers() {

            const headers = {
                'Content-Type': 'application/json',
            };
            const [strangerRes, recommendationRes] = await Promise.all([
              fetch('/api/getStrangers', { method: 'GET', headers }),
              fetch('/api/getRecommendations', { method: 'GET', headers }),
          ]);
            const strangerData = await strangerRes.json()
            const recommendation = await recommendationRes.json()
            
            if (!strangerData.success) {
                throw new Error(strangerData.error || 'An error occurred while fetching stranger Data');
            }
            if (!recommendation.success) {
              throw new Error(recommendation.error || 'An error occurred while fetching recommendation Data');
          }
            console.log('recommendation.data):', recommendation.data);
            setStrangers(strangerData.data);
            setRecommendations(recommendation.data);
        }
        fetchStrangers()
      }, [updateFlag])

    const handleAddFriend = async (friendId) => {

        const addFriendRes = await fetch('/api/addFriend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              friendId,
            }),
          });      
      
        const addFriendData = await addFriendRes.json()
        
        if (!addFriendData.success) {
            throw new Error(addFriendData.error || 'An error occurred while adding friend');
        }

        console.log('Add friend successfully:', addFriendData.message);
        setUpdateFlag(prevFlag => !prevFlag);
    }

    const handleSearch = async () => {
        throw new Error('Not Implemented Error');
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
            height: '42.5%', 
            paddingY: '16px',
            border: '4px solid white',
            borderRadius: 5,
            overflowY: 'auto',
          }}
        >
            <List dense={false}>
                {recommendations.map((recommendation) => (
                    <ListItem
                        key={recommendation.id}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                aria-label="add" 
                                color='info' 
                                onClick={() => handleAddFriend(recommendation.id)}
                            >
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
                            primary={recommendation.userName}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
        <Box
          sx={{
            height: '42.5%', 
            paddingY: '16px',
            border: '4px solid white',
            borderRadius: 5,
            overflowY: 'auto', 
          }}
        >
            <List dense={false}>
                {strangers.map((stranger) => (
                    <ListItem
                        key={stranger.id}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                aria-label="add" 
                                color='info' 
                                onClick={() => handleAddFriend(stranger.id)}
                            >
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
                            primary={stranger.userName}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
      </Box>
    );
  }
