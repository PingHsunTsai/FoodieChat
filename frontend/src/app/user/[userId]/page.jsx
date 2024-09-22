'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography, IconButton, ListItemAvatar, Avatar } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';
import { ConstructionOutlined } from '@mui/icons-material';

export const handleLogout = (router) => {
    localStorage.removeItem('token');
    router.push('/auth/login');
};

export default function UserPage() {

    const router = useRouter();
    const [token, setToken] = useState(null);
    const [headers, setHeaders] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // const eventSourceRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const local_token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${local_token}`,
                };
                setToken(local_token);
                setHeaders(headers);
    
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
    
                setLoggedInUser({
                    id: userData.data.user.id,
                    name: userData.data.user.userName,
                    email: userData.data.user.email,
                });
                setFriends(friendsData.data.friends);

            } catch (error) {
                console.log(error.message || 'An error occurred');
            }
        }

        fetchData();
    }, []);

    // Setup SSE when a receiver is selected
    useEffect(() => {
        //TODO: cookie token
        if (!selectedReceiver || !loggedInUser) {
        return;
        }
        console.log('selectedReceiver', selectedReceiver.id);
        const eventSource = new EventSource(
        `/api/streamMsg/?userId=${loggedInUser.id}&receiverId=${selectedReceiver.id}&token=${token}`, 
        { method: 'GET', headers }
        );

        eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        eventSource.onerror = () => {
        console.error('Error in SSE connection');
        eventSource.close();
        };

        return () => {
        eventSource.close();
        console.log('SSE connection closed');
        };
    }, [selectedReceiver, loggedInUser, headers]);  // Re-run if receiver, user, or headers change

    const navExplore = () => {
        router.push(`/explore/${loggedInUser.id}`); 
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const res = await fetch('/api/sendMsg', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                senderId: loggedInUser.id,
                receiverId: selectedFriend.id,
                content: newMessage,
            }),
        });

        const message = await res.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage('');
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
                    <List dense={false}>
                        {friends.map((item) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="comments" 
                                        color='info' 
                                        onClick={() => setSelectedReceiver(item.friend)}
                                    >
                                        <CommentIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <SearchIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.friend.userName}
                                />
                            </ListItem>
                        ))}
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
                        padding: '16px',
                        border: '4px solid white',
                        borderRadius: 5,
                    }}
                >
                    {selectedReceiver ? (
                        <Box>
                            <Typography variant="h3" textAlign="center">
                                {selectedReceiver.userName}
                            </Typography>
                            <Typography variant="h5" textAlign="center">
                                {selectedReceiver.email}
                            </Typography>
                            {/* Chat Box */}
                            <Box 
                                sx={{ 
                                    flexGrow: 1, 
                                    height:350, 
                                    border: '1px solid #ddd', 
                                    padding: '16px', 
                                    overflowY: 'auto' 
                                }}
                            >
                                <List>
                                    {messages.map((msg, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={msg.senderId === loggedInUser.id? 'You' : 'Friend'}
                                                secondary={msg.content}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                {/* <p>Chat history or messages go here...</p> */}
                            </Box>
                            <Box sx={{ marginTop: '16px' }}>
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    maxRows={4}
                                    fullWidth
                                    label="Send msg here!"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    InputLabelProps={{
                                        sx: {
                                          color: '#fff', // Default label color
                                          '&.Mui-focused': {
                                            color: 'info.dark', // Label color when focused
                                          },
                                        },
                                    }}
                                    sx={{
                                        backgroundColor: '#000', // Ensure a visible background
                                        '& .MuiInputBase-input': {
                                          color: 'lightgray', // Ensure the text is visible
                                        },
                                        '& .MuiOutlinedInput-root': {
                                          '& fieldset': {
                                            borderColor: '#fff', // Set outline color
                                          },
                                        },
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    sx={{ marginTop: '8px' }}
                                    onClick={sendMessage}
                                >
                                    Send Message
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="h3" textAlign="center">
                            Catch up with a friend!
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
