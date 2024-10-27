import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  filteredYear: 2023,
  filteredExpenses: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,

  reducers: {
    // addExpense(state, action) {
    //   state.expenses.push(action.payload);
    // },
    // deleteExpense(state, action) {
    //   state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    // },
    // updateExpense(state, action) {
    //   const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
    //   if (index !== -1) {
    //     state.expenses[index] = action.payload;
    //   }
    // },
    setFilteredYear(state, action) {
      state.filteredYear = action.payload;
    },
    //  setFilteredExpenses(state, action) {
    //      state.filteredExpenses = state.expenses.filter(expense => expense.date.getFullYear().toString()== action.payload);
    //  },
  },
});

export const { setFilteredYear } = filterSlice.actions;
export default filterSlice.reducer;
