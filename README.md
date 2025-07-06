# Expense Tracker

A modern expense tracking application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Track income and expenses
- Set and manage budgets
- View analytics and spending patterns
- Responsive design with beautiful UI

## Database Setup

This application requires MongoDB to store your financial data. You have two options:

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition:**
   - **macOS:** `brew install mongodb-community`
   - **Ubuntu/Debian:** Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
   - **Windows:** Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

2. **Start MongoDB:**
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
   - **Windows:** Start MongoDB as a Windows service or run `mongod.exe`

3. **Verify MongoDB is running:**
   ```bash
   # This should connect without errors
   mongosh
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address in Network Access
5. Get your connection string from the "Connect" button
6. Update your `.env.local` file with the Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local` and update the `MONGODB_URI` if needed
   - For local MongoDB, the default URI should work: `mongodb://localhost:27017/expense-tracker`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### MongoDB Connection Issues

If you see `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`:

1. **Check if MongoDB is running:**
   ```bash
   # Try to connect with mongosh
   mongosh
   ```

2. **Start MongoDB if it's not running:**
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
   - **Windows:** Start the MongoDB service

3. **Check MongoDB status:**
   - **macOS:** `brew services list | grep mongodb`
   - **Linux:** `sudo systemctl status mongod`

### Cache Issues

If you encounter webpack cache errors, clear the Next.js cache:
```bash
rm -rf .next
npm run dev
```

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/
│   ├── models/       # MongoDB models
│   ├── db.ts         # Database connection
│   └── utils.ts      # Utility functions
└── hooks/           # Custom React hooks
```