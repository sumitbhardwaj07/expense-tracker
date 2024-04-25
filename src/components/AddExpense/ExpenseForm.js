import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense } from "../../store/expensesReducer";
import "./AddExpenseForm.css";

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const submitHandler = (event) => {
    event.preventDefault();

    fetch(
      "https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json",
      {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
          description: description,
          category: category,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "failed to add expense!";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        dispatch(addExpense({id: data.name, amount, description, category}));
        alert("Expense added successfully");
      })
      .catch((err) => {
        alert(err.Message);
      });

    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  return (
    <form onSubmit={submitHandler} className="expense-form">
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Fitness">Fitness</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Travel">Travel</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
        </select>
      </div>
      <button type="submit" className="add-button">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
