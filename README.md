# Todo List App

A modern React todo list application with Express API backend, Sequelize ORM, and PostgreSQL database, deployed on Netlify.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Add descriptions to todos
- ✅ Modern React UI with responsive design
- ✅ RESTful API with Express
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Serverless deployment on Netlify

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Deployment**: Netlify Functions

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or hosted)
- Netlify account (for deployment)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file or set environment variables in Netlify
   - Add `DATABASE_URL` or `POSTGRES_URL` with your PostgreSQL connection string
   - Example: `DATABASE_URL=postgresql://user:password@host:port/database`

3. Run development server:
```bash
npm run dev
```

4. Run Netlify functions locally:
```bash
npm run netlify:dev
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set environment variables in Netlify dashboard
   - Netlify will automatically build and deploy

## Project Structure

```
todo-netlify/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── netlify/
│   └── functions/         # Netlify serverless functions
│       ├── api.js         # Express app handler
│       ├── config/        # Database configuration
│       ├── controllers/   # API controllers
│       ├── models/        # Sequelize models
│       └── routes/        # Express routes
└── dist/                  # Build output (generated)
```

## Environment Variables

- `NETLIFY_DATABASE_URL` or `POSTGRES_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)
