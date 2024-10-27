import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, setShowNewExpenseForm } from "../../store/expensesReducer";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");


  const token = useSelector(state=> state.auth.token);


  const closeForm = () => {
    dispatch(setShowNewExpenseForm(false));
  };

  const submitHandler = async (event) => {
    
    event.preventDefault();
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/expenses/create`,
        {
          method: "POST",
          body: JSON.stringify({amount, description, date, category }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token here
            credentials: "include",
          },
          
        }
      );
      //.log("Response Status:", response.status);
      //console.log("Response Text:", await response.text());
  
      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Failed to add expense!";
        if (data && data.error) {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log(data);
      dispatch(addExpense({ amount, description, date, category }));
      alert("Expense added successfully");
      closeForm();
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="1"
            step="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="new-expense__control">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2019-01-01"
            max="2030-12-31"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="new-expense__control">
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
        <div className="new-expense__actions">
          <button type="button" onClick={closeForm}>
            Cancel
          </button>
          <button type="submit">Add Expense</button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;
