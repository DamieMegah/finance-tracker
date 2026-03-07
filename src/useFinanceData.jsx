import { useState, useEffect } from "react";

export const useFinanceData = () => {

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("finance_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("finance_budget");
    return saved ? Number(saved) : 1000;
  });

  useEffect(() => {
    localStorage.setItem(
      "finance_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finance_budget", budget);
  }, [budget]);

  const addTransaction = (txn) => {

    const newTxn = {
      id: Date.now(),
      ...txn,
      amount: Number(txn.amount)
    };

    setTransactions((prev) => [...prev, newTxn]);
  };

  const getMonthlyTransactions = () => {

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const calculateMetrics = () => {

    const monthly = getMonthlyTransactions();

    const income = monthly
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthly
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      budgetUsed: ((expenses / budget) * 100).toFixed(1),
      overBudget: expenses > budget
    };
  };

  const categorySpending = () => {

    const monthly = getMonthlyTransactions();

    const categories = {
      Food: 0,
      Transport: 0,
      Bills: 0,
      Shopping: 0,
      Other: 0
    };

    monthly.forEach((t) => {

      if (t.type === "expense") {
        categories[t.category] += t.amount;
      }

    });

    return Object.keys(categories).map((key) => ({
      name: key,
      value: categories[key]
    }));
  };

  return {
    transactions,
    addTransaction,
    calculateMetrics,
    categorySpending,
    budget,
    setBudget
  };
};
