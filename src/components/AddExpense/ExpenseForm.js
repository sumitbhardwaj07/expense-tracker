import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { addExpense, setShowNewExpenseForm } from "../../store/expensesReducer";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");

  //const showForm = useSelector((state) => state.expenses.showNewExpenseForm);

  const closeForm = () =>{
      dispatch(setShowNewExpenseForm(false));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    fetch(
      "https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json",
      {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
          description: description,
          date: date,
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
        dispatch(
          addExpense({ id: data.name, amount, description, date, category })
        );
        alert("Expense added successfully");
        closeForm();
      })
      .catch((err) => {
        alert(err.Message);
      });

    setAmount("");
    setDescription("");
    setDate("");
    setCategory("Food");
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
        <button type="button" onClick={closeForm}>Cancel</button>
          <button type="submit">Add Expense</button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;
