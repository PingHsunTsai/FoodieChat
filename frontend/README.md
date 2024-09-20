This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Foodie Architecture

```
chat-app/
├── backend/                  # Backend folder
│   ├── src/                  # Source folder for Next.js (starting from Next.js 13+)        
│   │   ├── config/           # Config of data base
│		│   ├── controllers/      # Controller logic for handling requests (user, friends, token)
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
    │   │   │   ├── login.tsx
    │   │   │   ├── register.tsx
    │   │   ├── explore/      # provide the search algorithms over the all users base on the connection
    │   │   │   ├── page.tsx  # Real-time chat interface
    │   │   ├── user/         # user profiles together with friend management and Chat-related components 
    │   │   │   ├── page.tsx
    │   ├── components/       # React Context for managing global state
    │   ├── styles/           # Global styles (CSS/SCSS or styled-components)
    └── .env.local            # DB ip config
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
