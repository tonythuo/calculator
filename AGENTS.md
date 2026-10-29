PROJECT 1: CALCULATOR — Detailed Schedule
Project Lead: Tony
Deadline: Friday submission
Rule: One Function, One Job
Team Roles
Person
	Layer
	Functions They Own
	Tony
	Structure & Input
	HTML, buttons, event listeners, keyboard support, dispatcher
	You
	Logic & State
	Math operations, state management, chained operations, error handling
	Karim
	Output & Feedback
	Display updates, error messages, number rounding
	TUESDAY — Structure + Stubs + Core Logic
Morning (15 min): Contract Agreement
All three confirm the interface contract (see bottom of this section) and create the /calculator folder with index.html, style.css, script.js.
Afternoon: Build
Person
	Tasks
	Deliverable by End of Day
	Tony
	Write HTML: display div, digit buttons (data-number="0" through "9"), operator buttons (data-operator="+" / "-" / "*" / "/"), equals button (id="equals"), clear (id="clear"), decimal (id="decimal"), backspace (id="backspace"). Write stubs: appendNumber(), appendDecimal(), backspace(), handleKeyboard(), setupButtons(). Write the dispatcher handleButtonClick(event) — reads data-number, data-operator, or id and routes to the correct function.
	HTML complete. All buttons clickable. Dispatcher routes to stubs and logs to console.
	You
	Write add(a, b), subtract(a, b), multiply(a, b), divide(a, b) — pure math functions, return numbers. Write operate(op, a, b) — calls correct function based on operator string. Write chooseOperator(op) — updates calcState.firstNumber and calcState.currentOperator. Write calculate() — uses calcState to compute result. Write clearCalculator() — resets all state. Test each in console.
	All math functions return correct values in console. operate("+", 5, 3) returns 8. clearCalculator() resets state.
	Karim
	Write updateDisplay(value) — sets display div's textContent. Write showError(message) — displays error in display div. Write roundResult(number) — returns number rounded to 2 decimal places (or however many fit). Test each with hardcoded values.
	updateDisplay("42") shows "42" on screen. showError("Cannot divide by zero") shows error. roundResult(3.14159) returns 3.14.
	End of Day Checkpoint (5 PM, 15 min):
* Buttons clickable, dispatcher fires, stubs log to console.
* Math functions verified in console.
* Display updates with hardcoded values.
* No integration yet — just each layer working independently.
WEDNESDAY — Full Integration + Gotchas
Morning Standup (10 min): Each person: what finished, what's today, what's blocking.
Person
	Tasks
	Deliverable by End of Day
	Tony
	Wire the dispatcher: handleButtonClick calls appendNumber (for digits), chooseOperator (for operators — your function), calculate (for equals — your function), clearCalculator (for clear — your function), appendDecimal, backspace. Write appendNumber(num) — appends digit to calcState.displayValue, calls updateDisplay. Write appendDecimal() — adds "." only if none exists. Write backspace() — removes last character. Write handleKeyboard(event) — maps keyboard keys to the correct functions.
	Calculator works end-to-end: click digits → display updates; click operator → chooseOperator fires; click equals → calculate fires → display updates.
	You
	Implement chained operations: when chooseOperator is called and firstNumber and currentOperator already exist and second number is entered, calculate() runs first, result becomes new firstNumber, then new operator is stored. Add divide-by-zero check in divide() — throw error or return special value that Karim's showError can display. Add waitingForSecondNumber logic — after an operator, next digit starts fresh display.
	Chained ops work: 12 + 7 - 5 → 19 → 14. 5 / 0 shows error. Pressing operator after number shows result as new starting point.
	Karim
	Fix display edge cases: long decimals overflow (use roundResult), backspace on empty display (prevent error), error display (clear error on next digit), display "0" on load. Ensure updateDisplay handles both string and number inputs.
	Display is clean: no overflow, no crashes on backspace, error clears on new input, starts at "0".
	End of Day Checkpoint (5 PM, 15 min):
* Calculator fully functional in browser.
* All gotchas from the assignment addressed:
   * [ ] Chained operations (12 + 7 - 5)
   * [ ] Divide by zero error
   * [ ] Only one decimal per number
   * [ ] Clear resets everything
   * [ ] Backspace works
   * [ ] Keyboard support
   * [ ] Long decimals rounded
   * [ ] "=" before all numbers doesn't crash
THURSDAY — Polish + Cross-Test
Morning Standup (10 min).
Person
	Tasks
	Deliverable by End of Day
	Tony
	Final test of input layer: keyboard support, all buttons, edge cases (clicking operator twice in a row, equals with no operator, decimal after operator). Fix any input bugs.
	Input layer bug-free.
	You
	Final test of logic: verify all math functions, chained ops with multiple operators, divide by zero, clear mid-operation, equals after equals (repeat last operation if that's desired). Fix any logic bugs.
	Logic layer bug-free.
	Karim
	Final test of output: display updates correctly for all scenarios, error messages clear properly, rounding works. Fix any display bugs.
	Output layer bug-free.
	Afternoon (1 hour): Cross-Testing
* Karim tests Calculator end-to-end (he didn't build input or logic).
* You test Calculator end-to-end (you didn't build input or output).
* Tony fixes any bugs reported.
End of Day Checkpoint (5 PM):
* Calculator fully working, cross-tested, bugs fixed.
* Code reviewed for One-Function-One-Job violations.
* Presentation rehearsal — Tony does 5-min walkthrough.
FRIDAY — Final Test + Submit
Morning (9–11 AM):
Person
	Task
	Tony
	Final end-to-end test. Verify all gotchas. Package folder.
	You
	Verify logic functions do exactly one job each. No function does "and."
	Karim
	Verify output functions don't calculate — they only display.
	11 AM: Submit /calculator folder (index.html, style.css, script.js).
Presentation: Tony presents Calculator (5 min) — explains the project, the split, and one example of One-Function-One-Job.
Calculator Interface Contract
const calcState = {
 firstNumber: null,
 currentOperator: null,
 displayValue: "0",
 waitingForSecondNumber: false,
 shouldResetDisplay: false
};

// Tony (Input) provides:
appendNumber(num)                  // appends digit to calcState.displayValue
appendDecimal()                    // adds "." if none exists
backspace()                        // removes last char from displayValue
handleKeyboard(event)              // routes keypress to correct function
setupButtons()                     // attaches listeners to all buttons
handleButtonClick(event)           // dispatcher: reads data-* and calls correct function

// You (Logic) provides:
add(a, b)                          // returns a + b
subtract(a, b)                     // returns a - b
multiply(a, b)                     // returns a * b
divide(a, b)                       // returns a / b or throws "Cannot divide by zero"
operate(op, a, b)                  // returns result of correct operation
chooseOperator(op)                 // updates calcState (firstNumber, currentOperator)
calculate()                        // returns result using calcState
clearCalculator()                  // resets calcState

// Karim (Output) provides:
updateDisplay(value)               // sets display div textContent
showError(message)                 // shows error in display div
roundResult(number)                // returns rounded number
