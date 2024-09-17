'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';

export const handleLogout = (router) => {
    localStorage.removeItem('token');
    router.push('/auth/login');
};

export default function UserPage() {

    const router = useRouter();
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };
    
                // Run both requests in parallel
                const [userRes, friendsRes] = await Promise.all([
                    fetch('/api/getUser', { method: 'GET', headers }),
                    fetch('/api/getFriends', { method: 'GET', headers }),
                ]);
    
                const userData = await userRes.json();
                if (!userData.success) {
                    throw new Error(userData.error || 'An error occurred while fetching user');
                }
    
                const friendsData = await friendsRes.json();
                if (!friendsData.success) {
                    throw new Error(friendsData.error || 'An error occurred while fetching friends');
                }
    
                // Set both user and friends data
                setLoggedInUser({
                    id: userData.data.user.id,
                    name: userData.data.user.userName,
                    email: userData.data.user.email,
                });
    
                setFriends(friendsData.data);
    
                console.log('User fetched successfully:', userData.message);
                console.log('Friends fetched successfully:', friendsData.message);
            } catch (error) {
                setError(error.message || 'An error occurred');
            }
        }

        fetchData();
    }, []);

    const navExplore = () => {
        router.push(`/explore/${loggedInUser.id}`); 
    }

    const selectFriend = (friend) => {
        setSelectedFriend(friend);
        // Fetch chat history or other info related to this friend
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box 
                sx={{ 
                    padding: '16px',
                    width: '50%', 
                    display: 'flex', 
                    flexDirection: 'column'
                }}
            >
                <Box sx={{paddingY: '16px'}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{
                            width: '50%', 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}>
                            <Typography variant="h4" textAlign="center">
                                {loggedInUser ? loggedInUser.name : 'User Info'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: '50%', 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}>
                            <Button 
                            variant="outlined" 
                            color="primary" 
                            sx={{ marginTop: '16px' }}
                            onClick={() => handleLogout(router)}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth 
                        sx={{ marginTop: '16px' }}
                        onClick={navExplore}
                    >
                        Explore Foodie
                    </Button>
                </Box>
                <Box 
                    sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto',
                        paddingY: '16px',
                        border: '4px solid white',
                        borderRadius: 5,
                    }}
                >
                    <List>
                        {/* {friends
                            .filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(friend => (
                                <ListItem button key={friend.id} onClick={() => selectFriend(friend)}>
                                    <ListItemText primary={friend.name} secondary={friend.email} />
                                </ListItem>
                            ))} */}
                    </List>
                </Box>
            </Box>

            <Box 
                sx={{ 
                    padding: '16px',
                    width: '50%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    }}
            >
                <Box 
                    sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto',
                        padding: '16px',
                        border: '4px solid white',
                        borderRadius: 5,
                    }}
                >
                    {selectedFriend ? (
                        <>
                            <h2>{selectedFriend.name}</h2>
                            <p>Email: {selectedFriend.email}</p>
                            {/* Chat Box */}
                            <Box sx={{ flexGrow: 1, border: '1px solid #ddd', padding: '16px', overflowY: 'auto' }}>
                                <p>Chat history or messages go here...</p>
                            </Box>
                            <Box sx={{ marginTop: '16px' }}>
                                <TextField fullWidth variant="outlined" label="Type a message..." />
                                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '8px' }}>
                                    Send Message
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <p>Select a friend to view their profile and start chatting.</p>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
