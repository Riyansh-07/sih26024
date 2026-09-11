# sih26024 - MERN Stack Skeleton

A clean, modern, and production-ready MERN (MongoDB, Express.js, React + Vite, Node.js) skeleton.

## 📁 Project Structure

```text
sih26024/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Main dashboard UI
│   │   ├── index.css       # Design tokens & styling
│   │   └── main.jsx        # Entry point
│   ├── vite.config.js      # Vite config with /api proxy to localhost:5000
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/
│   │   └── db.js           # Mongoose MongoDB connection
│   ├── models/
│   │   └── Item.js         # Sample Mongoose schema & model
│   ├── routes/
│   │   └── api.js          # /api/health and /api/items routes
│   ├── .env.example        # Environment variable template
│   ├── .env                # Local environment configuration
│   ├── server.js           # Express app entry point
│   └── package.json
│
├── .gitignore
├── package.json            # Root workspace & concurrently runner
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

You can install all dependencies for root, server, and client with:

```bash
npm run install:all
```

Or individually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure MongoDB Atlas

1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Database User and whitelist your IP address (`0.0.0.0/0` for development).
3. Copy your connection string and update `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sih26024?retryWrites=true&w=majority
```

### 3. Run Development Servers

Run both Express backend and React Vite frontend concurrently:

```bash
npm run dev
```

Or run them individually in separate terminals:

- **Backend only:** `npm run dev:server` (Starts at `http://localhost:5000`)
- **Frontend only:** `npm run dev:client` (Starts at `http://localhost:3000`)

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend & MongoDB connection health check |
| `GET` | `/api/items` | Fetch all items |
| `POST` | `/api/items` | Create a new item |
| `DELETE` | `/api/items/:id` | Delete an item by ID |
