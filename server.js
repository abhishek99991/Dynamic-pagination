const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Sample data so the pagination UI works immediately. Replace with your database/API data.
const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Health'];
const expenses = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: [
    'Groceries', 'Bus pass', 'Internet bill', 'Lunch', 'Pharmacy',
    'Fuel', 'Coffee', 'Electricity bill', 'Household items', 'Dinner'
  ][i % 10],
  category: categories[i % categories.length],
  amount: [450, 120, 899, 260, 340, 700, 95, 1350, 580, 420][i % 10],
  date: new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10)
}));

app.get('/', (_req, res) => {
  res.send('Expense API is running! Try GET /expenses');
});

app.get('/expenses', (_req, res) => {
  res.json(expenses);
});

app.listen(PORT, () => {
  console.log(`Expense API running at http://localhost:${PORT}`);
  console.log(`Sample expenses available at http://localhost:${PORT}/expenses`);
});
