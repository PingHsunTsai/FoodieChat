## Foodie Architecture
```
chat-app/
├── backend/                  # Backend folder
│   ├── src/                  # Source folder for Next.js (Next.js 13+)        
│   │   ├── config/           # Config of data base
│   │   ├── controllers/      # Controller logic for handling requests (user, friends, token)
│   │   ├── models/           # Database models (PostgreSQL : User, Friend ...)
│   │   ├── routes/           # API endpoints manager
│   │   └── app.js            # Main backend entry point (Express server)
│   └── .env.local            # private config to key...
└── frontend/                 # Frontend folder
    ├── public/               # Public assets (images, fonts, etc.)
    ├── src/                  # Source folder for Next.js (starting from Next.js 13+)
    │   ├── app/              # The root app folder (Next.js 13+ format)
    │   │   ├── layout.tsx    # Shared layout across all pages
    │   │   ├── page.tsx      # Main page (e.g., Home)
    │   │   ├── api/          # Next.js api endpoints manager
    │   │   ├── auth/         # Authentication-related pages
    │   │   ├── explore/      # provide the search algorithms over the all users base on the connection
    │   │   ├── user/         # user profiles together with friend management and Chat-related components 
    │   ├── components/       # React Context for managing global state
    │   ├── styles/           # Global styles (CSS/SCSS or styled-components)
    └── .env.local            # DB ip config
```
