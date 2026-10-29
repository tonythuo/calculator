// Shared state (Interface Contract — defined here once, all branches use it)
const calcState = {
  firstNumber: null,
  currentOperator: null,
  displayValue: "0",
  waitingForSecondNumber: false,
  shouldResetDisplay: false
};

// Input (Tony): appendNumber, appendDecimal, backspace,
// handleKeyboard, setupButtons, handleButtonClick
function appendNumber(num) {}
function appendDecimal() {}
function backspace() {}
function handleKeyboard(event) {}
function setupButtons() {}
function handleButtonClick(event) {}

// Logic: add, subtract, multiply, divide, operate,
// chooseOperator, calculate, clearCalculator
function add(a, b) {}
function subtract(a, b) {}
function multiply(a, b) {}
function divide(a, b) {}
function operate(op, a, b) {}
function chooseOperator(op) {}
function calculate() {}
function clearCalculator() {}

// Output (Karim): updateDisplay, showError, roundResult
function updateDisplay(value) {}
function showError(message) {}
function roundResult(number) {}
