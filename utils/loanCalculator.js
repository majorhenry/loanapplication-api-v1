/*
    Calculate the monthly repayment amount using the following formula:
    M = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
    Where:
    M = Monthly repayment amount
    P = Loan amount
    r = Monthly interest rate (annual_interest_rate / 12 / 100)
    n = Number of months (loan term)
*/

const calculateMonthlyRepayment = (principal, annualInterestRate, termMonths) => {
    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    // Calculate monthly repayment amount using the formular
    const monthlyRepayment = 
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) / 
        (Math.pow(1 + monthlyInterestRate, termMonths) - 1);

    // Return the monthly repayment amount to 2 decimal places
    return parseFloat(monthlyRepayment.toFixed(2));
};

module.exports = { calculateMonthlyRepayment };
