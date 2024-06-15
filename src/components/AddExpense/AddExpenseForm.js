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
  const compactedEmail = useSelector(state => state.auth.dummyEmail);
  console.log(compactedEmail);


  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `https://expense-tracker-ce1e9-default-rtdb.asia-southeast1.firebasedatabase.app/${compactedEmail}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      const loadedExpenses = [];
      for (const key in data) {
        loadedExpenses.push({
          id: key,
          amount: data[key].amount,
          description: data[key].description,
          date: data[key].date,
          category: data[key].category,
        });
      }
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
