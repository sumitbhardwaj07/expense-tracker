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

  const deleteExpenseHandler = (id) => {
    fetch(
      `https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (res.ok) {
          alert("Expense successfully deleted");
          fetchExpenses();
        } else {
          throw new Error("Failed to delete expense");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editExpenseHandler = (expense) => {
    dispatch(setEditingExpenses(expense));
    dispatch(setIsEditing(true));
  };

  const submitEditHandler = (editedExpense) => {
    fetch(
      `https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${editedExpense.id}.json`,
      {
        method: "PUT",
        body: JSON.stringify({
          amount: editedExpense.amount,
          description: editedExpense.description,
          category: editedExpense.category,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          alert("Expense successfully updated");
          fetchExpenses();
        } else {
          throw new Error("Failed to update expense");
        }
      })
      .catch((err) => {
        console.error(err);
      });
    dispatch(setIsEditing(false));
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list">
        <h2>Expenses List</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <span className="expense-details">
                {expense.amount} - {expense.description} - {expense.category}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteExpenseHandler(expense.id)}
              >
                Delete
              </button>
              <button
                className="edit-button"
                onClick={() => editExpenseHandler(expense)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
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
