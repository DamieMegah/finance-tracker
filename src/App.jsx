import { useState } from "react";
import "./App.css";
import { useFinanceData } from "./useFinanceData";
import { Calendar, TrendingUp, Wallet, ArrowUpDown } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function App() {

  const {
    transactions,
    addTransaction,
    calculateMetrics,
    categorySpending,
    budget,
    setBudget
  } = useFinanceData();

  const metrics = calculateMetrics();

  const [form, setForm] = useState({
    amount: "",
    desc: "",
    category: "Food",
    type: "expense",
    date: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || !form.desc || !form.date) return;

    addTransaction(form);

    setForm({
      amount: "",
      desc: "",
      category: "Food",
      type: "expense",
      date: ""
    });
  };

  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashFlowData = [
    { name: "Income", value: incomeTotal },
    { name: "Expenses", value: expenseTotal }
  ];

  const categoryData = categorySpending();

  return (
    <div className="container">

      <header className="header">
        <h1>FinTrackerr-<span>ONE</span></h1>
        <p>Monthly income and spending insights</p>
      </header>

      <div className="metrics-grid">

        <MetricCard
          title="Income"
          value={`₦${metrics.income}`}
          icon={<TrendingUp />}
        />

        <MetricCard
          title="Expenses"
          value={`₦${metrics.expenses}`}
          icon={<Wallet />}
        />

        <MetricCard
          title="Balance"
          value={`₦${metrics.balance}`}
          icon={<Calendar />}
        />

        <MetricCard
          title="Budget Used"
          value={`${metrics.budgetUsed}%`}
          icon={<ArrowUpDown />}
        />

      </div>

      <div className="main-layout">

        <section className="card">

          <h3>Add Transaction</h3>

          <form onSubmit={handleSubmit} className="form-group">

            <input
              type="number"
              required
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <input
              type="text"
              required
              placeholder="Description"
              value={form.desc}
              onChange={(e) =>
                setForm({ ...form, desc: e.target.value })
              }
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <button type="submit">
              Add Transaction
            </button>

          </form>

          <div style={{ marginTop: "1.5rem" }}>

            <h3>Monthly Budget</h3>

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(Number(e.target.value))
              }
            />

            <p>
              {metrics.overBudget
                ? "Over budget"
                : "Within budget"}
            </p>

          </div>

        </section>

        <section>

          <div className="chart-container">

            <h3>Cash Flow</h3>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={cashFlowData}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value">

                  <Cell fill="var(--success)" />
                  <Cell fill="var(--danger)" />

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className="chart-container">

            <h3>Expenses by Category</h3>

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={categoryData}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="var(--danger)"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className="card">

            <h3>Transactions</h3>

           <div className="card">

  <h3>Transactions</h3>

  <table className="history-table">

    <thead>
      <tr>
        <th>Description</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>

      {transactions.map((t) => (

        <tr key={t.id}>

          <td>{t.desc} ({t.category})</td>

          <td>{t.type}</td>

          <td className={t.type === "expense" ? "expense-text" : "income-text"}>
            {t.type === "expense" ? "-" : "+"} ₦{t.amount}
          </td>

          <td>{t.date}</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

          </div>

        </section>

      </div>

    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="metric-card">

      <div className="icon-box">
        {icon}
      </div>

      <div>
        <small>{title}</small>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          {value}
        </div>
      </div>

    </div>
  );
}
