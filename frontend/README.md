# HomeBite Frontend

React-based frontend for HomeBite - Home-cooked Meals Marketplace

## Setup

### Prerequisites
- Node.js 18+ and npm
- Backend Django server running on port 8000

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React Context (Auth)
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Features

- **Authentication**: Login, signup (customer/cook), profile management
- **Browse Meals**: Search and filter home-cooked meals
- **Orders**: Place orders, track status, rate meals
- **Cook Dashboard**: Manage meals and orders
- **Responsive Design**: Mobile-friendly using Bootstrap 5

## Technologies

- React 18
- React Router 6
- Axios for API calls
- Bootstrap 5 for styling
- Vite for build tooling
- React Leaflet for maps

## API Integration

The frontend communicates with the Django REST API backend. API endpoints are proxied through Vite dev server to avoid CORS issues during development.

Backend API base URL: `http://localhost:8000/api`

## Environment Variables

Create a `.env` file in the frontend directory (optional):

```
VITE_API_URL=http://localhost:8000/api
```
