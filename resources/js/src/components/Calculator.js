import React, { useState } from 'react';

const Calculator = ({ initialAmount }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [result, setResult] = useState(0);

  const calculate = (operator) => {
    switch (operator) {
      case '+':
        setResult(result + amount);
        break;
      case '-':
        setResult(result - amount);
        break;
      case '*':
        setResult(result * amount);
        break;
      case '/':
        setResult(result / amount);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h3>Calculator</h3>
      <p>Current Amount: {amount}</p>
      <p>Result: {result}</p>
      <button onClick={() => calculate('+')}>+</button>
      <button onClick={() => calculate('-')}>-</button>
      <button onClick={() => calculate('*')}>*</button>
      <button onClick={() => calculate('/')}>/</button>
    </div>
  );
};

export default Calculator;