

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  editingExpense: null,
  isEditing: false,

};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    deleteExpense(state, action) {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    updateExpense(state, action) {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    setEditingExpenses(state, action) {
      state.editingExpense = action.payload;
    },
    setIsEditing(state, action){
      state.isEditing = action.payload;
    },
    setExpenses(state, action) {
      state.expenses = action.payload;
    }
  },
});

export const { addExpense, deleteExpense, updateExpense, setEditingExpenses, setIsEditing, setExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
