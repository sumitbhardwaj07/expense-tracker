import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authReducer";
import expensesReducer from "./expensesReducer";
import filterReducer from "./filterReducer";

const store = configureStore({
    reducer: {auth: authReducer, expenses: expensesReducer, filter: filterReducer },
});

export default store;
