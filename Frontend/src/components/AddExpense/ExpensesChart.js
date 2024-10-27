import React from "react";
import Chart from "../Chart/Chart";
import { useSelector } from "react-redux";

const ExpenseChart = props =>{
    const filteredYear = useSelector(state => state.filter.filteredYear);
    const expenses = useSelector(state => state.expenses.expenses);
    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear().toString() === filteredYear;
    });

    const chartDataPoints = [
        {label: 'Jan',value:0},
        {label: 'Feb',value:0},
        {label: 'Mar',value:0},
        {label: 'Apr',value:0},
        {label: 'May',value:0},
        {label: 'Jun',value:0},
        {label: 'Jul',value:0},
        {label: 'Aug',value:0},
        {label: 'Sep',value:0},
        {label: 'Oct',value:0},
        {label: 'Nov',value:0},
        {label: 'Dec',value:0},
    ];

    for(const expense of filteredExpenses){
        const expenseMonth = (new Date(expense.date)).getMonth();
        chartDataPoints[expenseMonth].value += parseFloat(expense.amount);
    }

    return <Chart dataPoints={chartDataPoints} />
}

export default ExpenseChart;