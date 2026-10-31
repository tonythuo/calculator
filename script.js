/**
 * Shared calculator state, defined once and used by every layer.
 *
 * @property {number|null} firstNumber - Left operand of the pending operation.
 * @property {string|null} currentOperator - Pending operator: "+", "-", "*", "/".
 * @property {string} displayValue - Digits currently shown on screen.
 * @property {boolean} waitingForSecondNumber - True after an operator is chosen.
 * @property {boolean} shouldResetDisplay - True when the next digit replaces the display.
 */
const calcState = {
  firstNumber: null,
  currentOperator: null,
  displayValue: "0",
  waitingForSecondNumber: false,
  shouldResetDisplay: false
};

/**
 * Replaces the display value and clears the reset flag so typing continues from it.
 * @param {string} value - New display value.
 * @returns {void}
 */
function startFreshEntry(value) {
  calcState.displayValue = value;
  calcState.shouldResetDisplay = false;
}

/**
 * Appends a single digit to the current display value.
 * @param {string} num - One digit, "0" through "9".
 * @returns {void}
 */
function appendNumber(num) {
  if (calcState.shouldResetDisplay || calcState.displayValue === "0") {
    startFreshEntry(num);
  } else {
    calcState.displayValue += num;
  }
  updateDisplay(calcState.displayValue);
}

/**
 * Adds a decimal point to the display, unless one already exists there.
 * @returns {void}
 */
function appendDecimal() {
  if (calcState.shouldResetDisplay) {
    startFreshEntry("0.");
  } else if (!calcState.displayValue.includes(".")) {
    calcState.displayValue += ".";
  } else {
    return;
  }
  updateDisplay(calcState.displayValue);
}

/**
 * Removes the last character from the display, falling back to "0" when empty.
 * @returns {void}
 */
function backspace() {
  if (calcState.shouldResetDisplay) {
    startFreshEntry("0");
  } else {
    calcState.displayValue = calcState.displayValue.slice(0, -1);
    if (calcState.displayValue === "") calcState.displayValue = "0";
  }
  updateDisplay(calcState.displayValue);
}

/**
 * Routes keypresses to the same functions the buttons use.
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function handleKeyboard(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key;
  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Escape") {
    clearCalculator();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === ".") {
    appendDecimal();
  } else {
    return;
  }
  event.preventDefault();
}

/**
 * Attaches click listeners to every calculator button and the keyboard handler.
 * @returns {void}
 */
function setupButtons() {
  document.querySelectorAll(".buttons button").forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
  document.addEventListener("keydown", handleKeyboard);
}

/**
 * Dispatches a button click to the function matching its data-number,
 * data-operator, or id attribute.
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleButtonClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    appendNumber(button.dataset.number);
  } else if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
  } else if (button.id === "equals") {
    calculate();
  } else if (button.id === "clear") {
    clearCalculator();
  } else if (button.id === "decimal") {
    appendDecimal();
  } else if (button.id === "backspace") {
    backspace();
  }
}

setupButtons();

/**
 * Adds two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number} a + b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a.
 * @param {number} a
 * @param {number} b
 * @returns {number} a - b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number} a * b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b.
 * @param {number} a
 * @param {number} b
 * @returns {number} a / b
 * @throws {Error} "Cannot divide by zero" when b is 0.
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

/**
 * Runs the math function matching the operator string.
 * @param {string} op - One of "+", "-", "*", "/"; anything else returns b unchanged.
 * @param {number} a
 * @param {number} b
 * @returns {number} The operation's result.
 */
function operate(op, a, b) {
  switch (op) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return b;
  }
}

/**
 * Stores the chosen operator, first evaluating any pending operation
 * so chains like 12 + 7 - 5 work.
 * @param {string} op - One of "+", "-", "*", "/".
 * @returns {void}
 */
function chooseOperator(op) {
  if (
    calcState.firstNumber !== null &&
    calcState.currentOperator !== null &&
    !calcState.shouldResetDisplay
  ) {
    const result = calculate();
    if (result === null) return;
    calcState.firstNumber = result;
    updateDisplay(result);
  } else {
    calcState.firstNumber = parseFloat(calcState.displayValue);
  }

  calcState.currentOperator = op;
  calcState.waitingForSecondNumber = true;
  calcState.shouldResetDisplay = true;
}

/**
 * Computes the pending operation from calcState and displays the result,
 * leaving state ready for chained operations.
 * @returns {number|null} The rounded result, or null when the operation failed.
 */
function calculate() {
  if (calcState.firstNumber === null || calcState.currentOperator === null) {
    return parseFloat(calcState.displayValue);
  }

  const secondNumber = parseFloat(calcState.displayValue);

  let result;
  try {
    result = operate(calcState.currentOperator, calcState.firstNumber, secondNumber);
    result = roundResult(result);
  } catch (error) {
    showError(error.message);
    calcState.currentOperator = null;
    calcState.waitingForSecondNumber = false;
    calcState.shouldResetDisplay = true;
    return null;
  }

  calcState.firstNumber = result;
  calcState.displayValue = String(result);
  calcState.currentOperator = null;
  calcState.waitingForSecondNumber = false;
  calcState.shouldResetDisplay = true;

  updateDisplay(result);
  return result;
}

/**
 * Resets calcState and the display to their starting values.
 * @returns {void}
 */
function clearCalculator() {
  calcState.firstNumber = null;
  calcState.currentOperator = null;
  calcState.displayValue = "0";
  calcState.waitingForSecondNumber = false;
  calcState.shouldResetDisplay = false;

  updateDisplay("0");
}

const displayEl = document.getElementById("display");

/**
 * Shows a value on the display and clears any error styling.
 * @param {number|string} value - What the display should show.
 * @returns {void}
 */
function updateDisplay(value) {
  displayEl.textContent = String(value);
  displayEl.classList.remove("error");
}

/**
 * Shows an error message on the display in the error style.
 * @param {string} message
 * @returns {void}
 */
function showError(message) {
  updateDisplay(message);
  displayEl.classList.add("error");
}

/**
 * Rounds a number to 2 decimal places; values at 1e13 and above are returned
 * unchanged because x * 100 loses precision there.
 * @param {number} number
 * @returns {number}
 */
function roundResult(number) {
  if (Math.abs(number) < 1e13) {
    return Math.round(number * 100) / 100;
  }
  return number;
}
