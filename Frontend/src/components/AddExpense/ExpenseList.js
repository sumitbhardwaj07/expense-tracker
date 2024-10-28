import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditingExpenses, setIsEditing } from "../../store/expensesReducer";
import "./ExpenseList.css";
import EditExpenseForm from "./EditExpenseForm";

const ExpenseList = ({ fetchExpenses }) => {
  const [expenseCount, setExpenseCount] = useState(5); // Default to 5 expenses
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const isEditing = useSelector((state) => state.expenses.isEditing);
  const editingExpense = useSelector((state) => state.expenses.editingExpense);

  const filteredYear = useSelector((state) => state.filter.filteredYear);
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear().toString() === filteredYear;
  }).slice(0, expenseCount);
  const token = useSelector(state => state.auth.token);

  //const [expenseCount, setExpenseCount] = useState(5); // Default to 5 expenses

  useEffect(() => {
    // Retrieve saved preference from local storage on component mount
    const savedCount = localStorage.getItem("expenseCount");
    if (savedCount) {
      setExpenseCount(parseInt(savedCount));
    }
  }, []);

  const handleExpenseCountChange = (event) => {
    const count = parseInt(event.target.value);
    setExpenseCount(count);
    localStorage.setItem("expenseCount", count); // Save preference to local storage
  };

  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  const deleteExpenseHandler = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token here
            credentials: "include",
          }
        }
        
      );
  
      if (response.ok) {
        alert("Expense successfully deleted");
        fetchExpenses();
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editExpenseHandler = (expense) => {
    dispatch(setEditingExpenses(expense));
    dispatch(setIsEditing(true));
  };

  const submitEditHandler = async (editedExpense) => {

    //console.log(editedExpense.date)
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/expenses/${editedExpense.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            amount: editedExpense.amount,
            description: editedExpense.description,
            date: editedExpense.date,
            category: editedExpense.category,
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token here
            credentials: "include",
          }
        }
      );
  
      if (response.ok) {
        alert("Expense successfully updated");
        fetchExpenses();
      } else {
        throw new Error("Failed to update expense");
      }
    } catch (err) {
      console.error(err);
    }
  
    dispatch(setIsEditing(false));
  };
  const formatDate = (date) => {
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.toLocaleString("en-US", { day: "2-digit" });
    const year = date.getFullYear();
    return { month, day, year };
  };

  return (
    <div className="expense-list-container">
      <h2>Expenses List</h2>

      <div className="expense-count-selector">
        <label htmlFor="expenseCount">Show expenses:</label>
        <select id="expenseCount" value={expenseCount} onChange={handleExpenseCountChange}>
          {[5, 10, 15, 20].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>


      <table className="expense-table">
        <thead>
          <tr>
            <th>
              <div className="date-box-container">
                <div className="date-box">
                  <div className="month">Month</div>
                  <div className="year">Year</div>
                  <div className="day">Day</div>
                </div>
              </div>
            </th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="date-box-container">
                  <div className="date-box">
                    <div className="month">
                      {formatDate(new Date(expense.date)).month}
                    </div>
                    <div className="year">
                      {formatDate(new Date(expense.date)).year}
                    </div>
                    <div className="day">
                      {formatDate(new Date(expense.date)).day}
                    </div>
                  </div>
                </div>
              </td>

              <td>{expense.description}</td>
              <td>Rs{expense.amount}</td>
              <td>{expense.category}</td>
              <td>
                <button onClick={() => deleteExpenseHandler(expense.id)}>
                  Delete
                </button>
                <button onClick={() => editExpenseHandler(expense)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2"></td>
            <td>
              <strong style={{ color: 'white' }}>Total:Rs{totalAmount}</strong>
            </td>
             <td colSpan="2"></td> 
          </tr>
        </tbody>
      </table>
      {isEditing && (
        <div className="edit-form-container">
          <h2>Edit Expense</h2>
          <EditExpenseForm
            expense={editingExpense}
            EditHandler={submitEditHandler}
          />
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
