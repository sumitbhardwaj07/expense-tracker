import React, { useState } from "react";
import "./AddExpenseForm.css";


const AddExpenseForm = () => {

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenses, setExpenses] = useState([]);

  const submitHandler = (event) =>{
    event.preventDefault();

    const newExpense = {
      id: Math.random().toString(),
      amount: amount,
      description: description,
      category: category
    };

    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setAmount('');
    setDescription('');
    setCategory('Food');
  }
  return (
    <div className="expense-form-container">
    <form onSubmit={submitHandler} className="expense-form">
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input id="amount" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
      <label htmlFor="category">Category</label>
        <select id="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food ">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Fitness">Fitness</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Travel">Travel</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
        </select>
      </div>
      <button type="submit" className="add-button">Add Expense</button>
      </form>
      <div className="expense-list">
        <h2>Expenses List</h2>
        <ul>
          {expenses.map(expense => (
            <li key={expense.id}>
              {expense.amount} - {expense.description} - {expense.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExpenseForm;
