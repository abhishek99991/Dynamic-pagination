# Dynamic Expense Pagination

A beginner-friendly React + Vite frontend and Express backend demo. It lets users choose how many expenses to show per page and saves the choice in localStorage.

## Requirements
- Node.js 18 or newer
- npm

## Run the backend
Open a terminal in the project root (`dynamic-expense-pagination`):

```bash
npm install
npm start
```

The API runs at http://localhost:3000. Visit http://localhost:3000/expenses to see the sample JSON data.

## Run the frontend
Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## Features
- Select 5, 8, 10, 20, 30, or 40 expenses per page.
- Stores the selection under `expensePageSize` in localStorage and restores it after refresh.
- First, Previous, Next, and Last page controls.
- Correct page count and item range.
- Handles empty results and clamps the current page when the total page count changes.
- Sample API data contains 47 expenses to make pagination easy to test.

## Notes
The backend uses in-memory sample data so the project works without a database. Data resets when the server restarts. Replace the sample array in `server.js` with your database query when integrating your own backend.
