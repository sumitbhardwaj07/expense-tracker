import React from "react";
import "./ExpensesFilter.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredYear } from "../../store/filterReducer";

const ExpensesFilter = () => {
  const dispatch = useDispatch();
  const dropdownChangeHandler = (event) => {
    dispatch(setFilteredYear(event.target.value));
  };
  const filteredYear = useSelector((state) => state.filter.filteredYear);
  
  const options = Array.from({ length: 31 }, (_, index) => 2000 + index);

  return (
    <div className="expenses-filter">
      <div className="expenses-filter__control">
        <label>Filter by year</label>
        <select value={filteredYear} onChange={dropdownChangeHandler}>
        {options.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
