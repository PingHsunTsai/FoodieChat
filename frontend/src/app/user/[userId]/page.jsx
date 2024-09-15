'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Button, List, ListItem, ListItemText, TextField } from '@mui/material';

export default function UserPage({ params }) {
    const { userId } = params;  // Dynamic userId from the URL


    return (
        <div>
          <h1>User Profile for {userId}</h1>
          {/* Display user-specific information */}
        </div>
      );
    };

//     const [loggedInUser, setLoggedInUser] = useState(null);
//     const [friends, setFriends] = useState([]);
//     const [selectedFriend, setSelectedFriend] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         // Fetch the logged-in user's info
//         // Example: apiRequest('/api/me', 'GET')
//         setLoggedInUser({
//             id: 1,
//             name: 'LoggedInUser',
//             email: 'user@example.com'
//         });

//         // Fetch the friends of the logged-in user
//         // Example: apiRequest('/api/friends', 'GET')
//         setFriends([
//             { id: 2, name: 'Friend One', email: 'friend1@example.com' },
//             { id: 3, name: 'Friend Two', email: 'friend2@example.com' },
//         ]);
//     }, []);

//     // Search functionality
//     const handleSearch = (e) => {
//         setSearchQuery(e.target.value);
//         // Optionally, you can filter friends based on the search query
//     };

//     // Function to select a friend from the list
//     const selectFriend = (friend) => {
//         setSelectedFriend(friend);
//         // Fetch chat history or other info related to this friend
//     };

//     return (
//         <Box sx={{ display: 'flex', height: '100vh' }}>
//             {/* Left Side */}
//             <Box sx={{ width: '50%', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
//                 {/* Upper Part: Logged-in User Info and Search/Add Friends */}
//                 <Box sx={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
//                     <h2>{loggedInUser ? loggedInUser.name : 'User Info'}</h2>
//                     <TextField
//                         fullWidth
//                         variant="outlined"
//                         label="Search Friends"
//                         value={searchQuery}
//                         onChange={handleSearch}
//                     />
//                     <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '16px' }}>
//                         Add Friend
//                     </Button>
//                 </Box>

//                 {/* Bottom Part: Friends List */}
//                 <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <List>
//                         {friends
//                             .filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
//                             .map(friend => (
//                                 <ListItem button key={friend.id} onClick={() => selectFriend(friend)}>
//                                     <ListItemText primary={friend.name} secondary={friend.email} />
//                                 </ListItem>
//                             ))}
//                     </List>
//                 </Box>
//             </Box>

//             {/* Right Side */}
//             <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', padding: '16px' }}>
//                 {selectedFriend ? (
//                     <>
//                         <h2>{selectedFriend.name}</h2>
//                         <p>Email: {selectedFriend.email}</p>
//                         {/* Chat Box */}
//                         <Box sx={{ flexGrow: 1, border: '1px solid #ddd', padding: '16px', overflowY: 'auto' }}>
//                             <p>Chat history or messages go here...</p>
//                         </Box>
//                         <Box sx={{ marginTop: '16px' }}>
//                             <TextField fullWidth variant="outlined" label="Type a message..." />
//                             <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '8px' }}>
//                                 Send Message
//                             </Button>
//                         </Box>
//                     </>
//                 ) : (
//                     <p>Select a friend to view their profile and start chatting.</p>
//                 )}
//             </Box>
//         </Box>
//     );
// }
