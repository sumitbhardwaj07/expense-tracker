import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import { setExpenses } from "../../store/expensesReducer";
import { useDispatch } from "react-redux";
import "./AddExpenseForm.css";
import NewExpense from "./NewExpense";
import ExpensesFilter from "./ExpensesFilter";
import ExpenseChart from "./ExpensesChart";
import { Base_URL } from "../UI/Helper";

const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('accessToken');
  const [ expenses, setExpense ] = useState([]);
  const [loading, setLoading] = useState(true); 


  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Base_URL}/api/v1/expenses/`,{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
        },
        
      }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      //console.log(data);
      const loadedExpenses = data.data.map(expense => ({
        key: expense._id,
        id: expense._id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        category: expense.category,
      }));
      //console.log(loadedExpenses)
      dispatch(setExpenses(loadedExpenses));
      setExpense(loadedExpenses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        {loading ? (
          <p>Loading...</p> // Placeholder for loading state
        ) : (
          <ExpenseList expenses={expenses} loading={loading} />
        )}
      </div>
    </>
  );
};

export default AddExpenseForm;
