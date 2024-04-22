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

  const handleSubmit = (e) => {
    e.preventDefault();
    EditHandler(editedExpense);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={editedExpense.amount}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={editedExpense.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default EditExpenseForm;
