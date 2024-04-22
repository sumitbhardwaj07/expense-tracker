import React, { useEffect, useState } from "react";
import "./AddExpenseForm.css";
import { useDispatch, useSelector } from "react-redux";
import {addExpense, setEditingExpenses, setIsEditing, setExpenses} from "../../store/expensesReducer";
import EditExpenseForm from "./EditExpenseForm";

const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const isEditing = useSelector((state) => state.expenses.isEditing); 
  const editingExpense = useSelector((state) => state.expenses.editingExpense);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  //const [editingExpense, setEditingExpense] = useState(null);
  //const [isEditing, setIsEditing] = useState(false);

  const fetchExpenses = () => {
    fetch(
      "https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json"
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch expenses");
        }
      })
      .then((data) => {
        const loadedExpenses = [];
        for (const key in data) {
          loadedExpenses.push({
            id: key,
            amount: data[key].amount,
            description: data[key].description,
            category: data[key].category,
          });
        }
        dispatch(setExpenses(loadedExpenses));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);


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
  }

  const submitEditHandler = (editedExpense) => {
    console.log(editedExpense);
    fetch(`https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${editedExpense.id}.json`, 
    {
      method: "PUT",
      body: JSON.stringify({
        amount: editedExpense.amount,
        description: editedExpense.description,
        category: editedExpense.category
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if(res.ok) {
        alert("Expense successfully updated");
        fetchExpenses();
      } else {
        throw new Error("Failed to update expense")
      }
    })
    .catch((err) => {
      console.error(err);
    });
    dispatch(setIsEditing(false));
  }

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
    <div className="expense-form-container">
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
        <button type="submit" className="add-button">
          Add Expense
        </button>
      </form>
      <div className="expense-list">
        <h2>Expenses List</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.amount} - {expense.description} - {expense.category}
              <button onClick={() => deleteExpenseHandler(expense.id)}>Delete</button>
              <button onClick={() => editExpenseHandler(expense)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
      {isEditing && (
        <div >
          <h2>Edit Expense</h2>
          <EditExpenseForm expense={editingExpense} EditHandler={submitEditHandler} />
        </div>
      )}
    </div>
  );
};

export default AddExpenseForm;