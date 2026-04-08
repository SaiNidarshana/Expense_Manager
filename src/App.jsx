import React, { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="App">
      <h1>Advanced Expense Manager</h1>
      <ExpenseForm onAdd={addExpense} />

      <hr />

      <ExpenseSummary expenses={expenses} total={totalExpenses} />

      <hr />

      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}
function ExpenseForm({ onAdd }) {
  const categories = [
    "Food",
    "Travel",
    "Bills",
    "Entertainment",
    "Shopping",
    "Others",
  ];

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date,
    };
    onAdd(newExpense);
    setAmount("");
    setDescription("");
    setCategory(categories[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add Expense</h2>
      <div>
        <label>Amount ₹</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Lunch"
        />
      </div>
      <div>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
}
function ExpenseSummary({ expenses, total }) {
  const monthlySums = expenses.reduce((acc, e) => {
    const month = e.date.slice(0, 7); // "2025-01"
    acc[month] = (acc[month] || 0) + e.amount;
    return acc;
  }, {});

  const categorySums = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="expense-summary">
      <h2>Reports & Summary</h2>
      <div className="report">
        <h3>Total Expenses</h3>
        <p>₹{total.toFixed(2)}</p>
      </div>
      <div className="report">
        <h3>Monthly Expenses</h3>
        {Object.entries(monthlySums).map(([month, sum]) => (
          <p key={month}>
            {month}: ₹{sum.toFixed(2)}
          </p>
        ))}
      </div>
      <div className="report">
        <h3>Category-wise Expenses</h3>
        {Object.entries(categorySums).map(([cat, sum]) => (
          <p key={cat}>
            {cat}: ₹{sum.toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  );
}

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty">No expenses yet.</p>;
  }

  return (
    <div className="expense-list">
      <h2>Expense History</h2>
      {expenses.map((e) => (
        <div key={e.id} className="expense-item">
          <span className="date">{e.date || "N/A"}</span>
          <span className="desc">{e.description || "No description"}</span>
          <span className="category">{e.category}</span>
          <span className="amount">₹{e.amount.toFixed(2)}</span>
          <button className="delete-btn" onClick={() => onDelete(e.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;