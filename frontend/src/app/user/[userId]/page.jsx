'use client';
import { styles } from '../../../style';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, List, ListItem, ListItemText, InputBase , Typography, IconButton, ListItemAvatar, Avatar } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';

export const handleLogout = async  (router) => {
    const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('Logout:', res.message);
    router.push('/auth/login');
};

export default function UserPage() {

    const router = useRouter();
    const messagesEndRef = useRef(null);
    const [headers, setHeaders] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const [conversationId, setConversationId] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                };
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
        if (!selectedReceiver || !loggedInUser) {
            return;
        }
        const eventSource = new EventSource(
            `/api/streamMsg/?userId=${loggedInUser.id}&receiverId=${selectedReceiver.id}`, 
            { method: 'GET', headers }
        );
        eventSource.onmessage = (event) => {
            const conversation = JSON.parse(event.data);
            setConversationId(conversation.conversationId);
            setMessages(conversation.msg);
        };

        eventSource.onerror = () => {
            console.error('Error in SSE connection');
            eventSource.close();
        };

        return () => {
            eventSource.close();
            console.log('SSE connection closed');
        };
    }, [selectedReceiver, loggedInUser, newMessage]);  // Re-run if [...] change

    useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages]);

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
                conversationId: conversationId,
                content: newMessage,
            }),
        });
        setNewMessage('');
    };

    return (
        <Box 
            sx={{ 
            position: 'fixed',       
            top: 0,                  
            left: 0,                 
            right: 0,                
            bottom: 0,               
            display: 'flex', 
            backgroundColor: styles.orange, 
            }}
        >
            <Box 
                sx={{ 
                    padding: '16px',
                    width: '50%', 
                    display: 'flex', 
                    flexDirection: 'column'
                }}
            >
                <Box 
                    sx={{
                        paddingY: '16px',
                    }}
                >
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{
                            width: '70%', 
                            display: 'flex', 
                            flexDirection: 'column' ,
                            alignItems: 'left', 
                        }}>
                            <Typography 
                            variant="h1" 
                            sx={{ 
                                padding: '30px',
                                fontFamily: styles.fontFamily,
                                fontSize: '70px',
                                fontWeight: 'bold',
                                color: styles.white,
                                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                            }}
                            >
                                {loggedInUser ? loggedInUser.name : 'User Info'}
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: '30%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'right',
                        }}>
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    marginTop: '60px',
                                    height: '40px',
                                    width: '140px',
                                    backgroundColor: styles.red,
                                    borderRadius: '20px',
                                }}
                                onClick={navExplore}
                            >
                                <Typography 
                                    variant="h1" 
                                    textAlign="center"
                                    sx={{ 
                                        padding: '15px',
                                        fontFamily: styles.fontFamily,
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        color: styles.white,
                                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    Explore
                                </Typography>
                            </Button>
                        </Box>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                marginTop: '60px',
                                marginRight: '40px',
                                height: '40px',
                                width: '100px',
                                borderRadius: '20px',
                                backgroundColor: styles.red,
                                }}
                            onClick={() => handleLogout(router)}
                        >
                            <Typography 
                                variant="h1" 
                                textAlign="center"
                                sx={{ 
                                    padding: '15px',
                                    fontFamily: styles.fontFamily,
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    color: styles.white,
                                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                Logout
                            </Typography>
                        </Button>
                    </Box>
                </Box>
                <Box 
                    sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto',
                        alignSelf: 'center',
                        width: '95%',
                        backgroundColor: styles.white,
                        boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.8)',  
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
                                        sx={{ color: styles.red }}
                                        onClick={() => setSelectedReceiver(item.friend)}
                                    >
                                        <CommentIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: styles.orange }} >
                                        <SearchIcon sx={{ color: styles.red }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.friend.userName}
                                    sx={{
                                        padding: '5px',
                                        fontFamily: styles.fontFamily,
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        color: 'black',
                                        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',               
                                      }}
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
                        overflowY: 'auto',
                        alignSelf: 'center',
                        width: '95%',
                        backgroundColor: styles.white,
                        boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.8)',  
                        borderRadius: 5,
                    }}
                >
                    {selectedReceiver ? (
                        <Box>
                            <Box 
                                sx={{ 
                                    padding: '25px',
                                    alignSelf: 'center',
                                    backgroundColor: 'transparent',
                                    boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.8)',  
                                }}
                            >
                                <Typography 
                                    variant="h1" 
                                    textAlign="left"
                                    sx={{ 
                                        marginTop: '10px',
                                        fontFamily: styles.fontFamily,
                                        fontSize: '50px',
                                        fontWeight: 'bold',
                                        color: styles.orange,
                                        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    {selectedReceiver.userName}
                                </Typography>
                                <Typography 
                                    variant="h1" 
                                    textAlign="left"
                                    sx={{ 
                                        marginTop: '16px',
                                        fontFamily: styles.fontFamily,
                                        fontSize: '30px',
                                        fontWeight: 'bold',
                                        color: styles.orange,
                                        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    {selectedReceiver.email}
                                </Typography>
                            </Box>
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
                                    {messages.length === 0 ? (
                                        <Typography variant="body2"></Typography>
                                    ) : (
                                        messages.map((msg) => (
                                            <ListItem
                                                sx={{
                                                    justifyContent: msg.senderId === loggedInUser.id ? 'flex-start' : 'flex-end', 
                                                }}
                                            >
                                                <ListItemText
                                                    sx={{
                                                        textAlign: msg.senderId === loggedInUser.id ? 'left' : 'right', 
                                                        maxWidth: '60%', 
                                                    }}
                                                    primary={
                                                        <Typography 
                                                            sx={{
                                                                fontFamily: styles.fontFamily,
                                                                fontSize: '15px',
                                                                fontWeight: 'bold',
                                                                color: 'black',
                                                                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',               
                                                            }}
                                                        >
                                                         {msg.senderId === loggedInUser.id ? 'You:' : selectedReceiver.userName+':'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                        sx={{
                                                            fontFamily: styles.fontFamily,
                                                            fontSize: '15px',
                                                            fontWeight: 'bold',
                                                            color: 'black',
                                                            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',               
                                                        }} 
                                                        >
                                                            {msg.content}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </List> 
                            </Box>
                            <Box 
                                sx={{ 
                                    marginTop: '16px',
                                    display: 'flex', 
                                    height: '125px',        
                                    alignItems: 'center',    
                                    gap: '16px',  
                                    boxShadow: 'inset 0px 5px 10px rgba(0, 0, 0, 0.8)',           
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 2, flex: 1 }}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Send msg here!"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ 
                                        marginRight: '40px',
                                        height: '40px',
                                        width: '100px',
                                        borderRadius: '20px',
                                        backgroundColor: styles.red,
                                        }}
                                    onClick={sendMessage}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography 
                            variant="h1" 
                            textAlign="center"
                            sx={{ 
                                marginTop: '300px',
                                fontFamily: styles.fontFamily,
                                fontSize: '40px',
                                fontWeight: 'bold',
                                color: styles.white,
                                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            Catch up with a friend!
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
