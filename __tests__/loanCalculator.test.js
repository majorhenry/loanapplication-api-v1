const { calculateMonthlyRepayment } = require('../utils/loanCalculator');

describe('Loan Calculator', () => {
  // Test various loan scenarios
  const testScenarios = [
    { principal: 5000, rate: 5.0, months: 36, expectedResult: 149.85 },
    { principal: 10000, rate: 6.5, months: 48, expectedResult: 237.15 },
    { principal: 20000, rate: 4.0, months: 60, expectedResult: 368.33 }
  ];

  testScenarios.forEach(scenario => {
    it(`calculates monthly payment correctly for ${scenario.principal} at ${scenario.rate}% for ${scenario.months} months`, () => {
      const result = calculateMonthlyRepayment(
        scenario.principal, 
        scenario.rate, 
        scenario.months
      );
      expect(result).toBeCloseTo(scenario.expectedResult, 2);
    });
  });

  // Edge case tests
  it('handles zero principal', () => {
    expect(calculateMonthlyRepayment(0, 5.0, 36)).toBe(0);
  });

  it('handles zero interest rate', () => {
    const principal = 5000;
    const months = 36;
    expect(calculateMonthlyRepayment(principal, 0, months))
      .toBe(parseFloat((principal / months).toFixed(2)));
  });
});