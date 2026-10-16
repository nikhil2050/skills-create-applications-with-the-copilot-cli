#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be finite numbers.");
  }

  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return left / right;
    default:
      throw new Error(`Unsupported operation: ${operator}`);
  }
}

function run() {
  const [leftInput, operator, rightInput, ...extraArgs] = process.argv.slice(2);

  if (
    leftInput === undefined ||
    operator === undefined ||
    rightInput === undefined ||
    extraArgs.length > 0
  ) {
    console.error("Usage: node src/calculator.js <number> <+|-|*|/> <number>");
    process.exitCode = 1;
    return;
  }

  if (leftInput.trim() === "" || rightInput.trim() === "") {
    console.error("Both operands must be finite numbers.");
    process.exitCode = 1;
    return;
  }

  const left = Number(leftInput);
  const right = Number(rightInput);

  try {
    console.log(calculate(left, operator, right));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  run();
}

module.exports = { calculate };
