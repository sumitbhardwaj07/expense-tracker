import React, { useEffect } from "react";
import ExpenseList from "./ExpenseList";
import { setExpenses } from "../../store/expensesReducer";
import { useDispatch, useSelector } from "react-redux";
import "./AddExpenseForm.css";
import NewExpense from "./NewExpense";
import ExpensesFilter from "./ExpensesFilter";
import ExpenseChart from "./ExpensesChart";

const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);



  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/expenses/`,{
          method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Correctly set the header
          credentials: "include"
        },
        
      }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      //console.log(data);
      const loadedExpenses = [];
      for (const key in data.data) {
        loadedExpenses.push({
          key: data.data[key]._id,
          id: data.data[key]._id,
          amount: data.data[key].amount,
          description: data.data[key].description,
          date: data.data[key].date,
          category: data.data[key].category,
        });
      }
      //console.log(loadedExpenses)
      dispatch(setExpenses(loadedExpenses));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NewExpense />
      <div className="new-expense">
        <ExpensesFilter />
        <ExpenseChart />
        <ExpenseList fetchExpenses={fetchExpenses} />
      </div>
    </>
  );
};

export default AddExpenseForm;
