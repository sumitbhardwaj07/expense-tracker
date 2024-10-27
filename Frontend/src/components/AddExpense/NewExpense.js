import { useDispatch, useSelector } from "react-redux";
import ExpenseForm from "./ExpenseForm"
import './NewExpense.css';
import { setShowNewExpenseForm } from "../../store/expensesReducer";

const NewExpense = () =>{
    const dispatch = useDispatch();
    const showForm = useSelector((state) => state.expenses.showNewExpenseForm);

    const openForm = () =>{
        dispatch(setShowNewExpenseForm(true));
    };
    return (
        <div className="new-expense">
            {!showForm && <button onClick={openForm}>Add New Expense</button>}
            {showForm && <ExpenseForm />}
        </div>
    )
};
 
export default NewExpense;