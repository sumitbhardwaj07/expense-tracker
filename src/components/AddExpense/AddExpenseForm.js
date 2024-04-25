import React, { useEffect } from "react";
import ExpenseForm from "./AddExpenseForm";
import ExpenseList from "./ExpenseList";
import { setExpenses } from "../../store/expensesReducer";
import { useDispatch } from "react-redux";
import "./AddExpenseForm.css";


const AddExpenseForm = () => {
  const dispatch = useDispatch();


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
    // eslint-disable-next-line
  }, []);



  return (
    <div className="expense-form-container">
      <ExpenseList fetchExpenses={fetchExpenses} />
      <ExpenseForm />
    
    </div>
  );
};

export default AddExpenseForm;
