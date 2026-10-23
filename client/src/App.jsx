import { useEffect, useMemo, useState } from 'react';
import './App.css';
import React from 'react';

const API_URL = 'http://localhost:3000/expenses';
const PAGE_SIZE_OPTIONS = [5, 8, 10, 20, 30, 40];
const STORAGE_KEY = 'expensePageSize';

function getSavedPageSize() {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    return PAGE_SIZE_OPTIONS.includes(saved) ? saved : 10;
  } catch {
    return 10;
  }
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [pageSize, setPageSize] = useState(getSavedPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadExpenses() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('The API response should be an array of expenses.');
        if (!cancelled) setExpenses(data);
      } catch (err) {
        if (!cancelled) setError('Could not load expenses. Make sure the backend is running on port 3000.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadExpenses();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.ceil(expenses.length / pageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const visibleExpenses = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return expenses.slice(start, start + pageSize);
  }, [expenses, pageSize, safePage]);

  useEffect(() => {
    if (currentPage !== safePage) setCurrentPage(safePage);
  }, [currentPage, safePage]);

  function handlePageSizeChange(event) {
    const size = Number(event.target.value);
    if (!PAGE_SIZE_OPTIONS.includes(size)) return;
    setPageSize(size);
    setCurrentPage(1);
    try { localStorage.setItem(STORAGE_KEY, String(size)); } catch { /* Storage may be unavailable in private contexts. */ }
  }

  const firstItem = expenses.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, expenses.length);

  return (
    <main className="page-shell">
      <section className="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">PERSONAL FINANCE</p>
            <h1>Expenses</h1>
            <p className="subtitle">Review your spending, one page at a time.</p>
          </div>
          <div className="total-card">
            <span>Total expenses</span>
            <strong>{expenses.length}</strong>
          </div>
        </header>

        <section className="toolbar" aria-label="Pagination settings">
          <div className="page-size-control">
            <label htmlFor="page-size">Expenses per page</label>
            <select id="page-size" value={pageSize} onChange={handlePageSizeChange}>
              {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size} per page</option>)}
            </select>
          </div>
          <p className="saved-note"><span className="saved-dot" /> Preference saved on this device</p>
        </section>

        {loading ? (
          <div className="message-state">Loading expenses…</div>
        ) : error ? (
          <div className="message-state error-state">
            <strong>Unable to load expenses</strong>
            <p>{error}</p>
            <button className="secondary-button" onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="message-state">No expenses found.</div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Expense</th><th>Category</th><th>Date</th><th className="amount-cell">Amount</th></tr></thead>
                <tbody>
                  {visibleExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td><div className="expense-name"><span className="expense-icon">₹</span><span>{expense.title || expense.name || 'Expense'}</span></div></td>
                      <td><span className="category-pill">{expense.category || 'General'}</span></td>
                      <td>{expense.date ? new Date(`${expense.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="amount-cell">{formatAmount(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="pagination-footer">
              <p className="range-text">Showing <strong>{firstItem}–{lastItem}</strong> of <strong>{expenses.length}</strong> expenses</p>
              <nav className="pagination" aria-label="Expense pages">
                <button className="page-button" onClick={() => setCurrentPage(1)} disabled={safePage <= 1} aria-label="First page">«</button>
                <button className="page-button page-label" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage <= 1}>Previous</button>
                <span className="page-indicator">Page <strong>{safePage}</strong> of <strong>{totalPages}</strong></span>
                <button className="page-button page-label" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage >= totalPages}>Next</button>
                <button className="page-button" onClick={() => setCurrentPage(totalPages)} disabled={safePage >= totalPages} aria-label="Last page">»</button>
              </nav>
            </footer>
          </>
        )}
        <p className="footer-note">Your page-size preference is stored in localStorage and restored when you refresh.</p>
      </section>
    </main>
  );
}
