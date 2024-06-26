import React, { useEffect, useState } from "react";

const EditExpenseForm = ({ expense, EditHandler }) => {
  const [editedExpense, setEditedExpense] = useState(expense);

  

  useEffect(() => {
    setEditedExpense(expense);
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setEditedExpense({ ...editedExpense, date: newDate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EditHandler(editedExpense);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="1"
            step="1"
            name="amount"
            required
            value={editedExpense.amount}
            onChange={handleChange}
          />
        </div>
        <div className="new-expense__control">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            required
            value={editedExpense.description}
            onChange={handleChange}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2019-01-01"
            max="2030-12-31"
            name="date"
            value={editedExpense.date}
            onChange={handleDateChange}
          />
        </div>
        <div className="new-expense__control">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            required
            value={editedExpense.category}
            onChange={handleChange}
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
        <div className="new-expense__actions">
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default EditExpenseForm;
