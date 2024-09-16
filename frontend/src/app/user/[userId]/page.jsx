'use client';

require('dotenv').config({ path: '../../../../.env' });
import { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { apiRequest } from '../../../route/api';

export default function UserPage({ params }) {
    const host = process.env.DB_HOST;
    const { userId } = params;

    const [loggedInUser, setLoggedInUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // TODO is there a better way to fetch the logged-in user's info?
    useEffect(() => {
        let isMounted = true;  // Prevents state updates after unmount
    
        const fetchData = async () => {
            try {
                const userRes = await apiRequest('http://localhost:5000/api/getUser', 'GET');
                // const friendsRes = await apiRequest(`${host}api/friends`, 'GET');
                
                if (!isMounted) {
                    setLoggedInUser({
                        id: userRes.user.id,
                        name: userRes.user.userName,
                        email: userRes.user.email,
                    });
                    // setFriends(friendsRes);
                }; 
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false;  // Cleanup function to prevent memory leaks
        };
    }, []);

    // Search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Optionally, you can filter friends based on the search query
    };

    // Function to select a friend from the list
    const selectFriend = (friend) => {
        setSelectedFriend(friend);
        // Fetch chat history or other info related to this friend
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Left Side */}
            <Box 
                sx={{ 
                    padding: '16px',
                    width: '50%', 
                    display: 'flex', 
                    flexDirection: 'column'
                }}
            >
                {/* Upper Part: Logged-in User Info and Search/Add Friends */}
                <Box sx={{paddingY: '16px'}}>
                    <h2>{loggedInUser ? loggedInUser.name : 'User Info'}</h2>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ marginTop: '16px' }}
                    >
                        Explore Foodie
                    </Button>
                </Box>

                {/* Bottom Part: Friends List */}
                <Box 
                    sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto',
                        paddingY: '16px',
                        border: '4px solid white',
                        borderRadius: 10,
                    }}
                >
                    <List>
                        {friends
                            .filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(friend => (
                                <ListItem button key={friend.id} onClick={() => selectFriend(friend)}>
                                    <ListItemText primary={friend.name} secondary={friend.email} />
                                </ListItem>
                            ))}
                    </List>
                </Box>
            </Box>

            {/* Right Side */}
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
                        borderRadius: 10,
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
