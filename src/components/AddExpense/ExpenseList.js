import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditingExpenses, setIsEditing } from "../../store/expensesReducer";
import "./ExpenseList.css";
import EditExpenseForm from "./EditExpenseForm";

const ExpenseList = ({ fetchExpenses }) => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const isEditing = useSelector((state) => state.expenses.isEditing);
  const editingExpense = useSelector((state) => state.expenses.editingExpense);

  const filteredYear = useSelector((state) => state.filter.filteredYear);
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear().toString() === filteredYear;
  });

  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );

  const deleteExpenseHandler = async (id) => {
    try {
      const response = await fetch(
        `https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${id}.json`,
        {
          method: "DELETE",
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
    try {
      const response = await fetch(
        `https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${editedExpense.id}.json`,
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
          },
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
